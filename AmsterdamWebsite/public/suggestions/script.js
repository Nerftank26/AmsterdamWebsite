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
 * submitSuggestion
 * logic: 
 * 1. Grabs references to the form, success panel, and required inputs.
 * 2. Clears any existing error messages.
 * 3. Validates that Category and Text are not empty.
 * 4. Hides form and shows success UI if valid.
 */
function submitSuggestion() {
    // 1. Element Discovery
    const form = document.getElementById("suggestionsForm");
    const success = document.getElementById("suggestionsSuccess");
    const category = document.getElementById("suggestionCategory");
    const text = document.getElementById("suggestionText");
    
    // Error Span references
    const catError = document.getElementById("suggestionCategoryError");
    const textError = document.getElementById("suggestionTextError");

    // 2. Reset Error State
    if (catError) catError.textContent = "";
    if (textError) textError.textContent = "";

    let isValid = true;

    // 3. System Validation (Business Rules)
    if (!category.value) {
        catError.textContent = "Please select a category.";
        isValid = false;
    }
    if (!text.value.trim()) {
        textError.textContent = "Please enter your suggestion.";
        isValid = false;
    }

    // 4. UI Transition
    if (isValid && form && success) {
        form.style.display = "none";      // Removes form from DOM view
        success.style.display = "block";  // Injects success message
        // In production: Use fetch() to send JSON data to the SQL suggestions table.
    }
}