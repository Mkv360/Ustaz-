// ===============================
// CARD REFERENCE
// ===============================
const card = document.getElementById("card");

// ===============================
// ALERTS
// ===============================
function showMessage(msg) { 
  if (window.Telegram?.WebApp) Telegram.WebApp.showAlert(msg); 
  else alert(msg); 
}

function successMessage(msg) { 
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showPopup({ 
      title: "Success", 
      message: msg, 
      buttons: [{ type: "ok" }] 
    }); 
  } else alert(msg); 
}

// ===============================
// ETHIOPIAN PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g,'');
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

// ===============================
// LOGIN FUNCTION (demo)
// ===============================
function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass) return showMessage("Enter valid phone & password");

  // For now, demo login always succeeds
  successMessage("Login successful (demo)");

  // Show home page
  openHome();
}

// ===============================
// OPEN HOME PAGE
// ===============================
function openHome() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.openLink("home.html", true); // open inside Telegram WebApp
  } else {
    window.location.href = "home.html"; // fallback for browser
  }
}

// ===============================
// BACK BUTTON
// ===============================
function goBack() {
  window.history.back(); // simple back navigation
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});