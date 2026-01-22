// ===============================
// CARD FLIP
// ===============================
const card = document.getElementById("card");

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
// SIGNUP → SEND OTP
// ===============================
let signupData = {};
const BASE_URL = "https://b6d85591-5d99-43d5-8bb2-3ed838636e9e-00-bffsz574z1ei.spock.replit.dev/api";

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

    if (!experience || availableDays.length === 0)
      return showMessage("Fill Ustaz experience and days");
  }

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

      document.querySelector("button[onclick='signup()']").disabled = true;
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
// VERIFY OTP → SHOW PROFILE OR HOME
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

      // Show profile completion card if Ustaz, else go home
      if (signupData.role === "ustaz") {
        showProfileCard();
      } else {
        showHomeCard();
      }
    } else {
      showMessage(data.message || "Invalid or expired OTP");
    }
  } catch (err) {
    showMessage("Verification error: " + err.message);
  }
}

// ===============================
// SHOW PROFILE COMPLETION CARD
// ===============================
function showProfileCard() {
  card.classList.add("profile-active");
  card.classList.remove("otp-active");
  card.classList.remove("home-active");
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
}

// ===============================
// SUBMIT USTAZ PROFILE
// ===============================
function submitProfile() {
  const gender = document.getElementById("gender").value;
  const subjects = Array.from(document.querySelectorAll("#subjects input:checked")).map(cb => cb.value);
  const bio = document.getElementById("bio").value.trim();
  const photo = document.getElementById("photo").files[0];
  const languages = document.getElementById("languages").value.trim();
  const mode = document.getElementById("mode").value;
  const certification = document.getElementById("certification").value.trim();
  const landmark = document.getElementById("landmark").value.trim();

  if (!gender || subjects.length === 0 || !bio || !languages || !mode) {
    return showMessage("Please fill all required fields in your profile");
  }

  signupData.profile = { gender, subjects, bio, photo, languages, mode, certification, landmark };
  console.log("Ustaz profile completed:", signupData.profile);

  successMessage("Profile completed successfully!");
  card.classList.remove("profile-active");
  showHomeCard();

  // Optional: send to backend
  // sendProfileToBackend(signupData);
}

// ===============================
// SHOW HOME CARD
// ===============================
function showHomeCard() {
  card.classList.add("home-active");
  card.classList.remove("otp-active");
  card.classList.remove("profile-active");
  card.classList.remove("flipped");
  document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
}

// ===============================
// LOGOUT → BACK TO LOGIN
// ===============================
function logout() {
  card.classList.remove("home-active");
  card.classList.add("flipped");
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
  const btn = document.querySelector("button[onclick='signup()']");
  if (btn) btn.disabled = false;
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
// ROLE TOGGLE
// ===============================
document.getElementById("role").addEventListener("change", function() {
  document.getElementById("ustazFields").style.display =
    this.value === "ustaz" ? "block" : "none";
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Always start at login page
  card.classList.remove("flipped", "otp-active", "home-active", "profile-active");

  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});