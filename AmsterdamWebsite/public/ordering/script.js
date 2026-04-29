/* ================================================================
   script.js — Online Ordering Page
   Team 3 | CSCI 4750 Systems Analysis and Design
   Requires: supabase-config.js loaded first

   Tables used:
   - menuitems (read) → dynamically loads available items
   ================================================================ */

/* ── Global Order State ── */
var allMenuItems = [];
var orderCart = {};
var isSystemLocked = false;
var countdownInterval;

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
    loadOrderItems();

    /* Check the kitchen pulse immediately on load */
    checkSystemAvailability();
});

/* ================================================================
   SUPABASE: Load Available Items
   Fetches all rows from menuitems table and renders order cards.
   Falls back to the hardcoded HTML if fetch fails.
   ================================================================ */
async function loadOrderItems() {
    // to keep track of the configuration file
    if (typeof supabaseFetch !== "function") {
        console.warn("supabase-config.js is not loaded");
        return;
    }

    try {
        // 2. Gets data into the global variable instead of the local 'items'.
        allMenuItems = await supabaseFetch("menuitems");

        if (!allMenuItems || allMenuItems.length === 0) {
            console.log("Database is empty");
            return;
        }

        // 3. Get menu categories from storagetypemenu column
        const categories = [...new Set(allMenuItems.map(item => item.storagetypemenu))];

        // 4. build for the tabbed navigation layer
        renderCategoryButtons(categories);

        // 5. Default to the 1st category
        if (categories.length > 0) {
            filterByCategory(categories[0]);
        }

        console.log("System Initialized: Categories are mapped.");

    } catch (error) {
        console.error("Failed to load order items:", error);
    }
}

// ===========================================================================
// RENDERED TAB BUTTONS, AND SWITCHING BETWEEN TABS FOR PICKING ITEMS FOR ORDER
// ===========================================================================
function renderCategoryButtons(categories) {
    const tabContainer = document.getElementById("categoryTabs");
    if (!tabContainer) return;

    tabContainer.innerHTML = categories.map((cat, index) => `
    <button class="category-btn ${index === 0 ? 'active' : ''}"
    onclick="filterByCategory('${cat}', this)">
    ${capitalize(cat)}
    </button>
    `).join('');
}

// =======================================
// RENDERED ITEMS IN THE SELECTED CATEGORY
// =======================================
function filterByCategory(categoryName, clickedBtn) {
    // for visual feedback, this will move the active class to the button clicked
    if (clickedBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    const container = document.getElementById("itemsContainer");

    // filters the list based on what the user chooses
    const filtered = allMenuItems.filter(item => item.storagetypemenu === categoryName);

    // builds the HTML for these items specifically as displayed menu items available
    container.innerHTML = filtered.map((item, i) => {
        const name = item.itemname || "Item";
        const price = parseFloat(String(item.itemprice).replace(/[^0-9.]/g, "")) || 0;

        // used a unique ID for the displayed quantity of a menu item
        // Sanitization to prevent apostrophe errors (like Farmer's Omelette)
        const qtyId = "qty_" + name.replace(/[^a-zA-Z0-9]/g, '');
        const currentQty = orderCart[qtyId]?.quantity || 0;

        return `
    <div class="order-item-card">
        <div class="item-info">
            <p class="order-item-name">${name}</p>
            <p class="order-item-desc">${item.itemdescription || ''}</p>
            <p class="order-item-price">$${price.toFixed(2)}</p>
        </div>
        <div class="qty-controls">
            <button class="qty-btn" onclick="removeFromCart('${name.replace(/'/g, "\\'")}', ${price}, '${qtyId}')">−</button>
            <span class="qty-display" id="${qtyId}">${currentQty}</span>
            <button class="qty-btn" onclick="addToCart('${name.replace(/'/g, "\\'")}', ${price}, '${qtyId}')">+</button>
        </div>
    </div>
`;
    }).join('');
}

/* ================================================================
   SYSTEMS DESIGN: OPERATIONAL CAPACITY GATE
   ================================================================ */

async function checkSystemAvailability() {
    const now = new Date();
    const minutes = now.getMinutes();

    // 1. Temporal Window Check: Last 15 minutes of the hour
    if (minutes >= 45) {
        triggerRestriction("WINDOW_CLOSED");
        return true;
    }

    // 2. Capacity Gate Check: Personnel availability based on order count
    try {
        const activeOrders = await supabaseFetch('orders', '&status=eq.Active');
        if (activeOrders && activeOrders.length >= 15) {
            triggerRestriction("CAPACITY_FULL");
            return true;
        }
    } catch (e) {
        console.error("Capacity check failed", e);
    }

    return false;
}

function triggerRestriction(reason) {
    isSystemLocked = true;
    document.getElementById('restrictionModal').classList.remove('hidden');

    const now = new Date();
    let target = new Date(now);
    // Logic: Calculate the start of the next 15-minute window
    target.setMinutes(Math.ceil((now.getMinutes() + 1) / 15) * 15);
    target.setSeconds(0);

    document.getElementById('nextWindowTime').innerText = "Ordering resumes at: " + target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const diff = target - new Date();
        if (diff <= 0) {
            clearInterval(countdownInterval);
            location.reload();
        }
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('timerDisplay').innerText = `${m}:${s < 10 ? '0' + s : s}`;
    }, 1000);
}

