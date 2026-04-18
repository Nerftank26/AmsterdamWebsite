import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔑 Supabase setup
const supabase = createClient(
    "https://YOUR_PROJECT_ID.supabase.co",
    "YOUR_ANON_KEY"
);

/**
 * submitSuggestion
 * Handles suggestion form submission and saves to Supabase
 */
async function submitSuggestion() {
    const form = document.getElementById("suggestionsForm");
    const success = document.getElementById("suggestionsSuccess");

    const category = document.getElementById("suggestionCategory");
    const name = document.getElementById("suggestionName");
    const email = document.getElementById("suggestionEmail");
    const text = document.getElementById("suggestionText");
    const anonymous = document.getElementById("anonymous");

    const catError = document.getElementById("suggestionCategoryError");
    const textError = document.getElementById("suggestionTextError");

    // Clear errors
    if (catError) catError.textContent = "";
    if (textError) textError.textContent = "";

    let isValid = true;

    // Validation
    if (!category.value) {
        if (catError) catError.textContent = "Please select a category.";
        isValid = false;
    }

    if (!text.value.trim()) {
        if (textError) textError.textContent = "Please enter your suggestion.";
        isValid = false;
    }

    if (!isValid) return;

    // Prepare data
    const payload = {
        name: anonymous && anonymous.checked
            ? "Anonymous"
            : (name.value.trim() || "Anonymous"),
        suggestion: `[${category.value}] ${text.value.trim()}` +
            (email.value.trim() ? ` | Email: ${email.value.trim()}` : "")
    };

    // Send to Supabase
    const { error } = await supabase
        .from("suggestions")
        .insert([payload]);

    if (error) {
        console.error("Suggestion error:", error);
        alert("There was a problem saving your suggestion.");
        return;
    }

    // Success UI
    if (form && success) {
        form.style.display = "none";
        success.style.display = "block";
    }
}