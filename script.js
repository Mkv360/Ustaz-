// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");
const roleSelect = document.getElementById("role");
const ustazFields = document.getElementById("ustazFields");

function flipCard() {
  card.classList.toggle("flipped");
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
}

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
// LOGIN
// ===============================
function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();
  if (!phone || !pass) return showMessage("Enter valid phone & password");
  successMessage("Login successful (demo)");
}

// ===============================
// SIGNUP → OTP
// ===============================
let generatedOtp = "", signupData = {};

function signup() {
  const role = roleSelect.value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value.trim();

  // Ustaz-specific fields
  let experience = null, availableDays = [];
  if (role === "ustaz") {
    experience = document.getElementById("experience").value.trim();
    const daysSelect = document.getElementById("availableDays");
    availableDays = Array.from(daysSelect.selectedOptions).map(opt => opt.value);
    if (!experience || availableDays.length === 0) {
      return showMessage("Please enter experience and select available days");
    }
  }

  if (!role || !name || !phone || !subcity || !area || !pass) {
    return showMessage("Please fill in all signup fields correctly");
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };
  generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log("Demo OTP:", generatedOtp);

  // Show OTP card
  card.classList.add("otp-active");
  card.classList.remove("flipped"); // ensure OTP is on top
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
}

// ===============================
// VERIFY OTP
// ===============================
function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  if (otp === generatedOtp) {
    successMessage("Account created successfully!");
    resetOtp();
    card.classList.remove("flipped"); // back to login
  } else {
    showMessage("Incorrect OTP");
  }
}

// ===============================
// BACK TO SIGNUP
// ===============================
function backToSignup() {
  resetOtp(); // hide OTP card
  card.classList.remove("otp-active"); // show signup card
  card.classList.add("flipped"); // show back side
}

// ===============================
// RESET OTP
// ===============================
function resetOtp() {
  generatedOtp = "";
  signupData = {};
  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";
  card.classList.remove("otp-active");
}

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Bole Medhanealem","Gerji","Edna Mall","Welo Sefer","Japan","Rwanda","Michael","CMC","Bulbula"],
  yeka: ["Megenagna","Kotebe","Summit","Ayat","Shola"],
  kirkos: ["Kazanchis","Mexico","Meskel Flower","Sar Bet"],
  lideta: ["Lideta","Abinet","Tor Hailoch","Balcha Hospital"],
  arada: ["Piazza","Arat Kilo","Sidist Kilo"],
  addisketema: ["Merkato","Sebategna","Alem Bank"],
  nifassilk: ["Jemo","Lancha","Sar Bet"],
  kolfe: ["Kolfe","Asko","Alem Bank"],
  akakikaliti: ["Akaki","Kality"],
  gullele: ["Shiro Meda","Entoto"]
};

function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const areaSelect = document.getElementById("area");
  areaSelect.innerHTML = '<option value="">Select Area</option>';
  if (!areas[subcity]) return;
  areas[subcity].forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    areaSelect.appendChild(opt);
  });
}

// ===============================
// ROLE CHANGE → SHOW USTAZ FIELDS
// ===============================
roleSelect.addEventListener("change", () => {
  if (roleSelect.value === "ustaz") {
    ustazFields.style.display = "block";
  } else {
    ustazFields.style.display = "none";
  }
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Always start on login
  card.classList.remove("flipped");
  card.classList.remove("otp-active");

  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";

  // Load areas on subcity change
  const subcitySelect = document.getElementById("subcity");
  if (subcitySelect) subcitySelect.addEventListener("change", loadAreas);

  // Telegram WebApp init
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});