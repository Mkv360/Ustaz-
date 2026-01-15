function showSignup() {
  document.querySelector(".login-card").classList.remove("active");
  document.querySelector(".login-card").classList.add("hidden-left");
  document.querySelector(".signup-card").classList.add("active");
}

function showLogin() {
  document.querySelector(".signup-card").classList.remove("active");
  document.querySelector(".login-card").classList.remove("hidden-left");
  document.querySelector(".login-card").classList.add("active");
}

// Show extra fields for Ustaz
const userType = document.getElementById("userType");
const ustazFields = document.getElementById("ustazFields");

if (userType) {
  userType.addEventListener("change", function () {
    if (this.value === "ustaz") {
      ustazFields.classList.remove("hidden");
    } else {
      ustazFields.classList.add("hidden");
    }
  });
}

// TEMP redirect
function goHome() {
  alert("Login / Signup successful (frontend only)");
}