function closeRestrictionModal() {
    document.getElementById('restrictionModal').classList.add('hidden');
}

/* ================================================================
   CART LOGIC
   ================================================================ */

/**
 * addToCart — Increments quantity for the given item.
 */
function addToCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;

    var currentQty = Number(qtyEl.textContent) || 0;
    var newQty = currentQty + 1;

    /* Update the display */
    qtyEl.textContent = newQty;

    /* Update the data layer */
    orderCart[qtyId] = {
        name: name,
        price: price,
        quantity: newQty
    };

    updateCartTotal();
}

/**
 * removeFromCart — Decrements quantity, minimum 0.
 */
function removeFromCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;

    var currentQty = Number(qtyEl.textContent) || 0;
    var newQty = Math.max(0, currentQty - 1);

    qtyEl.textContent = newQty;

    if (newQty === 0) {
        delete orderCart[qtyId];
    } else {
        orderCart[qtyId] = { name: name, price: price, quantity: newQty };
    }

    updateCartTotal();
}

/**
 * updateCartTotal — Rebuilds the cart summary panel.
 */
function updateCartTotal() {
    var list = document.getElementById("cartItemsList");
    var totalEl = document.getElementById("cartTotalAmount");
    var emptyMsg = document.getElementById("cartEmpty");
    var warning = document.getElementById("slotWarning");

    if (!list || !totalEl) return;

    var itemsHtml = "";
    var total = 0;
    var itemCount = 0;

    for (var key in orderCart) {
        var item = orderCart[key];
        if (item.quantity > 0) {
            itemsHtml += '<div class="cart-item-row" style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem;">';
            itemsHtml += '<span>' + item.name + ' x' + item.quantity + '</span>';
            itemsHtml += '<span>$' + (item.price * item.quantity).toFixed(2) + '</span>';
            itemsHtml += '</div>';
            total += item.price * item.quantity;
            itemCount += item.quantity;
        }
    }

    list.innerHTML = itemsHtml;
    totalEl.textContent = "$" + total.toFixed(2);
    if (emptyMsg) emptyMsg.style.display = itemCount > 0 ? "none" : "block";
    if (warning) warning.style.display = itemCount > 0 ? "block" : "none";
}

/* Helper: capitalize first letter */
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * placeOrder — Validates, Checks Capacity, and Submits to Supabase.
 */
async function placeOrder() {
    // 1. Validation: Is the cart empty?
    if (Object.keys(orderCart).length === 0) {
        alert("Your cart is empty. Please select items before checkout.");
        return;
    }

    // 2. Systems Check: Is the kitchen full or the window closed?
    const isLocked = await checkSystemAvailability();
    if (isLocked) return; 

    // 3. User Input: Identification & Contact Info
    var custName = prompt("Please enter your name for pickup:");
    if (!custName) return;

    var custPhone = prompt("Please enter your phone number:");
    if (!custPhone) return;

    // 4. Calculate Total
    var total = 0;
    for (var key in orderCart) {
        total += orderCart[key].price * orderCart[key].quantity;
    }

    try {
        // 5. Preparation: Package the Data
        // Generating a unique ID using the current timestamp
        const currentOrderID = "ORD-" + Date.now();
        
        const orderData = {
            orderno: currentOrderID,
            custname: custName,
            phone: custPhone,
            total: total,
            status: "Active"
        };

        // 6. Execution: Database Insert
        // Sending directly to 'orders' table - no more 'customers' table needed.
        await supabaseInsert('orders', orderData);

        // 7. Feedback: Success Alert including the updated Order ID
        alert("Thank you, " + custName + "!\nOrder ID: " + currentOrderID + "\nTotal: $" + total.toFixed(2) + "\nReady in 25-30 minutes.");

        // 8. State Reset: Clear the data layer and reset the UI
        orderCart = {};
        updateCartTotal();
        
    } catch (error) {
        console.error("Submission has failed:", error);
        alert("System Error: We encountered an error placing your order. Please try again.");
    }
}