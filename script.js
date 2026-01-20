const flipCardInner = document.getElementById("card");
const roleSelect = document.getElementById("role");

// Flip buttons
document.getElementById("showSignup").addEventListener("click", () => {
  flipCardInner.classList.add("flipped");
});

document.getElementById("showLogin").addEventListener("click", () => {
  flipCardInner.classList.remove("flipped");
});

// Show/hide Ustaz fields
roleSelect.addEventListener("change", () => {
  document.getElementById("ustazFields").style.display =
    roleSelect.value === "ustaz" ? "block" : "none";
});