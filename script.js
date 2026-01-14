
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "home.html";
  });
}

// SIGNUP REDIRECT
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "home.html";
  });
}

// USER TYPE SWITCH
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

// SIDE MENU
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}