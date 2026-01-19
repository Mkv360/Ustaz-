const card = document.getElementById("card");

// ====================
// CARD FLIP
// ====================
function flipToSignup() {
  card.classList.add("flipped");
}

function flipToLogin() {
  card.classList.remove("flipped");
}

// ====================
// DEMO LOGIN & SIGNUP
// ====================
function login() {
  const phone = document.getElementById("loginPhone").value;
  const pass = document.getElementById("loginPassword").value;
  if (!phone || !pass) {
    alert("Enter phone & password");
    return;
  }
  alert("Login successful (demo)");
}

function signup() {
  const name = document.getElementById("fullName").value;
  const phone = document.getElementById("signupPhone").value;
  const pass = document.getElementById("signupPassword").value;
  if (!name || !phone || !pass) {
    alert("Fill all fields");
    return;
  }
  alert("Signup successful (demo)");
}