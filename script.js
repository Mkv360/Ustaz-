// ===============================
// CARD
// ===============================
const card = document.getElementById("card");

// HARD RESET (important for Telegram)
function resetUI() {
  card.className = "card"; // removes ALL states
  scrollTopAll();
}

function showLogin() {
  resetUI();
}

function showSignup() {
  resetUI();
  card.classList.add("flipped");
}

function showOtp() {
  resetUI();
  card.classList.add("otp-active");
}

function showHome() {
  resetUI();
  card.classList.add("home-active");
}

function scrollTopAll() {
  document.querySelectorAll(".card-content").forEach(c => (c.scrollTop = 0));
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
// PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g, "");
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

// ===============================
// LOGIN (demo)
// ===============================
function login() {
  const phone = validateEthiopianPhone(
    document.getElementById("loginPhone").value.trim()
  );
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass)
    return showMessage("Enter valid phone & password");

  successMessage("Login successful (demo)");
  showHome();
}

// ===============================
// SIGNUP → OTP
// ===============================
let signupData = {};
const BASE_URL =
  "https://b6d85591-5d99-43d5-8bb2-3ed838636e9e-00-bffsz574z1ei.spock.replit.dev/api";

async function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(
    document.getElementById("signupPhone").value.trim()
  );
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value.trim();

  if (!role || !name || !phone || !subcity || !area || !pass)
    return showMessage("Fill all fields");

  signupData = { phone };

  try {
    const res = await fetch(`${BASE_URL}/send_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    console.log("OTP (testing):", data.otp);
    showOtp();
  } catch (err) {
    showMessage(err.message);
  }
}

// ===============================
// VERIFY OTP
// ===============================
async function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  if (!otp || !signupData.phone)
    return showMessage("Invalid session");

  try {
    const res = await fetch(`${BASE_URL}/verify_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: signupData.phone, otp })
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    successMessage("Account created!");
    signupData = {};
    showLogin();
  } catch (err) {
    showMessage(err.message);
  }
}

// ===============================
// NAVIGATION
// ===============================
function flipCard() {
  card.classList.toggle("flipped");
}

function backToSignup() {
  signupData = {};
  showSignup();
}

function logout() {
  showLogin();
}

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Bole Medhanealem", "Gerji", "Edna Mall"],
  yeka: ["Megenagna", "Kotebe"],
  kirkos: ["Kazanchis", "Mexico"]
};

function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area");
  area.innerHTML = '<option value="">Select Area</option>';
  (areas[subcity] || []).forEach(a => {
    const o = document.createElement("option");
    o.value = a;
    o.textContent = a;
    area.appendChild(o);
  });
}

// ===============================
// INIT (CRITICAL FIX)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  resetUI(); // 🔥 FORCE RESET ALWAYS

  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    // 🔥 Telegram resume fix
    setTimeout(resetUI, 50);
    setTimeout(resetUI, 200);
  }
});
