window.addEventListener('DOMContentLoaded', async () => {
  await renderAvgHoFGradeChart();
});

    async function renderAvgHoFGradeChart() {
    try {
        const response = await fetch('general_data/avg_hof_grade_by_position.csv');
        const text = await response.text();
        const [headerLine, dataLine] = text.trim().split('\n');

        const labels = headerLine.split(',');
        const data = dataLine.split(',').map(val => parseFloat(val));

        const ctx = document.getElementById('avgGradeByPositionChart').getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Average HoF Grade',
            data,
            backgroundColor: data.map(g => getGoldByValue(g)),
            borderColor: '#bd9c0b',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'average grade' }
            },
            x: {
                title: { display: true, text: 'positional group' }
            }
            },
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average HoF Grade by Position'
            },
            tooltip: {
                callbacks: {
                label: context => `Grade: ${context.parsed.y.toFixed(2)}`
                }
            }
            }
        }
        });

    } catch (error) {
        console.error('Error loading avg_hof_grade_by_position.csv:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderAvgoWARChart();
});

    async function renderAvgoWARChart() {
    try {
        const response = await fetch('general_data/avg_owar_by_position.csv');
        const text = await response.text();
        const [headerLine, dataLine] = text.trim().split('\n');

        const labels = headerLine.split(',');
        const data = dataLine.split(',').map(val => parseFloat(val));

        const ctx = document.getElementById('avgOWARByPositionChart').getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Average oWAR',
            data,
            backgroundColor: '#2bbfe0',
            borderColor: '#2bbfe0',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: false,
                min: 40,
                max: 65,
                ticks: {
                    stepSize: 5
                },
                title: { display: true, text: 'oWAR' }
            },
            x: {
                title: { display: true, text: 'positional group' }
            }
            },
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average oWAR by Position'
            },
            tooltip: {
                callbacks: {
                label: context => `${context.parsed.y.toFixed(2)}`
                }
            }
            }
        }
        });

    } catch (error) {
        console.error('Error loading avg_owar_by_position.csv:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderAvgdWARChart();
});

    async function renderAvgdWARChart() {
    try {
        const response = await fetch('general_data/avg_dwar_by_position.csv');
        const text = await response.text();
        const [headerLine, dataLine] = text.trim().split('\n');

        const labels = headerLine.split(',');
        const data = dataLine.split(',').map(val => parseFloat(val));

        const ctx = document.getElementById('avgDWARByPositionChart').getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Average dWAR',
            data,
            backgroundColor: '#cb2be0',
            borderColor: '#cb2be0',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: false,
                min: -20,
                max: 20,
                ticks: {
                    stepSize: 10
                },
                title: { display: true, text: 'dWAR' }
            },
            x: {
                title: { display: true, text: 'positional group' }
            }
            },
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average dWAR by Position'
            },
            tooltip: {
                callbacks: {
                label: context => `${context.parsed.y.toFixed(2)}`
                }
            }
            }
        }
        });

    } catch (error) {
        console.error('Error loading avg_dwar_by_position.csv:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderAvgwOBAChart();
});

    async function renderAvgwOBAChart() {
    try {
        const response = await fetch('general_data/avg_woba_by_position.csv');
        const text = await response.text();
        const [headerLine, dataLine] = text.trim().split('\n');

        const labels = headerLine.split(',');
        const data = dataLine.split(',').map(val => parseFloat(val));

        const ctx = document.getElementById('avgWOBAByPositionChart').getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Average w/OBA',
            data,
            backgroundColor: '#2be043',
            borderColor: '#2be043',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: false,
                min: 0.30,
                max: 0.42,
                ticks: {
                    stepSize: 0.2
                },
                title: { display: true, text: 'w/OBA' }
            },
            x: {
                title: { display: true, text: 'positional group' }
            }
            },
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average w/OBA by Position'
            },
            tooltip: {
                callbacks: {
                label: context => `${context.parsed.y.toFixed(3)}`
                }
            }
            }
        }
        });

    } catch (error) {
        console.error('Error loading avg_woba_by_position.csv:', error);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
  await renderAvgWRCPlusChart();
});

    async function renderAvgWRCPlusChart() {
    try {
        const response = await fetch('general_data/avg_wrcplus_by_position.csv');
        const text = await response.text();
        const [headerLine, dataLine] = text.trim().split('\n');

        const labels = headerLine.split(',');
        const data = dataLine.split(',').map(val => parseFloat(val));

        const ctx = document.getElementById('avgWRCPlusByPositionChart').getContext('2d');
        new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Average wRC+',
            data,
            backgroundColor: '#e03a2b',
            borderColor: '#e03a2b',
            borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: {
                beginAtZero: false,
                min: 100,
                max: 145,
                ticks: {
                    stepSize: 5
                },
                title: { display: true, text: 'wRC+' }
            },
            x: {
                title: { display: true, text: 'positional group' }
            }
            },
            plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average wRC+ by Position'
            },
            tooltip: {
                callbacks: {
                label: context => `${context.parsed.y.toFixed(3)}`
                }
            }
            }
        }
        });

    } catch (error) {
        console.error('Error loading avg_wrcplus_by_position.csv:', error);
    }
}
