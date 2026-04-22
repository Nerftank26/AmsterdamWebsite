import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 Supabase setup
const supabase = createClient(
    "https://ffcxtiqxrlkjfccrunzk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmY3h0aXF4cmxramZjY3J1bnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMzM3NzMsImV4cCI6MjA5MTYwOTc3M30.pTiuFl_qNEi6gqMcstJDbWeogjLWfXm5SNkCE-AszKg"
);

/**
 * submitReservation
 * Saves reservation to Supabase
 */
async function submitReservation() {
    const form = document.getElementById("reservationForm");
    const success = document.getElementById("formSuccess");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("resEmail");
    const resDate = document.getElementById("resDate");
    const resTime = document.getElementById("resTime");
    const partySize = document.getElementById("partySize");

    // Validation
    if (
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !email.value.trim() ||
        !resDate.value ||
        !resTime.value ||
        !partySize.value
    ) {
        alert("Please complete all reservation fields.");
        return;
    }

    // Prepare data
    const payload = {
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim(),
        email: email.value.trim(),
        reservation_date: resDate.value,
        reservation_time: resTime.value,
        party_size: Number(partySize.value)
    };

    // Send to Supabase
    const { error } = await supabase
        .from("reservations")
        .insert([payload]);

    if (error) {
        console.error("Reservation error:", error);
        alert("There was a problem saving your reservation.");
        return;
    }

    // Success UI
    if (form && success) {
        form.style.display = "none";
        success.style.display = "block";
    }
}

/**
 * NAVIGATION (kept from your original code)
 */
document.addEventListener("DOMContentLoaded", function () {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const toggle = document.getElementById("navToggle");
    const overlay = document.getElementById("navOverlay");

    if (toggle) toggle.addEventListener("click", showMobileNav);
    if (overlay) overlay.addEventListener("click", hideMobileNav);
});

function showMobileNav() {
    document.getElementById("primaryNav").style.display = "block";
    document.getElementById("navOverlay").style.display = "block";
}

function hideMobileNav() {
    document.getElementById("primaryNav").style.display = "none";
    document.getElementById("navOverlay").style.display = "none";
}