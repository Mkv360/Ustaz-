// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");

  // Reset scroll position when flipping (Telegram-friendly)
  document.querySelectorAll(".card-content").forEach(c => {
    c.scrollTop = 0;
  });
}

// ===============================
// TELEGRAM / BROWSER ALERTS
// ===============================
function showMessage(message) {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
}

function successMessage(message) {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.showPopup({
      title: "Success",
      message,
      buttons: [{ type: "ok" }]
    });
  } else {
    alert(message);
  }
}

// ===============================
// LOGIN
// ===============================
function login() {
  const phone = document.getElementById("loginPhone")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!phone || !password) {
    showMessage("Please fill in all login fields");
    return;
  }

  successMessage("Login successful (demo)");
}

// ===============================
// SIGNUP
// ===============================
function signup() {
  const role = document.getElementById("role")?.value;
  const name = document.getElementById("fullName")?.value.trim();
  const phone = document.getElementById("signupPhone")?.value.trim();
  const subcity = document.getElementById("subcity")?.value;
  const area = document.getElementById("area")?.value;
  const password = document.getElementById("signupPassword")?.value.trim();

  if (!role || !name || !phone || !subcity || !area || !password) {
    showMessage("Please fill in all signup fields");
    return;
  }

  successMessage("Account created successfully (demo)");
  flipCard();
}

// ===============================
// SUBCITY → AREA DATA
// ===============================
const areas = {
  bole: [
    "Bole Medhanealem",
    "Gerji",
    "Edna Mall",
    "Welo Sefer",
    "Japan",
    "Rwanda",
    "Michael",
    "CMC",
    "Bulbula"
  ],
  yeka: ["Megenagna", "Kotebe", "Summit", "Ayat", "Shola"],
  kirkos: ["Kazanchis", "Mexico", "Meskel Flower", "Sar Bet"],
  lideta: ["Lideta", "Abinet", "Tor Hailoch", "Balcha Hospital"],
  arada: ["Piazza", "Arat Kilo", "Sidist Kilo"],
  addisketema: ["Merkato", "Sebategna", "Alem Bank"],
  nifassilk: ["Jemo", "Lancha", "Sar Bet"],
  kolfe: ["Kolfe", "Asko", "Alem Bank"],
  akakikaliti: ["Akaki", "Kality"],
  gullele: ["Shiro Meda", "Entoto"]
};

// ===============================
// LOAD AREAS
// ===============================
function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const areaSelect = document.getElementById("area");

  areaSelect.innerHTML = '<option value="">Select Area</option>';
  areaSelect.style.display = "none";

  if (!subcity || !areas[subcity]) return;

  areas[subcity].forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaSelect.appendChild(option);
  });

  areaSelect.style.display = "block";
}

// ===============================
// INIT (Telegram-safe)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const subcitySelect = document.getElementById("subcity");
  const areaSelect = document.getElementById("area");

  if (areaSelect) {
    areaSelect.style.display = "none";
  }

  if (subcitySelect) {
    subcitySelect.addEventListener("change", loadAreas);
  }

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});