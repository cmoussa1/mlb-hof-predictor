async function renderBarChartFromCSV({
  csvPath,
  canvasId,
  chartTitle,
  datasetLabel,
  backgroundColor,
  borderColor,
  yAxis = {},
  tooltipPrecision = 2,
  colorFunction = null
}) {
  try {
    const response = await fetch(csvPath);
    const text = await response.text();
    const [headerLine, dataLine] = text.trim().split('\n');

    const labels = headerLine.split(',');
    const data = dataLine.split(',').map(val => parseFloat(val));

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: datasetLabel,
          data,
          backgroundColor: colorFunction ? data.map(colorFunction) : backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: yAxis.beginAtZero ?? true,
            min: yAxis.min,
            max: yAxis.max,
            ticks: {
              stepSize: yAxis.stepSize,
            },
            title: {
              display: true,
              text: yAxis.title || ''
            }
          },
          x: {
            title: {
              display: true,
              text: 'positional group'
            }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: chartTitle
          },
          tooltip: {
            callbacks: {
              label: context => `${context.parsed.y.toFixed(tooltipPrecision)}`
            }
          }
        }
      }
    });
  } catch (error) {
    console.error(`Error loading ${csvPath}:`, error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderBarChartFromCSV({
    csvPath: 'general_data/avg_hof_grade_by_position.csv',
    canvasId: 'avgGradeByPositionChart',
    chartTitle: 'Average HoF Grade by Position',
    datasetLabel: 'Average HoF Grade',
    backgroundColor: null,
    borderColor: '#bd9c0b',
    tooltipPrecision: 2,
    colorFunction: getGoldByValue,
    yAxis: {
      beginAtZero: true,
      title: 'average grade'
    }
  });

  await renderBarChartFromCSV({
    csvPath: 'general_data/avg_owar_by_position.csv',
    canvasId: 'avgOWARByPositionChart',
    chartTitle: 'Average oWAR by Position',
    datasetLabel: 'Average oWAR',
    backgroundColor: '#2bbfe0',
    borderColor: '#2bbfe0',
    yAxis: {
      beginAtZero: false,
      min: 40,
      max: 65,
      stepSize: 5,
      title: 'oWAR'
    }
  });

  await renderBarChartFromCSV({
    csvPath: 'general_data/avg_dwar_by_position.csv',
    canvasId: 'avgDWARByPositionChart',
    chartTitle: 'Average dWAR by Position',
    datasetLabel: 'Average dWAR',
    backgroundColor: '#cb2be0',
    borderColor: '#cb2be0',
    yAxis: {
      beginAtZero: false,
      min: -20,
      max: 20,
      stepSize: 10,
      title: 'dWAR'
    }
  });

  await renderBarChartFromCSV({
    csvPath: 'general_data/avg_woba_by_position.csv',
    canvasId: 'avgWOBAByPositionChart',
    chartTitle: 'Average w/OBA by Position',
    datasetLabel: 'Average w/OBA',
    backgroundColor: '#2be043',
    borderColor: '#2be043',
    tooltipPrecision: 3,
    yAxis: {
      beginAtZero: false,
      min: 0.30,
      max: 0.42,
      stepSize: 0.02,
      title: 'w/OBA'
    }
  });

  await renderBarChartFromCSV({
    csvPath: 'general_data/avg_wrcplus_by_position.csv',
    canvasId: 'avgWRCPlusByPositionChart',
    chartTitle: 'Average wRC+ by Position',
    datasetLabel: 'Average wRC+',
    backgroundColor: '#e03a2b',
    borderColor: '#e03a2b',
    tooltipPrecision: 3,
    yAxis: {
      beginAtZero: false,
      min: 100,
      max: 145,
      stepSize: 5,
      title: 'wRC+'
    }
  });
});
