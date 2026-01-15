// Telegram WebApp init
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

function showSignup() {
  document.querySelector(".login-card").classList.remove("active");
  document.querySelector(".signup-card").classList.add("active");
}

function showLogin() {
  document.querySelector(".signup-card").classList.remove("active");
  document.querySelector(".login-card").classList.add("active");
}

function toggleUstazFields() {
  const type = document.getElementById("userType").value;
  document.getElementById("ustazFields").style.display =
    type === "ustaz" ? "block" : "none";
}

function login() {
  tg.showAlert("Login clicked (frontend demo)");
}

function signup() {
  tg.showAlert("Signup clicked (frontend demo)");
}