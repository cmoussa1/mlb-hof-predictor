async function renderPositionChart({ csvPath, canvasId, chartTitle, gradeIndex = 15, canvasHeight = 50 }) {
  const { names, grades } = await fetchData(csvPath, gradeIndex);

  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with ID "${canvasId}" not found.`);
    return;
  }

  canvas.height = names.length * canvasHeight;

  const ctx = canvas.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'HoF Grade',
        data: grades,
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: { display: true, text: 'HoF Grade' }
        },
        y: {
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0
          }
        }
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: chartTitle
        }
      }
    }
  });
}
