const tg = window.Telegram.WebApp;
tg.ready();

// Fake teacher data
const teachers = [
  { name: "Ustaz Ahmed", gender: "male", area: "Addis Ababa", experience: 5 },
  { name: "Ustaza Fatima", gender: "female", area: "Addis Ababa", experience: 3 },
  { name: "Ustaz Musa", gender: "male", area: "Dire Dawa", experience: 4 }
];

const teacherListDiv = document.getElementById("teacher-list");
const genderSelect = document.getElementById("gender");
const areaSelect = document.getElementById("area");

// Function to render teacher cards
function renderTeachers() {
  const selectedGender = genderSelect.value;
  const selectedArea = areaSelect.value;

  teacherListDiv.innerHTML = "";

  const filtered = teachers.filter(t => {
    return (selectedGender === "all" || t.gender === selectedGender) &&
           (selectedArea === "all" || t.area === selectedArea);
  });

  if (filtered.length === 0) {
    teacherListDiv.innerHTML = "<p>No teachers found.</p>";
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement("div");
    card.className = "teacher-card";
    card.innerHTML = `
      <strong>${t.name}</strong><br>
      Gender: ${t.gender}<br>
      Area: ${t.area}<br>
      Experience: ${t.experience} years<br>
      <button onclick="contactTeacher('${t.name}')">Contact</button>
    `;
    teacherListDiv.appendChild(card);
  });
}

// Contact button (for now just alert)
function contactTeacher(name) {
  alert(`You clicked to contact ${name}`);
}

// Filters change
genderSelect.addEventListener("change", renderTeachers);
areaSelect.addEventListener("change", renderTeachers);

// Initial render
renderTeachers();

// Close Mini App
function closeApp() {
  tg.close();
}
