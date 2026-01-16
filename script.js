const card = document.getElementById("card");

function flipCard() {
  card.classList.toggle("flip");
  hideForms();
}

function showParent() {
  hideForms();
  document.getElementById("parentForm").classList.remove("hidden");
}

function showUstaz() {
  hideForms();
  document.getElementById("ustazForm").classList.remove("hidden");
}

function hideForms() {
  document.getElementById("parentForm").classList.add("hidden");
  document.getElementById("ustazForm").classList.add("hidden");
}

function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (!phone || !pass) {
    alert("Please fill all fields");
    return;
  }

  alert("Login successful (demo)");
}