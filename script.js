// ===============================
// CARD
// ===============================
const card = document.getElementById("card");

// ===============================
// GLOBAL STATE
// ===============================
let signupData = {};
const BASE_URL =
  "https://b6d85591-5d99-43d5-8bb2-3ed838636e9e-00-bffsz574z1ei.spock.replit.dev/api";

// ===============================
// UTIL
// ===============================
function resetScroll() {
  document.querySelectorAll(".card-content").forEach(c => (c.scrollTop = 0));
}

function resetSignupState() {
  signupData = {};

  card.classList.remove(
    "otp-active",
    "profile-active",
    "home-active"
  );

  const otpInput = document.getElementById("otpInput");
  if (otpInput) otpInput.value = "";

  const signupBtn = document.querySelector("button[onclick='signup()']");
  if (signupBtn) signupBtn.disabled = false;
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
// LOGIN
// ===============================
function login() {
  const phone = validateEthiopianPhone(
    document.getElementById("loginPhone").value.trim()
  );
  const pass = document.getElementById("loginPassword").value.trim();

  if (!phone || !pass)
    return showMessage("Enter valid phone & password");

  successMessage("Login successful (demo)");
  showHomeCard();
}

// ===============================
// OPEN SIGNUP (ALWAYS CLEAN)
// ===============================
function goToSignup() {
  resetSignupState();
  card.classList.add("flipped");
  resetScroll();
}

// ===============================
// SIGNUP → SEND OTP
// ===============================
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
    return showMessage("Fill all signup fields correctly");

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

  signupData = {
    role,
    name,
    phone,
    subcity,
    area,
    pass,
    experience,
    availableDays
  };

  try {
    const res = await fetch(`${BASE_URL}/send_otp.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!data.success)
      return showMessage(data.message || "Failed to send OTP");

    successMessage("OTP sent!");
    console.log("OTP (testing):", data.otp);

    document.querySelector("button[onclick='signup()']").disabled = true;

    card.classList.add("otp-active");
    card.classList.remove("flipped");
    resetScroll();
  } catch (err) {
    showMessage("OTP error: " + err.message);
  }
}

// ===============================
// VERIFY OTP
// ===============================
async function verifyOtp() {
  const otp = document.getElementById("otpInput").value.trim();

  if (!signupData.phone) {
    showMessage("Session expired. Please sign up again.");
    goToSignup();
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

    if (!data.success)
      return showMessage(data.message || "Invalid or expired OTP");

    successMessage("OTP verified!");

    card.classList.remove("otp-active");

    if (signupData.role === "ustaz") {
      showProfileCard();
    } else {
      showHomeCard();
    }
  } catch (err) {
    showMessage("Verification error: " + err.message);
  }
}

// ===============================
// PROFILE (USTAZ ONLY)
// ===============================
function showProfileCard() {
  if (!signupData.phone || signupData.role !== "ustaz") {
    showMessage("Please complete signup and OTP first");
    goToSignup();
    return;
  }

  card.classList.add("profile-active");
  card.classList.remove("home-active");
  resetScroll();
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
  const photo = document.getElementById("photo").files[0];
  const languages = document.getElementById("languages").value.trim();
  const mode = document.getElementById("mode").value;
  const certification = document.getElementById("certification").value.trim();
  const landmark = document.getElementById("landmark").value.trim();

  if (!gender || !subjects.length || !bio || !languages || !mode)
    return showMessage("Please fill all required profile fields");

  signupData.profile = {
    gender,
    subjects,
    bio,
    photo,
    languages,
    mode,
    certification,
    landmark
  };

  console.log("Ustaz profile completed:", signupData);

  successMessage("Profile completed successfully!");

  card.classList.remove("profile-active");
  showHomeCard();
}

// ===============================
// HOME
// ===============================
function showHomeCard() {
  card.classList.add("home-active");
  card.classList.remove("flipped");
  resetScroll();
}

// ===============================
// LOGOUT
// ===============================
function logout() {
  resetSignupState();
  card.classList.add("flipped");
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
document.getElementById("role").addEventListener("change", function () {
  document.getElementById("ustazFields").style.display =
    this.value === "ustaz" ? "block" : "none";
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  resetSignupState();
  card.classList.add("flipped");

  document
    .getElementById("subcity")
    .addEventListener("change", loadAreas);

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
});