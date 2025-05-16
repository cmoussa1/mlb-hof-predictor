function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.hamburger').addEventListener('click', toggleSidebar);
});

async function fetchData(csvPath, gradeIndex = 15) {
    try {
      const response = await fetch(csvPath);
      const text = await response.text();
      const lines = text.trim().split('\n').slice(1);
      const names = [];
      const grades = [];

      for (const line of lines) {
        const columns = line.split(',');
        const name = columns[0];
        const hofGrade = parseFloat(columns[gradeIndex]);
        if (!isNaN(hofGrade)) {
          names.push(name);
          grades.push(hofGrade);
        }
      }

      // combine names and grades into objects, sort by grade descending
      const sorted = names.map((name, i) => ({ name, grade: grades[i] }))
                          .sort((a, b) => b.grade - a.grade);

      // split sorted objects back into names and grades
      const sortedNames = sorted.map(item => item.name);
      const sortedGrades = sorted.map(item => item.grade);

      return { names: sortedNames, grades: sortedGrades };

    } catch (error) {
      console.error('Error loading CSV:', error);
      return { names: [], grades: [] };
    }
}

function getGoldByValue(value) {
    const intensity = Math.min(1, Math.max(0, (value - 35) / 20))
    return `rgba(255, 215, 0, ${0.4 + 0.6 * intensity})`;
}
