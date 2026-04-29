/* ================================================================
   script.js — Menus Page
   Team 3 | CSCI 4750 Systems Analysis and Design
   Requires: supabase-config.js loaded first

   Tables used:
   - menuitems (read) → dynamically loads menu items into cards
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

    /* Load menu items from Supabase */
    loadMenuItems();
});

/* ================================================================
   SUPABASE: Load Menu Items
   Fetches all rows from the menuitems table and renders as cards.
   Falls back to hardcoded HTML if the table is empty or fetch fails.
   ================================================================ */
async function loadMenuItems() {
    var grid = document.getElementById("menuGrid");
    if (!grid) return;

    /* Check if supabaseFetch exists */
    if (typeof supabaseFetch !== "function") {
        console.warn("supabase-config.js not loaded — using hardcoded items.");
        return;
    }

    try {
        var items = await supabaseFetch("menuitems");

        /* If table is empty, keep the hardcoded fallback cards */
        if (!items || items.length === 0) {
            console.log("menuitems table is empty — keeping hardcoded menu.");
            return;
        }

        /* Build menu cards from database rows */
        var html = "";

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var name = item.itemname || item.ItemName || "Menu Item";
            /* PostgreSQL money type returns "$13.00" — strip the $ before parsing */
            var rawPrice = String(item.itemprice || item.ItemPrice || "0");
            var price = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0;
            var storage = item.storagetypemenu || item.StorageTypeMenu || "";
            /* storagetypemenu IS the category (breakfast, lunch, dinner, drinks, desserts) */
            var category = storage.toLowerCase();
            var isVeg = item.Vegetarian || item.vegetarian || false;

            html += '<div class="menu-card" data-category="' + category + '">';
            html += '  <div class="menu-card-header">';
            html += '    <h3 class="menu-card-name">' + name + '</h3>';
            html += '    <span class="menu-card-price">$' + price.toFixed(0) + '</span>';
            html += '  </div>';
            html += '  <span class="menu-card-tag">' + capitalize(category) + '</span>';
            if (isVeg) {
                html += '  <span class="menu-card-badge badge-veg" title="Vegetarian">V</span>';
            }
            html += '</div>';
        }

        grid.innerHTML = html;
        console.log("Loaded " + items.length + " menu items from Supabase.");

    } catch (error) {
        console.error("Failed to load menu items:", error);
        console.log("Keeping hardcoded fallback menu.");
    }
}

/**
 * guessCategory — Maps item names to categories when no category column exists.
 * Uses simple keyword matching as a fallback.
 */
function guessCategory(name, storage) {
    var lower = (name + " " + storage).toLowerCase();
    if (lower.indexOf("pancake") >= 0 || lower.indexOf("egg") >= 0 || lower.indexOf("toast") >= 0 || lower.indexOf("waffle") >= 0 || lower.indexOf("omelette") >= 0 || lower.indexOf("breakfast") >= 0) return "breakfast";
    if (lower.indexOf("coffee") >= 0 || lower.indexOf("tea") >= 0 || lower.indexOf("latte") >= 0 || lower.indexOf("juice") >= 0 || lower.indexOf("drink") >= 0 || lower.indexOf("soda") >= 0 || lower.indexOf("smoothie") >= 0) return "drinks";
    if (lower.indexOf("cake") >= 0 || lower.indexOf("pie") >= 0 || lower.indexOf("cookie") >= 0 || lower.indexOf("dessert") >= 0 || lower.indexOf("ice cream") >= 0 || lower.indexOf("brownie") >= 0) return "desserts";
    if (lower.indexOf("steak") >= 0 || lower.indexOf("rib") >= 0 || lower.indexOf("salmon") >= 0 || lower.indexOf("dinner") >= 0 || lower.indexOf("pasta") >= 0 || lower.indexOf("risotto") >= 0) return "dinner";
    return "lunch";
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ================================================================
   MENU FILTER — Tab-based category filtering
   ================================================================ */
function filterMenu(category) {
    var cards = document.querySelectorAll(".menu-card");
    var tabs = document.querySelectorAll(".menu-tab");

    /* Filter cards by data-category */
    cards.forEach(function (card) {
        if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });

    /* Toggle active state on tab buttons */
    tabs.forEach(function (tab) {
        var tabText = tab.innerText.toLowerCase();
        if (tabText === category || (category === "all" && tabText === "all")) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}
