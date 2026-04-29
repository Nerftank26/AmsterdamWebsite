/**
 * script.js — Team 3 Master System Controller
 * CSCI 4750 Systems Analysis and Design
 * * PURPOSE: 
 * This script manages the behavioral logic of the frontend. It handles
 * dynamic UI updates, mobile navigation states, and the temporary 
 * data storage for the online ordering system.
 */

/* ================================================================
   SECTION 1: UI INITIALIZATION (On Load)
   The 'DOMContentLoaded' listener ensures the script only executes 
   after the browser has fully parsed the HTML document.
   ================================================================ */
document.addEventListener("DOMContentLoaded", function () {
    
    /**
     * DYNAMIC FOOTER YEAR
     * logic: Uses the built-in JavaScript Date object.
     * What it does: Injects the current year into any element with id="year".
     */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /**
     * NAVIGATION EVENT LISTENERS
     * These hooks connect the HTML buttons to the JS functions below.
     */
    const toggle = document.getElementById("navToggle");
    const overlay = document.getElementById("navOverlay");

    // Triggering the mobile drawer
    if (toggle) {
        toggle.addEventListener("click", showMobileNav);
    }

    // Triggering the close action when clicking outside the menu
    if (overlay) {
        overlay.addEventListener("click", hideMobileNav);
    }
});

/* ================================================================
   SECTION 2: NAVIGATION LOGIC
   These functions directly manipulate the CSS 'display' property
   to toggle visibility of mobile-specific elements.
   ================================================================ */

/**
 * showMobileNav: Activates the mobile drawer and background dimming.
 */
function showMobileNav() {
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");
    
    // Safety check to prevent null-reference errors
    if (nav && overlay) {
        nav.style.display = "block";   // Reveals the vertical nav list
        overlay.style.display = "block"; // Reveals the dark background layer
    }
}

/**
 * hideMobileNav: Reverts the UI to its standard state.
 */
function hideMobileNav() {
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");
    
    if (nav) nav.style.display = "none";
    if (overlay) overlay.style.display = "none";
}

/* ================================================================
   SECTION 3: FORM & ORDERING LOGIC
   Prepares the system for SQL Server integration by capturing
   user inputs into local JavaScript objects.
   ================================================================ */

// Global State Object: Holds items before they are 'POSTed' to the DB.
var orderCart = {};

/**
 * submitReservation: Handles the Table Booking UI.
 * logic: Hides the input form and swaps in the success message.
 */
function submitReservation() {
    var form = document.getElementById("reservationForm");
    var success = document.getElementById("formSuccess");
    
    if (form && success) {
        form.style.display = "none"; // Clears the UI for the success state
        success.style.display = "block"; // Shows the user their request was received
    }
}

/**
 * addToCart: Increments the count for a specific menu item.
 * @param {string} name - The item name.
 * @param {number} price - The item cost.
 * @param {string} qtyId - The unique DOM ID for the quantity display.
 */
function addToCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;
    
    // Converts the current text content to a number to perform math
    var quantity = Number(qtyEl.textContent) || 0;
    
    // Update the UI display
    qtyEl.textContent = quantity + 1;
    
    // Store in the global cart object for final checkout
    orderCart[qtyId] = {
        name: name,
        price: price,
        quantity: quantity + 1
    };
}