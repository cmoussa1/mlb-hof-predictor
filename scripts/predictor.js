// scripts/predictor.js

const hofDataByPosition = {
    'SS': [], 'C': [], '1B': [], '2B': [], '3B': [], 'OF': [], 'DH': []
};
  
async function loadCSVData(positionKey, fileName) {
    try {
      const response = await fetch(fileName);
      const text = await response.text();
      const lines = text.trim().split('\n').slice(1); // Skip header
      hofDataByPosition[positionKey] = lines.map(line => {
        const columns = line.split(',');
        const name = columns[0];
        const hofGrade = parseFloat(columns[15]); // 16th column is index 15
        return { name, hofGrade };
      });
      console.log(`Loaded ${positionKey} HoF data:`, hofDataByPosition[positionKey]);
    } catch (error) {
      console.error(`Failed to load ${fileName}:`, error);
    }
}
  
function predictHOF() {
    const name = document.getElementById('playerName').value.trim();
    const position = document.getElementById('position').value.trim().toUpperCase();
    const oWAR = parseFloat(document.getElementById('oWAR').value);
    const dWAR = parseFloat(document.getElementById('dWAR').value);
    const wOBA = parseFloat(document.getElementById('wOBA').value);
    const wRCPlus = parseFloat(document.getElementById('wRCPlus').value);
    const resultEl = document.getElementById('result');
  
    if (!name || !position || isNaN(oWAR) || isNaN(dWAR) || isNaN(wOBA) || isNaN(wRCPlus)) {
      resultEl.innerText = 'Please enter all fields correctly, including position.';
      return;
    }
  
    if (!hofDataByPosition[position] || hofDataByPosition[position].length === 0) {
      resultEl.innerText = `No data available for position: ${position}`;
      return;
    }
  
    const hofGrade = (oWAR * 0.4 + dWAR * 0.3 + wOBA * 0.15 + wRCPlus * 0.15);
    const group = hofDataByPosition[position];
    const sortedGrades = group.map(player => player.hofGrade).sort((a, b) => a - b);
    const rank = sortedGrades.filter(g => g <= hofGrade).length;
    const percentile = ((rank / sortedGrades.length) * 100).toFixed(2);
    const averageGrade = sortedGrades.reduce((sum, val) => sum + val, 0) / sortedGrades.length;
    const gradeDiff = hofGrade - averageGrade;
  
    let probability = 0;
    if (percentile > 45) {
      if (gradeDiff >= -2) probability = 80;
      else if (gradeDiff >= -3) probability = 80;
      else if (gradeDiff >= -5) probability = 65;
      else if (gradeDiff >= -7) probability = 50;
      else if (gradeDiff >= -9) probability = 35;
      else probability = 20;
    } else {
      if (gradeDiff >= -2) probability = 65;
      else if (gradeDiff >= -3) probability = 65;
      else if (gradeDiff >= -5) probability = 50;
      else if (gradeDiff >= -7) probability = 35;
      else if (gradeDiff >= -9) probability = 20;
      else probability = 5;
    }
  
    resultEl.innerHTML = "";
  
    const lines = [
      `estimated probability of election: ${probability}%.`,
      `${name} has a HoF Grade of ${hofGrade.toFixed(2)}.`,
      `percentile among elected HoF ${position}s: ${percentile}%.`,
      `difference from average HoF grade among elected HoF ${position}s: ${gradeDiff.toFixed(2)}.`
    ];
  
    lines.forEach((line, index) => {
      setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = line;
        p.style.opacity = 0;
        resultEl.appendChild(p);
  
        setTimeout(() => {
          p.style.transition = "opacity 0.6s ease-in";
          p.style.opacity = 1;
        }, 50);
      }, index * 1000);
    });
}
  
function handleVisibility() {
    const sections = document.querySelectorAll('.description-section');
    const triggerPoint = window.innerHeight * 0.9;
  
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
  
      if (sectionTop < triggerPoint || document.body.scrollHeight <= window.innerHeight) {
        section.classList.add('visible');
      }
    });
}
  
window.onload = () => {
    loadCSVData('SS', 'positional_data/ss_data.csv');
    loadCSVData('C', 'positional_data/c_data.csv');
    loadCSVData('1B', 'positional_data/1b_data.csv');
    loadCSVData('2B', 'positional_data/2b_data.csv');
    loadCSVData('3B', 'positional_data/3b_data.csv');
    loadCSVData('OF', 'positional_data/of_data.csv');
    loadCSVData('DH', 'positional_data/dh_data.csv');
  
    handleVisibility(); // initial run
};
  
window.addEventListener('scroll', handleVisibility);
  