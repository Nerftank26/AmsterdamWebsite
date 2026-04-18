/**
 * script.js — Master System Controller
 * Purpose: Handles real-time search, navigation, and system-wide state.
 */

/**
 * searchIngredients
 * Implementation: Real-time Row Filtering.
 * What it does: Loops through the table and hides rows that 
 * do not match the search string typed in 'dbSearch'.
 */
function searchIngredients() {
    const input = document.getElementById("dbSearch");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("ingredientTable");
    const tr = table.getElementsByTagName("tr");

    // Start loop at index 1 to skip the header row <th>
    for (let i = 1; i < tr.length; i++) {
        let matchFound = false;
        // Search through the first 4 columns (Name, Qty, Loc, Vendor)
        const cells = tr[i].getElementsByTagName("td");
        for (let j = 0; j < 4; j++) {
            if (cells[j] && cells[j].innerText.toLowerCase().includes(filter)) {
                matchFound = true;
                break;
            }
        }
        tr[i].style.display = matchFound ? "" : "none";
    }
}

// SHARED NAV LOGIC
document.addEventListener("DOMContentLoaded", function () {
    // Dynamic Year Injection
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile Navigation Hooks
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");

    if (toggle) {
        toggle.addEventListener("click", () => {
            nav.style.display = "block";
            overlay.style.display = "block";
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            nav.style.display = "none";
            overlay.style.display = "none";
        });
    }
});