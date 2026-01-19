const card = document.getElementById("card");

// ===============================
// NAVIGATION FUNCTIONS
// ===============================
function goToSignup() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.openLink("signup.html", true); // opens inside Telegram WebApp
  } else {
    window.location.href = "signup.html"; // fallback for browser
  }
}

function goToLogin() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.openLink("login.html", true); // opens inside Telegram WebApp
  } else {
    window.location.href = "login.html"; // fallback for browser
  }
}

function goToLoginCard() {
  card.classList.remove("flipped");
}

function goToSignupCard() {
  card.classList.add("flipped");
}

// ===============================
// INIT TELEGRAM WEBAPP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});