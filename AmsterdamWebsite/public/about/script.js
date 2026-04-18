/* ================================================================
   script.js — The Amsterdam Local Shared Logic
   ================================================================ */

function writeFooterYear() {
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

function showMobileNav() {
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");
    if (nav) nav.style.display = "block";
    if (overlay) overlay.style.display = "block";
}

function hideMobileNav() {
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");
    if (nav) nav.style.display = "none";
    if (overlay) overlay.style.display = "none";
}

function filterMenu(category) {
    const cards = document.querySelectorAll(".menu-card");
    cards.forEach(function (card) {
        const cardCategory = card.dataset.category || "";
        card.style.display = category === "all" || cardCategory === category ? "" : "none";
    });
    const tabs = document.querySelectorAll(".menu-tab");
    tabs.forEach(function (tab) {
        const label = tab.textContent.trim().toLowerCase();
        tab.classList.toggle("active", label === category);
    });
}

// ... include other logic (Cart, Role Switching, Form Submission) ...

document.addEventListener("DOMContentLoaded", function () {
    writeFooterYear();
    var toggle = document.getElementById("navToggle");
    var overlay = document.getElementById("navOverlay");
    if (toggle) {
        toggle.addEventListener("click", showMobileNav);
    }
    if (overlay) {
        overlay.addEventListener("click", hideMobileNav);
    }
    if (document.querySelector(".menu-card")) {
        filterMenu("all");
    }
});