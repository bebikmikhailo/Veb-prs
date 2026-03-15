import { generateRandomNumber } from "./utils.js";
import "./theme.js";
import "./clock.js";


console.log(new Date().getHours());

const parametersValues = JSON.parse(localStorage.getItem('parametersValues')) || [
  {
    value: generateRandomNumber(400, 1000),
    min: 400,
    max: 1000,
    minNormal: 600,
    maxNormal: 900,
  },
  {
    value: generateRandomNumber(0, 500),
    min: 0,
    max: 500,
    minNormal: 100,
    maxNormal: 450,
  },
  {
    value: generateRandomNumber(600, 800),
    min: 600,
    max: 800,
    minNormal: 650,
    maxNormal: 750,
  },
  {
    value: generateRandomNumber(20, 85),
    min: 20,
    max: 85,
    minNormal: 30,
    maxNormal: 70,
  },
  {
    value: generateRandomNumber(12, 20),
    min: 12,
    max: 20,
    minNormal: 15,
    maxNormal: 17,
  }
]

function updateParametersValues() {
  const values = document.querySelectorAll('.js-parameters-value');
  values.forEach((valueHolder, index) => {
    valueHolder.textContent = parametersValues[index].value;
  });
}

function generateParametersValues() {
    parametersValues.forEach((object) => {
      object.value = generateRandomNumber(object.min, object.max)
    });
}


function saveParamValuesToStorage() {
  localStorage.setItem('parametersValues', JSON.stringify(parametersValues));
}

function updateParamContainer() {
  updateParametersValues();
  saveParamValuesToStorage();
  renderParametersStatus();
  updateLastUpdatesTime();
}

updateParamContainer();


document.querySelector('.js-update-button').addEventListener("click", () => {
  generateParametersValues();
  updateParamContainer();
})

let intervalId;

const autoUpdateButton = document.querySelector('.js-auto-update-button');

autoUpdateButton.addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    autoUpdateButton.classList.remove('auto-update-button-pressed');
    autoUpdateButton.innerHTML = `<img src="./images/light-auto-refresh.png" alt="auto reload image" class="auto-update-button-image">
            <span>Автооновлення</span>`;
    return;
  }
  

  autoUpdateButton.classList.add('auto-update-button-pressed');
  autoUpdateButton.innerHTML = `<img src="./images/light-cross-icon.png" alt="cross image" class="auto-update-button-image">
            <span>Зупинити</span>`;
  intervalId = setInterval(() => {
    generateParametersValues();
    updateParamContainer();
  }, 500)
})



function renderParametersStatus() {
  const paramStatuses = document.querySelectorAll('.parameters-visual-status');
  paramStatuses.forEach((status, index) => {
    const {
       value,
       min,
       max,
       minNormal,
       maxNormal
    } = parametersValues[index];

    const leftNumberArea = minNormal - min;
    const rightNumberArea = max - maxNormal;

    const dangerPercent = 0.01;
    const midPercent = 0.99;

    const minDangerLeftBound = min;
    const maxDangerLeftBound = minDangerLeftBound + (dangerPercent * leftNumberArea);

    const minMidLeftBound = maxDangerLeftBound + 0.01;
    const maxMidLeftBound = minMidLeftBound + (midPercent * leftNumberArea) - 0.01;

    const minMidRightBound = maxNormal + 0.01;
    const maxMidRightBound = minMidRightBound + (midPercent * rightNumberArea) - 0.01;

    const minDangerRightBound = maxMidRightBound + 0.01;
    const maxDangerRightBound = minDangerRightBound + (dangerPercent * rightNumberArea) - 0.01;

    let color;

    if (value >= minNormal && value <= maxNormal) {
      color = "green";
    }
    else if ((value >= minMidLeftBound && value <= maxMidLeftBound) ||
            (value >= minMidRightBound && value <= maxMidRightBound) )
    {
      color = "orange";
    }
    else if ((value >= minDangerLeftBound && value <= maxDangerLeftBound) ||
            (value >= minDangerRightBound && value <= maxDangerRightBound) )   
    {
      color = "red";
    }

    status.style.backgroundColor = color;
  });
}

function updateLastUpdatesTime() {
  const time = new Date().toLocaleString();
  const str = `Останнє оновлення: ${time}`;
  document.querySelector('.last-update-time').innerHTML = str;
}



