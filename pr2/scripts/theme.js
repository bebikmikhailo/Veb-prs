if (localStorage.getItem('theme') === 'dark') {
      document.querySelector('.moon-icon-image').src = "./images/light-moon-icon.png";
}

const themeToggler = document.querySelector('.theme-checkbox')

const currentTheme = localStorage.getItem('theme');

if (currentTheme === "dark") {
  document.body.classList.add('dark-theme');
  themeToggler.checked = true;
}

themeToggler.addEventListener("change", () => {
  setTimeout(() => {
    document.body.classList.toggle('dark-theme');

    document.querySelector('.moon-icon-image').src = "./images/grey-moon-icon.png";

    let theme = "light";
    if (document.body.classList.contains('dark-theme')) {
    theme = "dark";
    document.querySelector('.moon-icon-image').src = "./images/light-moon-icon.png";
    }

    localStorage.setItem('theme', theme);
  }, 200);
});