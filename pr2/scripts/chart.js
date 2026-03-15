import { parametersValues } from "./script.js";


const ctx = document.querySelector('.js-chart').getContext('2d');

const savedLabels = JSON.parse(localStorage.getItem('chartLabels')) || [];
const savedData = JSON.parse(localStorage.getItem('chartData')) || [];

export const generationChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: savedLabels,
    datasets: [{
      label: 'Потужність (кВт)',
      data: savedData,
      borderColor: '#ff9100',
      backgroundColor: 'rgba(255, 145, 0, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  }
});


export function addDataToChart(time, value) {
  generationChart.data.labels.push(time);

  generationChart.data.datasets[0].data.push(value);


  if (generationChart.data.labels.length > 20) {
    generationChart.data.labels.shift();
    generationChart.data.datasets[0].data.shift();
  }

  localStorage.setItem('chartLabels', JSON.stringify(generationChart.data.labels));
  localStorage.setItem('chartData', JSON.stringify(generationChart.data.datasets[0].data));

  generationChart.update('none');
}

export function updateChart() {
  const currentTime = new Date().toLocaleTimeString();
  const currentPower = parametersValues[1].value;
  addDataToChart(currentTime, currentPower);
}

export function darkChartTheme() {
  generationChart.options.scales.x.ticks.color = "white";
  generationChart.options.scales.y.ticks.color = "white";
  generationChart.options.plugins.legend.labels.color = "white";
  generationChart.data.datasets[0].borderColor = "#6a2691";
  generationChart.data.datasets[0].backgroundColor = "rgba(186, 66, 255, 0.2)";
  generationChart.update()
}

export function lightChartTheme() {
  generationChart.options.scales.x.ticks.color = "grey";
  generationChart.options.scales.y.ticks.color = "grey";
  generationChart.options.plugins.legend.labels.color = "grey";
  generationChart.data.datasets[0].borderColor = "#ff9100";
  generationChart.data.datasets[0].backgroundColor = "rgba(255, 145, 0, 0.2)";
  generationChart.update()
}