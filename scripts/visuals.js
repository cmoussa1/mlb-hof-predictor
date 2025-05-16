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
