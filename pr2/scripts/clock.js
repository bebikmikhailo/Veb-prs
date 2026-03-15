const clock = document.querySelector('.clock');

const updateClock = () => {
  const now = new Date();
  clock.innerHTML = now.toLocaleTimeString();

  const hours = now.getHours();

  if ((hours >= 23 && hours < 24) || (hours >= 0 && hours < 6) ) {
    document.querySelector('.js-time-image').src = "./images/clock-moon-image.png";
    document.querySelector('.js-time-image').alt = "moon image";
  }
  else {
    document.querySelector('.js-time-image').src = "./images/clock-sun-image.png";
    document.querySelector('.js-time-image').alt = "sun image";
  }

};

updateClock();

setInterval(updateClock, 1000);