const card = document.getElementById("card");

// ====================
// CARD FLIP
// ====================
function flipToSignup() { card.classList.add("flipped"); }
function flipToLogin() { card.classList.remove("flipped"); }

// ====================
// DEMO LOGIN & SIGNUP
// ====================
function login() {
  const phone = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;
  if (!phone || !pass) return alert("Enter phone & password");
  alert("Login successful (demo)");
}

function signup() {
  const name = document.getElementById("fullName").value;
  const phone = document.getElementById("signupPhone").value;
  const pass = document.getElementById("signupPassword").value;
  if (!name || !phone || !pass) return alert("Fill all fields");
  alert("Signup successful (demo)");
}

// ====================
// EVENT LISTENERS
// ====================
document.addEventListener("DOMContentLoaded", () => {
  // Telegram ready
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }

  // Flip events
  document.getElementById("toSignup").addEventListener("click", flipToSignup);
  document.getElementById("toLogin").addEventListener("click", flipToLogin);
  document.getElementById("backToLogin").addEventListener("click", flipToLogin);

  // Demo buttons
  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("signupBtn").addEventListener("click", signup);
});