/* ── Shared Init: Nav Toggle + Footer Year ── */
document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
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


/**
 * switchLoginRole
 * @param {string} role - 'admin' or 'staff'
 * logic: 
 * 1. Finds the specific tab buttons and hint text by ID.
 * 2. Adds/Removes the 'active' CSS class to change button appearance.
 * 3. Updates the innerText of the hint to provide role-specific guidance.
 */
function switchLoginRole(role) {
    var adminTab = document.getElementById("tabAdmin");
    var staffTab = document.getElementById("tabStaff");
    var hint = document.getElementById("loginRoleHint");

    // Safety check to ensure we are actually on the login page
    if (!adminTab || !staffTab || !hint) return;

    if (role === "admin") {
        adminTab.classList.add("active");
        staffTab.classList.remove("active");
        hint.innerText = "Sign in with your administrator credentials.";
    } else {
        staffTab.classList.add("active");
        adminTab.classList.remove("active");
        hint.innerText = "Sign in with your staff credentials.";
    }
}