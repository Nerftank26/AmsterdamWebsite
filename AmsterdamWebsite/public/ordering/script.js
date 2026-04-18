/**
 * updateCartTotal
 * logic: 
 * 1. Iterates through the 'orderCart' global object.
 * 2. Rebuilds the HTML string for the cart panel.
 * 3. Calculates math for the final sum.
 */
function updateCartTotal() {
    const list = document.getElementById("cartItemsList");
    const totalEl = document.getElementById("cartTotalAmount");
    const emptyMsg = document.getElementById("cartEmpty");
    const warning = document.getElementById("slotWarning");

    if (!list || !totalEl) return;

    let itemsHtml = "";
    let total = 0;
    let itemCount = 0;

    // Loop through our local state object
    for (const key in orderCart) {
        const item = orderCart[key];
        if (item.quantity > 0) {
            itemsHtml += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>`;
            total += item.price * item.quantity;
            itemCount += item.quantity;
        }
    }

    // Toggle Empty state vs Item list
    list.innerHTML = itemsHtml;
    totalEl.innerText = `$${total.toFixed(2)}`;
    emptyMsg.style.display = itemCount > 0 ? "none" : "block";
    if(warning) warning.style.display = itemCount > 0 ? "block" : "none";
}

/**
 * removeFromCart: Inverse of addToCart logic.
 * Ensures quantity never drops below zero.
 */
function removeFromCart(name, price, qtyId) {
    var qtyEl = document.getElementById(qtyId);
    if (!qtyEl) return;
    
    var quantity = Number(qtyEl.textContent) || 0;
    var newQty = Math.max(0, quantity - 1);
    
    qtyEl.textContent = newQty;
    orderCart[qtyId] = { name: name, price: price, quantity: newQty };
    
    updateCartTotal();
}

/**
 * placeOrder: Final system validation.
 * Placeholder for AJAX/Fetch call to send data to the SQL Server.
 */
function placeOrder() {
    const total = parseFloat(document.getElementById("cartTotalAmount").innerText.replace('$', ''));
    if (total <= 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Order Successful! Your total is $" + total.toFixed(2) + ". Ready in 25 minutes.");
    // In production: location.reload() or resetState() would follow.
}