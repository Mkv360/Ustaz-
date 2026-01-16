// ===============================
// CARD FLIP (Login <-> Signup)
// ===============================
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");
}

function goBack() {
  card.classList.remove("flipped");
}

// ===============================
// LOGIN VALIDATION
// ===============================
function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!phone || !password) {
    showMessage("Please fill in all login fields");
    return;
  }

  successMessage("Login successful (demo)");
}

// ===============================
// SIGNUP VALIDATION
// ===============================
function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const password = document.getElementById("signupPassword").value.trim();

  if (!role || !name || !email || !subcity || !area || !password) {
    showMessage("Please fill in all signup fields");
    return;
  }

  successMessage("Account created successfully (demo)");
  flipCard(); // return to login
}

// ===============================
// TELEGRAM / BROWSER ALERT HANDLER
// ===============================
function showMessage(message) {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
}

function successMessage(message) {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.showPopup({
      title: "Success",
      message: message,
      buttons: [{ type: "ok" }]
    });
  } else {
    alert(message);
  }
}

// ===============================
// ADDIS ABABA SUBCITY -> AREA
// ===============================
const areas = {
  bole: [
    "Bole Medhanealem",
    "Bole Atlas",
    "Gerji",
    "CMC",
    "Bulbula"
  ],
  yeka: [
    "Megenagna",
    "Kotebe",
    "Summit",
    "Ayat"
  ],
  kirkos: [
    "Kazanchis",
    "Mexico",
    "Meskel Flower"
  ],
  lideta: [
    "Lideta",
    "Abinet",
    "Tor Hailoch"
  ],
  arada: [
    "Piazza",
    "Arat Kilo",
    "Sidist Kilo"
  ],
  addisketema: [
    "Merkato",
    "Sebategna"
  ],
  nifassilk: [
    "Jemo",
    "Lancha",
    "Sar Bet"
  ],
  kolfe: [
    "Kolfe",
    "Asko"
  ],
  akakikaliti: [
    "Akaki",
    "Kality"
  ],
  gullele: [
    "Shiro Meda",
    "Entoto"
  ]
};

function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const areaSelect = document.getElementById("area");

  areaSelect.innerHTML = `<option value="">Select Area</option>`;

  if (!subcity) return;

  areas[subcity].forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaSelect.appendChild(option);
  });
}

// ===============================
// TELEGRAM WEBAPP INIT
// ===============================
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}