const card = document.getElementById("card");

// ===============================
// ALERTS
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
// CARD FLIP
function showSignupCard() { card.classList.add("flipped"); }
function showLoginCard() { card.classList.remove("flipped"); }
function showHomeCard() { 
  card.classList.add("home-active"); 
  card.classList.remove("otp-active");
  card.classList.remove("flipped");
}

// ===============================
// OTP BACK
let signupData = {};
function backToSignup() {
  resetOtp();
  card.classList.remove("otp-active");
  card.classList.add("flipped");
}

function resetOtp() {
  signupData = {};
  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";
  const btn = document.querySelector("button[onclick='signup()']");
  if (btn) btn.disabled = false;
  card.classList.remove("otp-active");
}

// ===============================
// LOGIN DEMO
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g,'');
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();
  if (!phone || !pass) return showMessage("Enter valid phone & password");
  successMessage("Login successful (demo)");
  showHomeCard();
}

// ===============================
// SIGNUP → SEND OTP
const BASE_URL = "https://b6d85591-5d99-43d5-8bb2-3ed838636e9e-00-bffsz574z1ei.spock.replit.dev/api";

async function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
  const pass = document.getElementById("signupPassword").value.trim();

  let experience = null;
  let availableDays = [];

  if (role === "ustaz") {
    experience = document.getElementById("experience").value;
    availableDays = Array.from(document.getElementById("availableDays").selectedOptions).map(o => o.value);
    if (!experience || availableDays.length === 0) return showMessage("Fill Ustaz experience and days");
  }

  if (!role || !name || !phone || !subcity || !area || !pass) return showMessage("Fill all signup fields correctly");

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  try {
    const res = await fetch(`${BASE_URL}/send_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    if (data.success) {
      successMessage("OTP sent!");
      card.classList.add("otp-active");
      card.classList.remove("flipped");
      const btn = document.querySelector("button[onclick='signup()']");
      if (btn) btn.disabled = true;
      console.log("OTP (testing):", data.otp);
    } else showMessage(data.message || "Failed to send OTP");
  } catch (err) {
    showMessage("OTP error: " + err.message);
  }
}

// ===============================
// VERIFY OTP
async function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  if (!signupData.phone) { showMessage("Session expired"); backToSignup(); return; }
  if (!otp) return showMessage("Enter OTP");

  try {
    const res = await fetch(`${BASE_URL}/verify_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: signupData.phone, otp })
    });
    const data = await res.json();
    if (data.success) {
      successMessage("OTP verified!");
      resetOtp();
      showHomeCard();
    } else showMessage("Invalid or expired OTP");
  } catch (err) { showMessage("Verification error: " + err.message); }
}

// ===============================
// LOGOUT
function logout() {
  card.classList.remove("home-active");
  card.classList.add("flipped"); // back to login
}

// ===============================
// SUBCITY → AREA
const areas = { /* same as before */ };
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
// INIT
document.addEventListener("DOMContentLoaded", () => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }

  document.getElementById("signupLink").addEventListener("click", showSignupCard);
  document.getElementById("subcity").addEventListener("change", loadAreas);

  document.getElementById("role").addEventListener("change", function() {
    document.getElementById("ustazFields").style.display = this.value === "ustaz" ? "block" : "none";
  });
});