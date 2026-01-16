function goSignup() {
  window.location.href = "signup.html";
}

function goHome() {
  window.location.href = "home.html";
}

function showParent() {
  document.getElementById("parentForm").classList.remove("hidden");
  document.getElementById("ustazForm").classList.add("hidden");
}

function showUstaz() {
  document.getElementById("ustazForm").classList.remove("hidden");
  document.getElementById("parentForm").classList.add("hidden");
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.left = menu.style.left === "0px" ? "-200px" : "0px";
}