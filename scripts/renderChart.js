async function renderPositionChart({ csvPath, canvasId, chartTitle, gradeIndex = 15, canvasHeight = 50 }) {
  const { names, grades } = await fetchData(csvPath, gradeIndex);

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with ID "${canvasId}" not found.`);
    return;
  }

  canvas.height = names.length * canvasHeight;

  const min = Math.min(...grades);
  const max = Math.max(...grades);

  const goldGradient = grades.map(grade => {
    const t = (grade - min) / (max - min); // normalize to [0,1]
    const r = Math.round(140 + t * (255 - 140)); // Red: 140 → 255
    const g = Math.round(120 + t * (215 - 120)); // Green: 120 → 215
    const b = Math.round(40  + t * (60 - 40));   // Blue: 40 → 60
    return `rgba(${r}, ${g}, ${b}, 0.9)`; // Fill color
  });

  const borderColors = goldGradient.map(c => c.replace(', 0.9', ', 1'));

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'HoF Grade',
        data: grades,
        backgroundColor: goldGradient,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'HoF Grade',
            color: '#ccc'
          },
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: '#333'
          }
        },
        y: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            color: '#ccc'
          },
          grid: {
            color: '#222'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          color: '#fff',
          font: {
            size: 18
          }
        },
        tooltip: {
          callbacks: {
            label: context => {
              const name = context.label;
              const value = context.parsed.x;
              return `${name}: HoF Grade ${value}`;
            }
          }
        }
      }
    }
  });
}
