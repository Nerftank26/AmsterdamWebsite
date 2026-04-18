/**
 * TEAM 3 | CSCI 4750 Systems Analysis and Design
 * script.js — Unified System Controller
 * * PURPOSE: 
 * This script serves as the 'Logic Layer' of the application. It handles 
 * asynchronous UI updates, manages the Shopping Cart state, and 
 * coordinates the mobile navigation system.
 */

/* ================================================================
   SECTION 1: GLOBAL STATE & INITIALIZATION
   ================================================================ */

/**
 * Global Order Object
 * logic: Acts as a temporary 'Session Storage' for the customer's cart.
 * data-structure: Key-value pairs where Key = qtyId, Value = item properties.
 */
var orderCart = {};

/**
 * DOMContentLoaded Event
 * logic: Ensures the browser has finished building the HTML tree (DOM) 
 * before we attach event listeners. Prevents 'null pointer' errors.
 */
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. DYNAMIC FOOTER UPDATE
    // logic: Synchronizes the site copyright year with the server system clock.
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. NAVIGATION COMPONENT HOOKS
    const toggle = document.getElementById("navToggle");
    const overlay = document.getElementById("navOverlay");

    if (toggle) toggle.addEventListener("click", showMobileNav);
    if (overlay) overlay.addEventListener("click", hideMobileNav);
    
    // 3. MENU INITIALIZATION
    // Ensures 'All' items are visible if the user lands on the Menus page.
    if (document.querySelector(".menu-card")) {
        filterMenu("all");
    }
});


/* ================================================================
   SECTION 2: ONLINE ORDERING LOGIC
   ================================================================ */

/**
 * addToCart / removeFromCart
 * logic: These functions handle the mathematical incrementation of items.
 * @param {string} name - The item name for the cart display.
 * @param {number} price - The numerical value for total calculation.
 * @param {string} qtyId - The specific ID for the quantity span in the HTML.
 */
function addToCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;

    var currentQty = Number(qtyEl.textContent) || 0;
    var newQty = currentQty + 1;
    
    // Update the Presentation Layer (HTML)
    qtyEl.textContent = newQty;

    // Update the Data Layer (JavaScript Object)
    orderCart[qtyId] = {
        name: name,
        price: price,
        quantity: newQty
    };

    updateCartTotal(); // Triggers the sidebar refresh
}

function removeFromCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;

    var currentQty = Number(qtyEl.textContent) || 0;
    var newQty = Math.max(0, currentQty - 1); // logic: Prevents negative inventory counts

    qtyEl.textContent = newQty;
    
    if (newQty === 0) {
        delete orderCart[qtyId]; // Remove from object to clean up memory
    } else {
        orderCart[qtyId].quantity = newQty;
    }

    updateCartTotal();
}

/**
 * updateCartTotal
 * logic: Iterates through the orderCart object to build the checkout summary.
 * UX Behavior: Hides the 'Empty' message if items exist.
 */
function updateCartTotal() {
    const cartList = document.getElementById("cartItemsList");
    const totalDisplay = document.getElementById("cartTotalAmount");
    const emptyMsg = document.getElementById("cartEmpty");
    const slotWarning = document.getElementById("slotWarning");

    if (!cartList || !totalDisplay) return;

    let totalSum = 0;
    let htmlBuilder = "";

    // Iterate through the Object entries
    const items = Object.values(orderCart);

    if (items.length === 0) {
        cartList.innerHTML = "";
        emptyMsg.style.display = "block";
        if (slotWarning) slotWarning.style.display = "none";
        totalDisplay.textContent = "$0.00";
        return;
    }

    // Process each item in the cart
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalSum += itemTotal;
        htmlBuilder += `
            <div class="cart-item-row" style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>`;
    });

    // Final UI injection
    cartList.innerHTML = htmlBuilder;
    totalDisplay.textContent = "$" + totalSum.toFixed(2);
    emptyMsg.style.display = "none";
    if (slotWarning) slotWarning.style.display = "block";
}


/* ================================================================
   SECTION 3: SYSTEM UI CONTROLS
   ================================================================ */

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

/**
 * placeOrder
 * FDD function: Connect to POS / Inventory auto-decrement.
 * logic: Placeholder for a 'POST' request to the SQL Server order table.
 */
function placeOrder() {
    if (Object.keys(orderCart).length === 0) {
        alert("Your cart is empty. Please select a meal before checkout.");
        return;
    }
    
    alert("Transaction Successful! Your pickup window is secured. Inventory has been updated.");
    
    // logic: Reset system state after success
    orderCart = {};
    location.reload(); 
}