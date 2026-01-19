const card = document.getElementById("card");

// ===============================
// Alerts
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
// Ethiopian Phone Validation
// ===============================
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g,'');
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

// ===============================
// Show / Hide Cards
// ===============================
function showSignupCard() { card.classList.add("flipped"); }
function showLoginCard() { card.classList.remove("flipped"); }

// ===============================
// Signup → Send OTP
// ===============================
let signupData = {};
const BASE_URL = "https://YOUR_REPLIT_LINK/api";

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
    availableDays = Array.from(
      document.getElementById("availableDays").selectedOptions
    ).map(o => o.value);

    if (!experience || availableDays.length === 0)
      return showMessage("Fill Ustaz experience and days");
  }

  if (!role || !name || !phone || !subcity || !area || !pass)
    return showMessage("Fill all signup fields correctly");

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
      console.log("OTP (testing):", data.otp);
      card.classList.add("otp-active");
      card.classList.remove("flipped");
    } else {
      showMessage(data.message || "Failed to send OTP");
    }
  } catch (err) {
    showMessage("OTP error: " + err.message);
  }
}

// ===============================
// Verify OTP → Show Home
// ===============================
async function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();

  if (!signupData.phone) {
    showMessage("Session expired. Please sign up again.");
    backToSignup();
    return;
  }

  if (!otp) return showMessage("Enter the OTP");

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
      card.classList.add("home-active");
      card.classList.remove("otp-active");
    } else {
      showMessage("Invalid or expired OTP");
    }
  } catch (err) {
    showMessage("Verification error: " + err.message);
  }
}

// ===============================
// Back / Reset OTP
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
}

// ===============================
// Logout
// ===============================
function logout() {
  card.classList.remove("home-active");
  card.classList.add("flipped"); // back to signup/login
}

// ===============================
// Subcity → Area
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

// Role toggle for Ustaz fields
document.getElementById("role").addEventListener("change", function() {
  document.getElementById("ustazFields").style.display =
    this.value === "ustaz" ? "block" : "none";
});

// Init
document.addEventListener("DOMContentLoaded", () => {
  card.classList.remove("flipped", "otp-active", "home-active");
  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});