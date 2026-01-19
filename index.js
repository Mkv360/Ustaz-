// ===============================
// OPEN PAGES
// ===============================
function goToSignup() {
  if (window.Telegram?.WebApp) {
    // open inside Telegram WebApp
    Telegram.WebApp.openLink("signup.html", true);
  } else {
    // fallback for normal browser
    window.location.href = "signup.html";
  }
}

function goToLogin() {
  // For now, index.html is the login page, so just reload
  window.location.href = "index.html";
}

// ===============================
// LOGIN FUNCTION (demo)
// ===============================
function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass) {
    alert("Enter phone and password");
    return;
  }

  // Demo login success
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showPopup({
      title: "Success",
      message: "Login successful (demo)",
      buttons: [{ type: "ok" }]
    });
    Telegram.WebApp.openLink("home.html", true); // open home in Telegram
  } else {
    alert("Login successful (demo)");
    window.location.href = "home.html"; // browser fallback
  }
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