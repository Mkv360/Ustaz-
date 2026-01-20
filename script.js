// ===============================
// UI STATES
// ===============================
const UI_STATE = {
  LOGIN: "login",
  SIGNUP: "signup",
  OTP: "otp",
};

let currentState = UI_STATE.LOGIN;
let signupData = {}; // store form data for OTP verification

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
// STATE RENDERER
// ===============================
function setState(state) {
  currentState = state;
  card.dataset.state = state;
  resetScroll();
  syncTelegramBackButton();
}

function resetScroll() {
  document
    .querySelectorAll(".card-content")
    .forEach(c => (c.scrollTop = 0));
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
  if (currentState === UI_STATE.OTP) {
    setState(UI_STATE.SIGNUP);
  } else if (currentState === UI_STATE.SIGNUP) {
    setState(UI_STATE.LOGIN);
  }
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
      buttons: [{ type: "ok" }],
    });
  } else alert(msg);
}

// ===============================
// ROLE-BASED FIELDS
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
// NAVIGATION EVENTS
// ===============================
function attachNavEvents() {
  goSignup.addEventListener("click", () => setState(UI_STATE.SIGNUP));
  goLogin.addEventListener("click", () => setState(UI_STATE.LOGIN));
}

// ===============================
// SIGNUP → SEND OTP
// ===============================
async function signup() {
  const role = roleSelect.value;
  const name = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const subcity = subcitySelect.value;
  const area = areaSelect.value;
  const pass = document.getElementById("signupPassword").value.trim();

  if (!role || !name || !phone || !subcity || !area || !pass) {
    return showMessage("Please fill all required fields");
  }

  let experience = null;
  let availableDays = [];
  if (role === "ustaz") {
    experience = document.getElementById("experience").value;
    availableDays = Array.from(document.getElementById("availableDays").selectedOptions).map(
      o => o.value
    );
    if (!experience || availableDays.length === 0) {
      return showMessage("Please fill experience and available days");
    }
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  try {
    const res = await fetch("/api/send_otp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();

    if (data.success) {
      successMessage("OTP sent! Check the console for testing.");
      setState(UI_STATE.OTP);
    } else {
      showMessage(data.message || "Failed to send OTP");
    }
  } catch (err) {
    console.error(err);
    showMessage("Network error sending OTP");
  }
}

// ===============================
// VERIFY OTP
// ===============================
async function verifyOtp() {
  const otp = otpInput.value.trim();
  if (!otp) return showMessage("Enter OTP");

  try {
    const res = await fetch("/api/verify_otp.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: signupData.phone, otp }),
    });
    const data = await res.json();

    if (data.success) {
      successMessage("Account created successfully!");
      setState(UI_STATE.LOGIN);
      otpInput.value = "";
    } else {
      showMessage(data.message || "OTP verification failed");
    }
  } catch (err) {
    console.error(err);
    showMessage("Network error verifying OTP");
  }
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setState(UI_STATE.LOGIN);
  attachNavEvents();

  document.getElementById("signupBtn").addEventListener("click", signup);
  document.getElementById("otpVerifyBtn")?.addEventListener("click", verifyOtp);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.BackButton.onClick(handleBack);
  }
});