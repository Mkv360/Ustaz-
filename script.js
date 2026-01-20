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

// ===============================
// DOM
// ===============================
const card = document.getElementById("card");
const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");
const backToSignup = document.getElementById("backToSignup");
const signupBtn = document.getElementById("signupBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const roleSelect = document.getElementById("role");
const ustazFields = document.getElementById("ustazFields");
const subcitySelect = document.getElementById("subcity");
const areaSelect = document.getElementById("area");
const otpPhone = document.getElementById("otpPhone");
const otpInput = document.getElementById("otpInput");

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
  if (currentState === UI_STATE.SIGNUP) setState(UI_STATE.LOGIN);
  if (currentState === UI_STATE.OTP) setState(UI_STATE.SIGNUP);
}

// ===============================
// STATE MANAGEMENT
// ===============================
function setState(state) {
  currentState = state;
  card.dataset.state = state;
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
  syncTelegramBackButton();
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

backToSignup.addEventListener("click", e => {
  e.preventDefault();
  setState(UI_STATE.SIGNUP);
});

// ===============================
// ROLE BASED FIELDS
// ===============================
roleSelect.addEventListener("change", () => {
  const isUstaz = roleSelect.value === "ustaz";
  ustazFields.classList.toggle("hidden", !isUstaz);
});

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "Edna Mall", "Welo Sefer"],
  yeka: ["Megenagna", "Kotebe", "Summit", "Ayat"],
  kirkos: ["Kazanchis", "Mexico", "Meskel Flower"],
  lideta: ["Lideta", "Abinet", "Tor Hailoch"],
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
// SIGNUP & REQUEST OTP
// ===============================
signupBtn.addEventListener("click", async () => {
  // Validate
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
    availableDays = Array.from(document.getElementById("availableDays").selectedOptions).map(o => o.value);
  }

  if (!role || !name || !phone || !subcity || !area || !pass || (role === "ustaz" && (!experience || availableDays.length === 0))) {
    alert("Please fill all required fields correctly");
    return;
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  // Show OTP page
  otpPhone.textContent = phone;
  otpInput.value = "";

  // Request OTP from backend
  try {
    const res = await fetch("https://YOUR_REPLIT_URL/send_otp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    console.log("OTP (for testing):", data.otp); // check Replit logs
    setState(UI_STATE.OTP);
  } catch (err) {
    alert("Error sending OTP: " + err.message);
  }
});

// ===============================
// VERIFY OTP
// ===============================
verifyOtpBtn.addEventListener("click", async () => {
  const otp = otpInput.value.trim();
  if (!otp) return alert("Enter OTP");

  try {
    const res = await fetch("https://YOUR_REPLIT_URL/verify_otp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: signupData.phone, otp })
    });
    const data = await res.json();
    if (data.success) {
      alert("Account created successfully!");
      setState(UI_STATE.LOGIN);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Error verifying OTP: " + err.message);
  }
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setState(UI_STATE.LOGIN);
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.BackButton.onClick(handleBack);
  }
});