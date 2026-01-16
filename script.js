const tg = window.Telegram.WebApp;
tg.ready();

function flipCard() {
  document.getElementById("card").classList.toggle("flip");
}