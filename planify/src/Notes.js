const toggleIcons = document.querySelectorAll(".toggle-sidebar");
const sidebarRight = document.getElementById("sidebarRight");

toggleIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    sidebarRight.classList.toggle("show");
  });
});

// Tab switching functionality
const tabItems = document.querySelectorAll(".tab-item");

tabItems.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabItems.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    // Add active class to clicked tab
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
  });
});

// Add Note popup functionality
const addNoteBtn = document.querySelector(".add-note-btn");
const addNotePopup = document.getElementById("addNotePopup");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteForm = document.getElementById("noteForm");

// Open popup when add note button is clicked
addNoteBtn.addEventListener("click", () => {
  addNotePopup.classList.add("active");
});

// Close popup when clicking outside
addNotePopup.addEventListener("click", (e) => {
  if (e.target === addNotePopup) {
    addNotePopup.classList.remove("active");
  }
});

// Save note and close popup
saveNoteBtn.addEventListener("click", () => {
  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;

  if (title.trim() !== "") {
    // Create new note (in a real app, this would save to database)
    const notesGrid = document.querySelector(".notes-grid");
    const newNote = document.createElement("div");
    newNote.className = "note-card";
    newNote.innerHTML = `
            <h3 class="note-title">${title}</h3>
            <div class="note-content">${content}</div>
          `;

    notesGrid.prepend(newNote);

    // Reset form and close popup
    noteForm.reset();
    addNotePopup.classList.remove("active");
  }
});
