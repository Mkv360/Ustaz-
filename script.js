const tg = window.Telegram.WebApp;

// Expand WebApp to full height
tg.expand();
tg.ready();

// Slide logic
function showSignup() {
  document.querySelector(".login-card").classList.remove("active");
  document.querySelector(".login-card").classList.add("hidden-left");
  document.querySelector(".signup-card").classList.add("active");
}

function showLogin() {
  document.querySelector(".signup-card").classList.remove("active");
  document.querySelector(".login-card").classList.remove("hidden-left");
  document.querySelector(".login-card").classList.add("active");
}

// Show extra fields for Ustaz
const userType = document.getElementById("userType");
const ustazFields = document.getElementById("ustazFields");

if (userType) {
  userType.addEventListener("change", () => {
    ustazFields.classList.toggle("hidden", userType.value !== "ustaz");
  });
}

// TEMP actions (frontend only)
function login() {
  tg.showPopup({
    title: "Login",
    message: "Login successful (demo)",
    buttons: [{ type: "ok" }]
  });
}

function signup() {
  tg.showPopup({
    title: "Signup",
    message: "Account created (demo)",
    buttons: [{ type: "ok" }]
  });
}