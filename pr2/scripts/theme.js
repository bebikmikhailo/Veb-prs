import { darkChartTheme, lightChartTheme } from "./chart.js";

const themeToggler = document.querySelector('.theme-checkbox')

const currentTheme = localStorage.getItem('theme');

if (currentTheme === "dark") {
  document.querySelector('.moon-icon-image').src = "./images/light-moon-icon.png";
  document.body.classList.add('dark-theme');
  themeToggler.checked = true;
  darkChartTheme();
}

themeToggler.addEventListener("change", () => {
  setTimeout(() => {
    document.body.classList.toggle('dark-theme');
    document.querySelector('.moon-icon-image').src = "./images/grey-moon-icon.png";
    lightChartTheme();

    let theme = "light";
    if (document.body.classList.contains('dark-theme')) {
      theme = "dark";
      document.querySelector('.moon-icon-image').src = "./images/light-moon-icon.png";
      darkChartTheme();
    }

    localStorage.setItem('theme', theme);
  }, 200);
});