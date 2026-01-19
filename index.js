const BASE_URL = "https://username.github.io/Ustaz-"; // your GitHub Pages link

function goToSignup() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.openLink(`${BASE_URL}/signup.html`, true); // open in webapp
  } else {
    window.location.href = "signup.html";
  }
}

function goToLogin() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.openLink(`${BASE_URL}/index.html`, true);
  } else {
    window.location.href = "index.html";
  }
}

function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass) {
    alert("Enter phone and password");
    return;
  }

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showPopup({
      title: "Success",
      message: "Login successful (demo)",
      buttons: [{ type: "ok" }]
    });
    Telegram.WebApp.openLink(`${BASE_URL}/home.html`, true);
  } else {
    window.location.href = "home.html";
  }
}