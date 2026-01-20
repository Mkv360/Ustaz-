// ===============================
// CARD FLIP & ELEMENTS
// ===============================
const card = document.getElementById("card");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const roleSelect = document.getElementById("role");
const areaSelect = document.getElementById("area");

// Flip card helper
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
// LOGIN (demo)
// ===============================
function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();
  if (!phone || !pass) return showMessage("Enter valid phone & password");

  successMessage("Login successful (demo)");
  showHomeCard();
}

// ===============================
// SIGNUP → SEND DEMO OTP
// ===============================
let signupData = {};

function signup() {
  const role = roleSelect.value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = document.getElementById("subcity").value;
  const area = areaSelect.value;
  const pass = document.getElementById("signupPassword").value.trim();

  if (!role || !name || !phone || !subcity || !area || !pass) {
    return showMessage("Fill all signup fields correctly");
  }

  let experience = null;
  let availableDays = [];

  if (role === "ustaz") {
    experience = document.getElementById("experience").value;
    availableDays = Array.from(
      document.getElementById("availableDays").selectedOptions
    ).map(o => o.value);

    if (!experience || availableDays.length === 0)
      return showMessage("Fill Ustaz experience and days");
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  // Demo OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  signupData.otp = otp;
  console.log("Demo OTP:", otp);
  successMessage(`OTP sent! (Demo: ${otp})`);

  card.classList.add("otp-active");
  card.classList.remove("flipped");
  signupBtn.disabled = true;
}

// ===============================
// VERIFY OTP → SHOW HOME
// ===============================
function verifyOtp() {
  const otpInput = document.getElementById("otpInput").value.trim();
  if (!signupData.phone) {
    showMessage("Session expired. Please sign up again.");
    backToSignup();
    return;
  }

  if (!otpInput) return showMessage("Enter the OTP");

  if (otpInput == signupData.otp) {
    successMessage("OTP verified!");
    resetOtp();
    showHomeCard();
  } else {
    showMessage("Invalid OTP (Demo)");
  }
}

// ===============================
// SHOW HOME CARD
// ===============================
function showHomeCard() {
  card.classList.add("home-active");
  card.classList.remove("otp-active");
  card.classList.remove("flipped");
}

// ===============================
// LOGOUT → BACK TO LOGIN
// ===============================
function logout() {
  card.classList.remove("home-active");
  card.classList.add("flipped"); // back to login/signup
}

// ===============================
// BACK / RESET OTP
// ===============================
function backToSignup() {
  resetOtp();
  card.classList.remove("otp-active");
  card.classList.add("flipped");
}

function resetOtp() {
  signupData = {};
  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";
  signupBtn.disabled = false;
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
// ROLE TOGGLE
// ===============================
roleSelect.addEventListener("change", function() {
  document.getElementById("ustazFields").style.display =
    this.value === "ustaz" ? "block" : "none";
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  card.classList.remove("flipped", "otp-active", "home-active");

  document.getElementById("subcity").addEventListener("change", loadAreas);

  // Button events
  signupBtn.addEventListener("click", signup);
  loginBtn.addEventListener("click", login);
  verifyOtpBtn.addEventListener("click", verifyOtp);

  // Flip toggle links
  document.querySelectorAll(".flip-link").forEach(el => {
    el.addEventListener("click", () => {
      flipCard();
    });
  });

  // Back buttons
  document.getElementById("backToLogin").addEventListener("click", () => {
    flipCard();
  });
  document.getElementById("otpBack").addEventListener("click", backToSignup);
  document.getElementById("logoutBtn").addEventListener("click", logout);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});