/**
 * script.js — Team 3 Master System Controller
 * CSCI 4750 Systems Analysis and Design
 *
 * PURPOSE:
 * This script manages the behavioral logic of the frontend. It handles
 * dynamic UI updates, mobile navigation states, and temporary
 * data storage for the online ordering system.
 */

/* ================================================================
   SECTION 1: UI INITIALIZATION (On Load)
   ================================================================ */
document.addEventListener("DOMContentLoaded", function () {
    /**
     * DYNAMIC FOOTER YEAR
     */
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /**
     * NAVIGATION EVENT LISTENERS
     */
    const toggle = document.getElementById("navToggle");
    const overlay = document.getElementById("navOverlay");

    if (toggle) {
        toggle.addEventListener("click", showMobileNav);
    }

    if (overlay) {
        overlay.addEventListener("click", hideMobileNav);
    }
});

/* ================================================================
   SECTION 2: NAVIGATION LOGIC
   ================================================================ */

/**
 * showMobileNav: Activates the mobile drawer and background dimming.
 */
function showMobileNav() {
    const nav = document.getElementById("primaryNav");
    const overlay = document.getElementById("navOverlay");

    if (nav && overlay) {
        nav.style.display = "block";
        overlay.style.display = "block";
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
   ================================================================ */

// Global State Object: Holds items before they are 'POSTed' to the DB.
var orderCart = {};

/**
 * submitReservation: Handles the Table Booking UI.
 * logic:
 * 1. Collects the reservation form values.
 * 2. Sends them to the backend.
 * 3. Only shows the success message if the backend save succeeds.
 */
function submitReservation() {
    var form = document.getElementById("reservationForm");
    var success = document.getElementById("formSuccess");

    var firstNameEl = document.getElementById("firstName");
    var lastNameEl = document.getElementById("lastName");
    var emailEl = document.getElementById("resEmail");
    var dateEl = document.getElementById("resDate");
    var timeEl = document.getElementById("resTime");
    var partySizeEl = document.getElementById("partySize");

    var firstName = firstNameEl ? firstNameEl.value.trim() : "";
    var lastName = lastNameEl ? lastNameEl.value.trim() : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var resDate = dateEl ? dateEl.value : "";
    var resTime = timeEl ? timeEl.value : "";
    var partySize = partySizeEl ? partySizeEl.value : "";

    if (!firstName || !lastName || !email || !resDate || !resTime || !partySize) {
        alert("Please complete all reservation fields.");
        return;
    }

    fetch("/api/reservations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            resDate: resDate,
            resTime: resTime,
            partySize: partySize
        })
    })
        .then(async function (response) {
            var data = await response.json().catch(function () {
                return {};
            });

            if (!response.ok) {
                throw new Error(data.error || "Failed to save reservation.");
            }

            return data;
        })
        .then(function () {
            if (form && success) {
                form.style.display = "none";
                success.style.display = "block";
            }
        })
        .catch(function (error) {
            console.error("Reservation submission failed:", error);
            alert("There was a problem saving your reservation. Please try again.");
        });
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

    var quantity = Number(qtyEl.textContent) || 0;

    qtyEl.textContent = quantity + 1;

    orderCart[qtyId] = {
        name: name,
        price: price,
        quantity: quantity + 1
    };
}