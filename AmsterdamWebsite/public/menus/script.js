/**
 * filterMenu Logic:
 * @param {string} category - The category string passed from HTML.
 * * SYSTEM BEHAVIOR:
 * 1. Finds every element with class 'menu-card'.
 * 2. Checks if the card's 'data-category' matches the selection.
 * 3. Hides non-matching cards via style.display.
 * 4. Toggles 'active' class on tabs for visual feedback.
 */
function filterMenu(category) {
    const cards = document.querySelectorAll(".menu-card");
    const tabs = document.querySelectorAll(".menu-tab");

    // 1. Filter the Content Grid
    cards.forEach(card => {
        // If selection is 'all', show everything. Otherwise, match strings.
        if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });

    // 2. Update the Filter Button UI
    tabs.forEach(tab => {
        const tabText = tab.innerText.toLowerCase();
        // If the button clicked matches the category, mark as active.
        if (tabText === category || (category === "all" && tabText === "all")) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}