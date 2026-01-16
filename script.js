const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");
}

function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!phone || !password) {
    alert("Please fill in all fields");
    return;
  }

  // Telegram WebApp ready
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showAlert("Login successful (demo)");
  } else {
    alert("Login successful (demo)");
  }
}