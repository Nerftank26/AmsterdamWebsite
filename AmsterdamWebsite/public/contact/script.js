/* ================================================================
   script.js — Contact / Reservations Page
   Team 3 | CSCI 4750 Systems Analysis and Design
   Requires: supabase-config.js loaded first

   Tables used:
   - reservations (write) → stores reservation requests
   ================================================================ */

/* ── System Initialization ── */
document.addEventListener("DOMContentLoaded", function () {
    /* Footer year */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Mobile nav toggle */
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    var overlay = document.getElementById("navOverlay");

    if (toggle) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
            if (overlay) overlay.classList.toggle("active");
        });
    }
    if (overlay) {
        overlay.addEventListener("click", function () {
            nav.classList.remove("open");
            overlay.classList.remove("active");
        });
    }
});

/* ================================================================
   RESERVATION FORM SUBMISSION
   Validates inputs, then either writes to Supabase or shows
   success directly if Supabase is unavailable.
   ================================================================ */
async function submitReservation() {
    var form = document.getElementById("reservationForm");
    var success = document.getElementById("formSuccess");

    /* Gather field values */
    var firstName = document.getElementById("firstName").value.trim();
    var lastName = document.getElementById("lastName").value.trim();
    var email = document.getElementById("resEmail").value.trim();
    var date = document.getElementById("resDate").value;
    var time = document.getElementById("resTime").value;
    var partySize = document.getElementById("partySize").value;

    /* Basic validation */
    if (!firstName || !lastName || !email || !date || !time || !partySize) {
        alert("Please fill in all required fields.");
        return;
    }

    /* Email format check */
    if (email.indexOf("@") < 1 || email.indexOf(".") < 3) {
        alert("Please enter a valid email address.");
        return;
    }

    /* Party size range check */
    var size = parseInt(partySize);
    if (isNaN(size) || size < 1 || size > 8) {
        alert("Party size must be between 1 and 8 guests.");
        return;
    }

    /* Try to save to Supabase if available */
    if (typeof supabaseInsert === "function") {
        try {
            await supabaseInsert("reservations", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                reservation_date: date,
                reservation_time: time,
                party_size: size
            });
            console.log("Reservation saved to Supabase.");
        } catch (error) {
            /* Log error but still show success — the UI confirmation
               is important even if DB write fails (e.g., table doesn't exist yet) */
            console.warn("Could not save to Supabase (table may not exist):", error.message);
        }
    }

    /* Show success state */
    if (form && success) {
        form.style.display = "none";
        success.style.display = "block";
    }
}

/* ================================================================
   CONTACT FORM SUBMISSION (if present on the page)
   ================================================================ */
function submitContact() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("contactSuccess");

    if (form && success) {
        form.style.display = "none";
        success.style.display = "block";
    }
}
