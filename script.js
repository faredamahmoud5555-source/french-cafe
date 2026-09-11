/* =========================================================
   CAFÉ LUMIÈRE — SCRIPT.JS
   
   This file is split into small, labeled sections:
   1. Mobile navigation (hamburger menu)
   2. Menu category filtering
   3. Reservation: guest count buttons
   4. Reservation: time slot buttons
   5. Reservation: form validation + confirmation message
   6. Footer year
   
   Every section only touches its own piece of the page,
   so you can edit one section without breaking the others.
========================================================= */

/* ---------------------------------------------------------
   1. MOBILE NAVIGATION
   Clicking the hamburger icon shows/hides the nav links.
--------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the mobile menu automatically after tapping a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------------------------------------------------------
   2. MENU CATEGORY FILTERING
   Clicking "All / Croissants / Hot Drinks / Soft Drinks"
   shows only the matching items by adding/removing the
   "is-hidden" CSS class.
--------------------------------------------------------- */
const filterButtons = document.querySelectorAll(".filter-btn");
const menuItems = document.querySelectorAll(".menu-item");
const menuCategoryTitles = document.querySelectorAll(".menu-category");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update which button looks "active"
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter; // "all", "croissants", "hot", or "soft"

    // Show/hide each menu item
    menuItems.forEach((item) => {
      const matches = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !matches);
    });

    // Show/hide each category heading (hide a category if it's not selected)
    menuCategoryTitles.forEach((title) => {
      const group = title.nextElementSibling.dataset.group; // matching <ul data-group="...">
      const show = filter === "all" || group === filter;
      title.style.display = show ? "" : "none";
    });
  });
});

/* ---------------------------------------------------------
   3. RESERVATION: GUEST COUNT BUTTONS
   Only one guest-count button can be selected at a time.
--------------------------------------------------------- */
const guestButtons = document.querySelectorAll(".guest-btn");
let selectedGuests = null;

guestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    guestButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    selectedGuests = button.dataset.guests; // e.g. "2" or "5+"
    updateSelectionSummary();
  });
});

/* ---------------------------------------------------------
   4. RESERVATION: TIME SLOT BUTTONS
   Only one time slot can be selected at a time.
--------------------------------------------------------- */
const timeButtons = document.querySelectorAll(".time-slot");
let selectedTime = null;

timeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timeButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    selectedTime = button.dataset.time; // e.g. "7:00 PM"
    updateSelectionSummary();
  });
});

// The date input, watched so the summary line updates live
const dateInput = document.getElementById("resDate");
dateInput.addEventListener("change", updateSelectionSummary);

const selectionSummary = document.getElementById("selectionSummary");

// Turns "2026-05-12" into "Tuesday, 12 May 2026"
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Rebuilds the "Tuesday, 12 May 2026 at 7:00 PM for 2 guests" line
function updateSelectionSummary() {
  const parts = [];

  if (dateInput.value) parts.push(formatDate(dateInput.value));
  if (selectedTime) parts.push(`at ${selectedTime}`);
  if (selectedGuests) parts.push(`for ${selectedGuests} guest${selectedGuests === "1" ? "" : "s"}`);

  selectionSummary.textContent = parts.length ? parts.join(" ") : "";
}

/* ---------------------------------------------------------
   5. RESERVATION: FORM VALIDATION + CONFIRMATION
--------------------------------------------------------- */
const reservationForm = document.getElementById("reservationForm");
const formError = document.getElementById("formError");
const confirmation = document.getElementById("confirmation");
const confirmationText = document.getElementById("confirmationText");
const newReservationBtn = document.getElementById("newReservationBtn");

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading (this is a frontend-only demo)
  formError.textContent = "";

  const name = document.getElementById("resName").value.trim();
  const phone = document.getElementById("resPhone").value.trim();
  const email = document.getElementById("resEmail").value.trim();
  const date = dateInput.value;

  // Simple, beginner-friendly validation checks, one at a time
  if (!date) {
    formError.textContent = "Please choose a date.";
    return;
  }
  if (!selectedGuests) {
    formError.textContent = "Please choose the number of guests.";
    return;
  }
  if (!selectedTime) {
    formError.textContent = "Please choose a time slot.";
    return;
  }
  if (!name) {
    formError.textContent = "Please enter your name.";
    return;
  }
  if (!phone) {
    formError.textContent = "Please enter your phone number.";
    return;
  }
  if (!email || !email.includes("@")) {
    formError.textContent = "Please enter a valid email address.";
    return;
  }

  // Everything is valid — build and show the confirmation message
  const readableDate = formatDate(date);
  confirmationText.textContent =
    `Your table has been reserved for ${readableDate} at ${selectedTime} ` +
    `for ${selectedGuests} guest${selectedGuests === "1" ? "" : "s"}. ` +
    `We look forward to seeing you, ${name}.`;

  reservationForm.hidden = true;
  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
});

// "Make another reservation" resets the form back to its starting state
newReservationBtn.addEventListener("click", () => {
  reservationForm.reset();
  guestButtons.forEach((b) => b.classList.remove("selected"));
  timeButtons.forEach((b) => b.classList.remove("selected"));
  selectedGuests = null;
  selectedTime = null;
  selectionSummary.textContent = "";
  formError.textContent = "";

  confirmation.hidden = true;
  reservationForm.hidden = false;
});

/* ---------------------------------------------------------
   6. FOOTER YEAR
   Keeps the copyright year correct automatically.
--------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();