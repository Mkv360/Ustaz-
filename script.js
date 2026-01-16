// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");

  // Reset scroll positions on flip
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

  // Start with 0
  if (/^0[79]\d{8}$/.test(cleaned)) {
    cleaned = "+251" + cleaned.slice(1);
  }

  // Already with 251
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
let generatedOtp = "";
let signupData = {};

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

  // Store signup data
  signupData = { role, name, phone, subcity, area, password };

  // Generate demo OTP
  generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log("Demo OTP:", generatedOtp); // in real app, send via bot or SMS

  // Show OTP card using card class
  card.classList.add("otp-flipped");
}

// ===============================
// VERIFY OTP
// ===============================
function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();

  if (otp === generatedOtp) {
    successMessage("Account created successfully!");
    resetOtp();
    flipCard(); // go back to login
  } else {
    showMessage("Incorrect OTP. Try again.");
  }
}

function goBackToSignup() {
  resetOtp();
}

function resetOtp() {
  generatedOtp = "";
  signupData = {};
  document.getElementById("otpInput").value = "";
  card.classList.remove("otp-flipped");
}

// ===============================
// SUBCITY → AREA DATA
// ===============================
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "Edna Mall", "Welo Sefer", "Japan", "Rwanda", "Michael", "CMC", "Bulbula"],
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

  if (!areas[subcity]) return;

  areas[subcity].forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaSelect.appendChild(option);
  });
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const subcitySelect = document.getElementById("subcity");
  subcitySelect.addEventListener("change", loadAreas);

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});