// Telegram WebApp init
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Navigation
function goTo(page) {
  window.location.href = page;
}

// Example submit handler
function handleSignup(e) {
  e.preventDefault();

  const role = document.getElementById("role")?.value;
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const area = document.getElementById("area")?.value;
  const password = document.getElementById("password")?.value;

  const data = {
    telegram_id: tg.initDataUnsafe?.user?.id || null,
    role,
    name,
    email,
    area,
    password
  };

  console.log("Signup data:", data);

  tg.showAlert("Signup successful (frontend demo)");
}