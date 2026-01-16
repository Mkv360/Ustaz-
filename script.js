// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flipped");
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
}

// ===============================
// TELEGRAM / BROWSER ALERTS
// ===============================
function showMessage(msg) {
  if (window.Telegram?.WebApp) Telegram.WebApp.showAlert(msg);
  else alert(msg);
}

function successMessage(msg) {
  if (window.Telegram?.WebApp) Telegram.WebApp.showPopup({ title: "Success", message: msg, buttons:[{type:"ok"}] });
  else alert(msg);
}

// ===============================
// ETHIOPIAN PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  const cleaned = phone.replace(/\s+/g,'');
  if (/^0[79]\d{8}$/.test(cleaned)) return "+251" + cleaned.slice(1);
  if (/^\+251[79]\d{8}$/.test(cleaned)) return cleaned;
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
// SIGNUP
// ===============================
let generatedOtp = "";
let signupData = {};

function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value.trim();

  if (!role || !name || !phone || !subcity || !area || !pass) return showMessage("Fill all fields");

  signupData = { role,name,phone,subcity,area,pass };

  generatedOtp = Math.floor(1000 + Math.random()*9000).toString();
  console.log("Demo OTP:", generatedOtp);

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
    flipCard();
  } else showMessage("Incorrect OTP");
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
// SUBCITY → AREA
// ===============================
const areas = {
  bole:["Bole Medhanealem","Gerji","Edna Mall","Welo Sefer","Japan","Rwanda","Michael","CMC","Bulbula"],
  yeka:["Megenagna","Kotebe","Summit","Ayat","Shola"],
  kirkos:["Kazanchis","Mexico","Meskel Flower","Sar Bet"],
  lideta:["Lideta","Abinet","Tor Hailoch","Balcha Hospital"],
  arada:["Piazza","Arat Kilo","Sidist Kilo"],
  addisketema:["Merkato","Sebategna","Alem Bank"],
  nifassilk:["Jemo","Lancha","Sar Bet"],
  kolfe:["Kolfe","Asko","Alem Bank"],
  akakikaliti:["Akaki","Kality"],
  gullele:["Shiro Meda","Entoto"]
};

function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const areaSelect = document.getElementById("area");
  areaSelect.innerHTML = '<option value="">Select Area</option>';
  if (!areas[subcity]) return;
  areas[subcity].forEach(a=>{
    const opt = document.createElement("option");
    opt.value = a; opt.textContent = a;
    areaSelect.appendChild(opt);
  });
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("subcity").addEventListener("change", loadAreas);
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});