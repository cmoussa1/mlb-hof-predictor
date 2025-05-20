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

    renderCandidateChart(position, hofGrade, name);
}


function renderCandidateChart(position, hofGrade, candidateName) {
    const group = hofDataByPosition[position];
    if (!group || group.length === 0) return;

    const sortedGroup = group
      .map(player => ({ name: player.name, grade: player.hofGrade }))
      .concat({ name: candidateName, grade: hofGrade })
      .sort((a, b) => b.grade - a.grade);

    const labels = sortedGroup.map(player => player.name);
    const data = sortedGroup.map(player => player.grade);
    const backgroundColors = sortedGroup.map(player =>
      player.name === candidateName ? '#2e50a0' : '#bd9c0b'
    );

    const canvas = document.getElementById("candidateComparisonChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.height = 100;

    if (window.candidateChart) {
      window.candidateChart.destroy();
    }

    window.candidateChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "HoF Grade",
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `HoF Grade Comparison: ${position}s`
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: "HoF Grade" }
          },
          y: {
            ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 }
          }
        }
      }
    });
}

let candidateData = [];

async function loadCandidates() {
  try {
    const response = await fetch('general_data/candidates.csv');
    const text = await response.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');

    candidateData = lines.slice(1).map(line => {
      const cols = line.split(',');
      return {
        name: cols[0],
        position: cols[1],
        oWAR: parseFloat(cols[2]),
        dWAR: parseFloat(cols[3]),
        wOBA: parseFloat(cols[4]),
        wRCPlus: parseInt(cols[5]),
      };
    });

    const select = document.getElementById('candidateSelect');
    candidateData.forEach(c => {
      const option = document.createElement('option');
      option.value = c.name;
      option.textContent = c.name;
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Failed to load candidates.csv:', error);
  }
}

document.getElementById('candidateSelect').addEventListener('change', (e) => {
  const selectedName = e.target.value;
  const selected = candidateData.find(c => c.name === selectedName);
  if (!selected) return;

  // autofill the form
  document.getElementById('playerName').value = selected.name;
  document.getElementById('position').value = selected.position;
  document.getElementById('oWAR').value = selected.oWAR;
  document.getElementById('dWAR').value = selected.dWAR;
  document.getElementById('wOBA').value = selected.wOBA;
  document.getElementById('wRCPlus').value = selected.wRCPlus;

  predictHOF();
});

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
    loadCandidates();
    loadCSVData('SS', 'positional_data/ss_data.csv');
    loadCSVData('C', 'positional_data/c_data.csv');
    loadCSVData('1B', 'positional_data/1b_data.csv');
    loadCSVData('2B', 'positional_data/2b_data.csv');
    loadCSVData('3B', 'positional_data/3b_data.csv');
    loadCSVData('OF', 'positional_data/of_data.csv');
    loadCSVData('DH', 'positional_data/dh_data.csv');
    handleVisibility();
};

window.addEventListener('scroll', handleVisibility);
