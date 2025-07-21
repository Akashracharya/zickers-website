// js/cart.js

let cart = []; // Initialize the cart array, this will hold your actual cart data

// --- Cart Utility Functions ---

/**
 * Loads the cart data from localStorage.
 * If no cart data is found, initializes an empty array.
 */
function loadCart() {
    try {
        const storedCart = localStorage.getItem('zickersCart');
        cart = storedCart ? JSON.parse(storedCart) : [];
        console.log("Cart loaded:", cart); // For debugging
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        cart = []; // Ensure cart is an empty array on error
    }
}

/**
 * Saves the current cart array to localStorage.
 */
function saveCart() {
    try {
        localStorage.setItem('zickersCart', JSON.stringify(cart));
        console.log("Cart saved:", cart); // For debugging
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

/**
 * Adds a sticker to the cart.
 * If the sticker already exists, it increments its quantity.
 * @param {object} sticker - The sticker object to add (id, name, price, image).
 */
function addStickerToCart(sticker) {
    const existingItem = cart.find(item => item.id === sticker.id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1; // Increment quantity
        //alert(`${sticker.name} quantity updated in cart!`);
    } else {
        sticker.quantity = 1; // Initialize quantity for new item
        cart.push(sticker);
        //alert(`Added ${sticker.name} to your cart!`);
    }
    saveCart(); // Save the updated cart to localStorage
    updateCartCountDisplay(); // Update the cart count in the header
}

/**
 * Removes a sticker from the cart based on its ID.
 * @param {number} stickerId - The ID of the sticker to remove.
 */
function removeStickerFromCart(stickerId) {
    const initialCartLength = cart.length;
    cart = cart.filter(item => item.id !== stickerId);
    if (cart.length < initialCartLength) { // Check if an item was actually removed
        saveCart(); // Save updated cart
        displayCartItems(); // Re-render cart on cart.html to reflect removal
        updateCartCountDisplay(); // Update cart count in header
        //alert('Item removed from cart!');
    }
}

/**
 * Updates the quantity of a sticker in the cart.
 * @param {number} stickerId - The ID of the sticker to update.
 * @param {number} newQuantity - The new quantity for the sticker.
 */
function updateStickerQuantity(stickerId, newQuantity) {
    const item = cart.find(item => item.id === stickerId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1); // Ensure quantity is at least 1
        saveCart();
        displayCartItems(); // Re-render cart to update totals and display
        updateCartCountDisplay();
    }
}

// --- Cart Display Functions (Primarily for cart.html) ---

/**
 * Renders the cart items and summary on the cart.html page.
 */
function displayCartItems() {
    console.log("displayCartItems function called.");
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const emptyCartMessageDiv = document.querySelector('#empty-cart-message'); // Optional

    console.log("cartItemsContainer:", cartItemsContainer);
    console.log("cartSummaryContainer:", cartSummaryContainer);

    // Exit if not on the cart page (elements not found)
    if (!cartItemsContainer || !cartSummaryContainer) {
        console.warn("Cart display elements not found on this page. Exiting displayCartItems.");
        return;
    }

    // Clear previous items and hide summary initially
    cartItemsContainer.innerHTML = '';
    cartSummaryContainer.style.display = 'none'; // Hide summary by default
    if (emptyCartMessageDiv) emptyCartMessageDiv.style.display = 'none';

    if (cart.length === 0) {
        console.log("Cart is empty. Displaying empty cart message.");
        // Show empty cart message within the .cart-items container
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-content doodle-border">
                <p class="first-text">Your cart is feeling lonely 😢</p>
                <p class="second-text">Add some dope stickers to get started!</p>
                <button class="doodle-btn empty-cart-browse-btn">Browse Stickers</button>
            </div>
        `;
        cartSummaryContainer.style.display = 'none'; // Ensure summary is hidden
         const browseBtn = cartItemsContainer.querySelector('.empty-cart-browse-btn');
        if (browseBtn) {
            browseBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });}
        attachContinueShoppingListener(); // Re-attach listener for the new "Browse Stickers" button
        return; // Exit here, no items to display or totals to calculate
    }

    // If cart is NOT empty:
    console.log("Cart has items. Populating cart items and summary.");
    let subtotal = 0;
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item doodle-border'; // Match your HTML structure
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img doodle-border">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        subtotal += item.price * item.quantity;
    });

    // Calculate totals for summary
    const shipping = 0; // Assuming free shipping for now
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    // Update summary section - MAKE SURE THESE IDs MATCH YOUR cart.html EXACTLY
    console.log("Updating summary prices.");
    document.getElementById('cart-subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping-price').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax-price').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;

    cartSummaryContainer.style.display = 'block'; // Show summary if cart has items

    // --- Attach Event Listeners to Dynamically Created Elements ---
    // This is crucial because elements are re-created every time displayCartItems runs.

    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function(e) {
            const stickerId = parseInt(e.target.getAttribute('data-id'));
            removeStickerFromCart(stickerId);
        });
    });

    // Quantity input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function(e) {
            const stickerId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            updateStickerQuantity(stickerId, newQuantity);
        });
    });

    // Plus/Minus quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const stickerId = parseInt(e.target.getAttribute('data-id'));
            const quantityInput = e.target.parentElement.querySelector('.quantity-input');
            let currentQuantity = parseInt(quantityInput.value);

            if (e.target.classList.contains('plus')) {
                currentQuantity++;
            } else if (e.target.classList.contains('minus')) {
                currentQuantity--;
            }
            updateStickerQuantity(stickerId, currentQuantity);
        });
    });
}

/**
 * Updates a visual cart count (e.g., in the header)
 * Assumes an element with id="cart-count" exists.
 */
function updateCartCountDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItemsInCart;
        console.log("Cart count updated to:", totalItemsInCart);
    }
}

// --- Page Specific Event Listeners and Initial Load ---

// Listen for the custom 'addToCart' event dispatched from index.js
document.addEventListener('addToCart', function(event) {
    const stickerToAdd = event.detail; // The sticker object passed from index.js
    if (stickerToAdd) {
        addStickerToCart(stickerToAdd);
    }
});

// Load the cart from localStorage when cart.js is first loaded
loadCart();

// Attaches event listener for the "Continue Shopping" button (used on cart.html and empty cart state)
function attachContinueShoppingListener() {
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// When the DOM is fully loaded, perform initial setup based on the current page
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired in cart.js.");
    // Check if we are on cart.html (by checking for its specific elements)
    if (document.querySelector('.cart-items') && document.querySelector('.cart-summary')) {
        console.log("Cart display elements found on cart.html. Calling displayCartItems.");
        displayCartItems(); // Display cart items if on cart page
    } else {
        console.log("Cart display elements NOT found on this page. Likely not cart.html.");
    }
    // Always update the cart count in the header on any page load where cart.js is included
    updateCartCountDisplay();

    // Attach event listener for the "Checkout Now" button on cart.html
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                alert('Proceeding to checkout! (Functionality not implemented yet)');
            } else {
                alert('Your cart is empty. Add some stickers first!');
            }
        });
    }

    // Attach logout listener for cart.html if present
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('zickersUser');
            window.location.href = 'login.html';
        });
    }

    // Attach 'Continue Shopping' listener (for header button if it exists)
    attachContinueShoppingListener();
});

const browseBtn = document.querySelector('doodle-btn');
if(browseBtn){
  browseBtn.addEventListener('click',function(){
    window.location.href= 'index.html';
  
  })
}