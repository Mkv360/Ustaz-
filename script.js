// ===============================
// CARD STATE CONTROLLER (CORE FIX)
// ===============================
const card = document.getElementById("card");

function resetCardState() {
  card.classList.remove(
    "flipped",
    "otp-active",
    "profile-active",
    "home-active"
  );
}

function goTo(state) {
  resetCardState();

  switch (state) {
    case "login":
      // front face
      break;

    case "signup":
      card.classList.add("flipped");
      break;

    case "otp":
      card.classList.add("otp-active");
      break;

    case "profile":
      card.classList.add("profile-active");
      break;

    case "home":
      card.classList.add("home-active");
      break;
  }

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
// PHONE VALIDATION
// ===============================
function validateEthiopianPhone(phone) {
  const p = phone.replace(/\s+/g, "");
  if (/^0[79]\d{8}$/.test(p)) return "+251" + p.slice(1);
  if (/^\+251[79]\d{8}$/.test(p)) return p;
  return null;
}

// ===============================
// SESSION DATA (RESET ON LOGOUT)
// ===============================
let signupData = {};
const BASE_URL = "https://b6d85591-5d99-43d5-8bb2-3ed838636e9e-00-bffsz574z1ei.spock.replit.dev/api";

// ===============================
// LOGIN
// ===============================
function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass) return showMessage("Enter valid phone & password");

  successMessage("Login successful (demo)");
  goTo("home");
}

// ===============================
// SIGNUP → SEND OTP
// ===============================
async function signup() {
  const role = document.getElementById("role").value;
  const name = document.getElementById("fullName").value.trim();
  const phone = validateEthiopianPhone(document.getElementById("signupPhone").value.trim());
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area").value;
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

    if (!experience || availableDays.length === 0) {
      return showMessage("Fill Ustaz experience and available days");
    }
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  try {
    const res = await fetch(`${BASE_URL}/send_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!data.success) {
      return showMessage(data.message || "OTP failed");
    }

    successMessage("OTP sent");
    goTo("otp");

  } catch (err) {
    showMessage("OTP error");
  }
}

// ===============================
// VERIFY OTP
// ===============================
async function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  if (!otp || !signupData.phone) return showMessage("Invalid OTP");

  try {
    const res = await fetch(`${BASE_URL}/verify_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: signupData.phone, otp })
    });

    const data = await res.json();
    if (!data.success) return showMessage("Invalid OTP");

    successMessage("OTP verified");

    if (signupData.role === "ustaz") goTo("profile");
    else goTo("home");

  } catch {
    showMessage("Verification failed");
  }
}

// ===============================
// SUBMIT PROFILE
// ===============================
function submitProfile() {
  const gender = document.getElementById("gender").value;
  const subjects = Array.from(
    document.querySelectorAll("#subjects input:checked")
  ).map(cb => cb.value);

  const bio = document.getElementById("bio").value.trim();
  const languages = document.getElementById("languages").value.trim();
  const mode = document.getElementById("mode").value;

  if (!gender || subjects.length === 0 || !bio || !languages || !mode) {
    return showMessage("Complete all required profile fields");
  }

  successMessage("Profile completed");
  goTo("home");
}

// ===============================
// LOGOUT (HARD RESET)
// ===============================
function logout() {
  signupData = {};
  document.querySelectorAll("input, textarea").forEach(i => i.value = "");
  document.querySelectorAll("input[type=checkbox]").forEach(c => c.checked = false);
  goTo("login");
}

// ===============================
// BACK NAVIGATION
// ===============================
function backToSignup() {
  goTo("signup");
}

// ===============================
// SUBCITY → AREA
// ===============================
const areas = {
  bole: ["Bole Medhanealem","Gerji","Edna Mall"],
  yeka: ["Megenagna","Kotebe","Ayat"],
  kirkos: ["Kazanchis","Mexico"],
  lideta: ["Lideta","Abinet"],
  arada: ["Piazza","Arat Kilo"]
};

function loadAreas() {
  const subcity = document.getElementById("subcity").value;
  const area = document.getElementById("area");
  area.innerHTML = '<option value="">Select Area</option>';
  (areas[subcity] || []).forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    area.appendChild(opt);
  });
}

// ===============================
// ROLE TOGGLE
// ===============================
document.getElementById("role").addEventListener("change", function () {
  document.getElementById("ustazFields").style.display =
    this.value === "ustaz" ? "block" : "none";
});

// ===============================
// INIT (ALWAYS LOGIN)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  goTo("login");

  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});