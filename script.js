// ===============================
// UI STATES
// ===============================
const UI_STATE = {
  LOGIN: "login",
  SIGNUP: "signup",
  OTP: "otp",
};

let currentState = UI_STATE.LOGIN;
let signupData = {};
let generatedOtp = "";

// ===============================
// DOM REFERENCES
// ===============================
const card = document.getElementById("card");
const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");
const roleSelect = document.getElementById("role");
const ustazFields = document.getElementById("ustazFields");
const subcitySelect = document.getElementById("subcity");
const areaSelect = document.getElementById("area");
const otpInput = document.getElementById("otpInput");

// ===============================
// STATE MANAGEMENT
// ===============================
function setState(state) {
  currentState = state;
  card.dataset.state = state;
  resetScroll();
  syncTelegramBackButton();

  if (state === UI_STATE.OTP) {
    card.dataset.state = "signup"; // show signup side for OTP
  }
}

function resetScroll() {
  document.querySelectorAll(".card-content").forEach(c => (c.scrollTop = 0));
}

// ===============================
// TELEGRAM BACK BUTTON
// ===============================
function syncTelegramBackButton() {
  if (!window.Telegram?.WebApp) return;

  const BackButton = Telegram.WebApp.BackButton;

  if (currentState === UI_STATE.SIGNUP || currentState === UI_STATE.OTP) {
    BackButton.show();
  } else {
    BackButton.hide();
  }
}

function handleBack() {
  if (currentState === UI_STATE.SIGNUP || currentState === UI_STATE.OTP) {
    setState(UI_STATE.LOGIN);
  }
}

// ===============================
// ETHIOPIAN PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g, "");
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

// ===============================
// ALERTS / POPUPS
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
      buttons: [{ type: "ok" }],
    });
  } else alert(msg);
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
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "Edna Mall", "Welo Sefer"],
  yeka: ["Megenagna", "Kotebe", "Summit", "Ayat"],
  kirkos: ["Kazanchis", "Mexico", "Meskel Flower"],
  lideta: ["Lideta", "Abinet", "Tor Hailoch"],
};

function loadAreas() {
  const subcity = subcitySelect.value;
  areaSelect.innerHTML = '<option value="">Select Area</option>';
  if (!areas[subcity]) return;
  areas[subcity].forEach(area => {
    const opt = document.createElement("option");
    opt.value = area;
    opt.textContent = area;
    areaSelect.appendChild(opt);
  });
}

subcitySelect.addEventListener("change", loadAreas);

// ===============================
// ROLE-BASED FIELDS
// ===============================
roleSelect.addEventListener("change", () => {
  const isUstaz = roleSelect.value === "ustaz";
  ustazFields.classList.toggle("hidden", !isUstaz);
});

// ===============================
// NAVIGATION
// ===============================
function attachNavEvents() {
  goSignup.addEventListener("click", () => setState(UI_STATE.SIGNUP));
  goLogin.addEventListener("click", () => setState(UI_STATE.LOGIN));

  document.getElementById("loginBtn").addEventListener("click", login);
  document.getElementById("signupBtn").addEventListener("click", signup);
  document.getElementById("verifyOtpBtn")?.addEventListener("click", verifyOtp);
}

// ===============================
// SIGNUP FLOW
// ===============================
function signup() {
  const role = roleSelect.value;
  const fullName = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = subcitySelect.value;
  const area = areaSelect.value;
  const password = document.getElementById("signupPassword").value.trim();

  let experience = null;
  let availableDays = [];

  if (role === "ustaz") {
    experience = document.getElementById("experience").value;
    availableDays = Array.from(document.getElementById("availableDays").selectedOptions).map(o => o.value);
    if (!experience || availableDays.length === 0) return showMessage("Fill in experience and available days");
  }

  if (!role || !fullName || !phone || !subcity || !area || !password) {
    return showMessage("Fill in all required fields");
  }

  signupData = { role, fullName, phone, subcity, area, password, experience, availableDays };

  generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log("Demo OTP:", generatedOtp);

  setState(UI_STATE.OTP);
  document.getElementById("otpInput").value = "";
}

// ===============================
// VERIFY OTP
// ===============================
function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  if (otp === generatedOtp) {
    successMessage("Account created successfully!");
    setState(UI_STATE.LOGIN);
    signupData = {};
    generatedOtp = "";
  } else {
    showMessage("Incorrect OTP");
  }
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setState(UI_STATE.LOGIN);
  attachNavEvents();

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.BackButton.onClick(handleBack);
  }
});