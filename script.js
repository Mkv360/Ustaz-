// ===============================
// UI STATES
// ===============================
const UI_STATE = {
  LOGIN: "login",
  SIGNUP: "signup",
};

let currentState = UI_STATE.LOGIN;

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

// ===============================
// STATE RENDERER
// ===============================
function setState(state) {
  currentState = state;
  card.dataset.state = state; // flips card via CSS
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

  if (currentState === UI_STATE.SIGNUP) {
    BackButton.show();
  } else {
    BackButton.hide();
  }
}

function handleBack() {
  if (currentState === UI_STATE.SIGNUP) {
    setState(UI_STATE.LOGIN);
  }
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
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Initial state
  setState(UI_STATE.LOGIN);

  // Navigation
  attachNavEvents();

  // Telegram WebApp ready
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.BackButton.onClick(handleBack);
  }
});