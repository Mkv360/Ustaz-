// ===============================
// UI STATES
// ===============================
const UI_STATE = { LOGIN: "login", SIGNUP: "signup", OTP: "otp" };
let currentState = UI_STATE.LOGIN;
let signupData = {};

// ===============================
// DOM REFERENCES
// ===============================
const card = document.getElementById("card");
const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");
const signupBtn = document.getElementById("signupBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const roleSelect = document.getElementById("role");
const ustazFields = document.getElementById("ustazFields");
const subcitySelect = document.getElementById("subcity");
const areaSelect = document.getElementById("area");
const otpPhone = document.getElementById("otpPhone");
const otpInput = document.getElementById("otpInput");

// ===============================
// STATE MANAGEMENT
// ===============================
function setState(state) {
  currentState = state;
  card.dataset.state = state;
  document.querySelectorAll(".card-content").forEach(c => (c.scrollTop = 0));
}

// ===============================
// NAVIGATION
// ===============================
goSignup.addEventListener("click", e => {
  e.preventDefault();
  setState(UI_STATE.SIGNUP);
});
goLogin.addEventListener("click", e => {
  e.preventDefault();
  setState(UI_STATE.LOGIN);
});

// ===============================
// ROLE FIELDS
// ===============================
roleSelect.addEventListener("change", () => {
  ustazFields.classList.toggle("hidden", roleSelect.value !== "ustaz");
});

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "Edna Mall", "Welo Sefer"],
  yeka: ["Megenagna", "Kotebe", "Summit", "Ayat"],
  kirkos: ["Kazanchis", "Mexico", "Meskel Flower"],
  lideta: ["Lideta", "Abinet", "Tor Hailoch"],
  arada: ["Arada 1", "Arada 2"],
  addisketema: ["Addis Ketema 1", "Addis Ketema 2"],
  nifassilk: ["Nifas Silk 1", "Nifas Silk 2"],
  kolfe: ["Kolfe 1", "Kolfe 2"],
  akakikaliti: ["Akaki Kality 1", "Akaki Kality 2"],
  gullele: ["Gullele 1", "Gullele 2"],
};

subcitySelect.addEventListener("change", () => {
  areaSelect.innerHTML = '<option value="">Select Area</option>';
  const subcity = subcitySelect.value;
  if (!areas[subcity]) return;
  areas[subcity].forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    areaSelect.appendChild(opt);
  });
});

// ===============================
// LOGIN
// ===============================
document.getElementById("loginBtn").addEventListener("click", () => {
  const phone = document.getElementById("loginPhone").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  if (!phone || !pass) return alert("Enter phone & password");
  alert("Login successful (demo)");
});

// ===============================
// SIGNUP → GO TO OTP
// ===============================
signupBtn.addEventListener("click", () => {
  const role = roleSelect.value;
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const subcity = subcitySelect.value;
  const area = areaSelect.value;
  const pass = document.getElementById("signupPassword").value.trim();
  let experience = null;
  let availableDays = [];

  if (role === "ustaz") {
    experience = document.getElementById("experience").value.trim();
    availableDays = Array.from(
      document.getElementById("availableDays").selectedOptions
    ).map(o => o.value);
  }

  if (
    !role ||
    !name ||
    !phone ||
    !subcity ||
    !area ||
    !pass ||
    (role === "ustaz" && (!experience || availableDays.length === 0))
  ) {
    return alert("Please fill all required fields correctly");
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  // Show OTP page
  if (otpPhone) otpPhone.textContent = phone;
  if (otpInput) otpInput.value = "";

  setState(UI_STATE.OTP);
});

// ===============================
// VERIFY OTP
// ===============================
verifyOtpBtn.addEventListener("click", () => {
  const otp = otpInput.value.trim();
  if (!otp) return alert("Enter OTP");
  alert("OTP verified! Account created.");
  setState(UI_STATE.LOGIN);
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setState(UI_STATE.LOGIN);
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});