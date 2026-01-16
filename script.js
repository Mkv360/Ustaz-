// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");

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
// ETHIOPIAN PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  let cleaned = phone.replace(/\s+/g, "");

  if (/^0[79]\d{8}$/.test(cleaned)) {
    cleaned = "+251" + cleaned.slice(1);
  }

  if (/^251[79]\d{8}$/.test(cleaned)) {
    cleaned = "+" + cleaned;
  }

  if (!/^\+251[79]\d{8}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

// ===============================
// LOGIN
// ===============================
function login() {
  const rawPhone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const phone = validateEthiopianPhone(rawPhone);

  if (!phone || !password) {
    showMessage("Enter a valid Ethiopian phone and password");
    return;
  }

  successMessage("Login successful (demo)");
}

// ===============================
// SIGNUP
// ===============================
function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const rawPhone = document.getElementById("signupPhone").value.trim();
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const password = document.getElementById("signupPassword").value.trim();

  const phone = validateEthiopianPhone(rawPhone);

  if (!role || !name || !phone || !subcity || !area || !password) {
    showMessage("Please fill all fields correctly");
    return;
  }

  console.log("Normalized phone:", phone);

  successMessage("Account created successfully (demo)");
  flipCard();
}

// ===============================
// SUBCITY → AREA DATA
// ===============================
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "CMC", "Bulbula"],
  yeka: ["Megenagna", "Ayat", "Summit"],
  kirkos: ["Kazanchis", "Mexico"],
  lideta: ["Tor Hailoch", "Abinet"],
  arada: ["Piazza", "Arat Kilo"],
  addisketema: ["Merkato", "Sebategna"],
  nifassilk: ["Jemo", "Lancha"],
  kolfe: ["Kolfe", "Asko"],
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

  if (!areas[subcity]) return;

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
  document.getElementById("area").style.display = "none";
  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});