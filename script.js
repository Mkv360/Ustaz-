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
// LOGIN
// ===============================
function login() {
  const phone = validateEthiopianPhone(document.getElementById("loginPhone").value.trim());
  const pass = document.getElementById("loginPassword").value.trim();
  if (!phone || !pass) return showMessage("Enter valid phone & password");
  successMessage("Login successful (demo)"); // replace with backend call later
}

// ===============================
// SIGNUP → SEND OTP
// ===============================
let signupData = {};

function signup() {
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
    if (!experience || availableDays.length === 0) {
      return showMessage("Please fill in Ustaz experience and available days");
    }
  }

  if (!role || !name || !phone || !subcity || !area || !pass) {
    return showMessage("Please fill in all signup fields correctly");
  }

  signupData = { role, name, phone, subcity, area, pass, experience, availableDays };

  // ===== Call backend to send OTP =====
  fetch("https://ustazapp.kesug.com/api/send_otp.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `phone=${encodeURIComponent(phone)}`
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      successMessage("OTP sent! Check your phone (or console for testing)");
      console.log("OTP (for testing):", data.otp);

      // Show OTP card
      card.classList.add("otp-active");
      card.classList.remove("flipped");
      document.querySelectorAll(".card-content").forEach(c => c.scrollTop = 0);
    } else {
      showMessage("Failed to send OTP: " + data.message);
    }
  })
  .catch(err => showMessage("Error sending OTP: " + err));
}

// ===============================
// VERIFY OTP
// ===============================
function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();
  const phone = signupData.phone;

  if(!otp || !phone) return showMessage("OTP or phone missing");

  // ===== Call backend to verify OTP =====
  fetch("https://ustazapp.kesug.com/api/verify_otp.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(otp)}`
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      successMessage("Account created successfully!");
      resetOtp();
      card.classList.remove("flipped");
      // TODO: redirect to home or dashboard
      window.location.href = "home.html"; 
    } else {
      showMessage("Incorrect or expired OTP");
    }
  })
  .catch(err => showMessage("Error verifying OTP: " + err));
}

// ===============================
// BACK TO SIGNUP
// ===============================
function backToSignup() {
  resetOtp();
  card.classList.remove("otp-active");
  card.classList.add("flipped");
}

// ===============================
// RESET OTP
// ===============================
function resetOtp() {
  signupData = {};
  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";
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
// SHOW/HIDE USTAZ FIELDS
// ===============================
document.getElementById("role").addEventListener("change", function() {
  const ustazFields = document.getElementById("ustazFields");
  if (this.value === "ustaz") ustazFields.style.display = "block";
  else ustazFields.style.display = "none";
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  card.classList.remove("flipped");
  card.classList.remove("otp-active");
  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";

  document.getElementById("subcity").addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});