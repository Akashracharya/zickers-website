let cart = []; 

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


function saveCart() {
    try {
        localStorage.setItem('zickersCart', JSON.stringify(cart));
        console.log("Cart saved:", cart); // For debugging
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
}

function addStickerToCart(sticker) {
    const existingItem = cart.find(item => item.id === sticker.id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1; // Increment quantity

    } else {
        sticker.quantity = 1; 
        cart.push(sticker);
      
    }
    saveCart(); 
    updateCartCountDisplay(); 
}


function removeStickerFromCart(stickerId) {
    const initialCartLength = cart.length;
    cart = cart.filter(item => item.id !== stickerId);
    if (cart.length < initialCartLength) {
        saveCart(); 
        displayCartItems(); 
        updateCartCountDisplay(); 
       
    }
}

function updateStickerQuantity(stickerId, newQuantity) {
    const item = cart.find(item => item.id === stickerId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1); 
        saveCart();
        displayCartItems(); 
        updateCartCountDisplay();
    }
}


function displayCartItems() {
    console.log("displayCartItems function called.");
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    const emptyCartMessageDiv = document.querySelector('#empty-cart-message'); // Optional

    console.log("cartItemsContainer:", cartItemsContainer);
    console.log("cartSummaryContainer:", cartSummaryContainer);

   
    if (!cartItemsContainer || !cartSummaryContainer) {
        console.warn("Cart display elements not found on this page. Exiting displayCartItems.");
        return;
    }

    
    cartItemsContainer.innerHTML = '';
    cartSummaryContainer.style.display = 'none'; 
    if (emptyCartMessageDiv) emptyCartMessageDiv.style.display = 'none';

    if (cart.length === 0) {
        console.log("Cart is empty. Displaying empty cart message.");
       
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-content doodle-border">
                <p class="first-text">Your cart is feeling lonely 😢</p>
                <p class="second-text">Add some dope stickers to get started!</p>
                <button class="doodle-btn empty-cart-browse-btn">Browse Stickers</button>
            </div>
        `;
        cartSummaryContainer.style.display = 'none'; 
         const browseBtn = cartItemsContainer.querySelector('.empty-cart-browse-btn');
        if (browseBtn) {
            browseBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });}
        attachContinueShoppingListener(); 
        return; 
    }

  
    console.log("Cart has items. Populating cart items and summary.");
    let subtotal = 0;
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item doodle-border'; 
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

  
    const shipping = 0; 
    const taxRate = 0.10; 
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;


    console.log("Updating summary prices.");
    document.getElementById('cart-subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping-price').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax-price').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total-price').textContent = `$${total.toFixed(2)}`;

    cartSummaryContainer.style.display = 'block';

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function(e) {
            const stickerId = parseInt(e.target.getAttribute('data-id'));
            removeStickerFromCart(stickerId);
        });
    });

   
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function(e) {
            const stickerId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            updateStickerQuantity(stickerId, newQuantity);
        });
    });

   
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


function updateCartCountDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItemsInCart;
        console.log("Cart count updated to:", totalItemsInCart);
    }
}

document.addEventListener('addToCart', function(event) {
    const stickerToAdd = event.detail;
    if (stickerToAdd) {
        addStickerToCart(stickerToAdd);
    }
});


loadCart();


function attachContinueShoppingListener() {
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired in cart.js.");

    if (document.querySelector('.cart-items') && document.querySelector('.cart-summary')) {
        console.log("Cart display elements found on cart.html. Calling displayCartItems.");
        displayCartItems(); 
    } else {
        console.log("Cart display elements NOT found on this page. Likely not cart.html.");
    }
    
    updateCartCountDisplay();

   
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

   
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('zickersUser');
            window.location.href = 'login.html';
        });
    }

   
    attachContinueShoppingListener();
});

const browseBtn = document.querySelector('doodle-btn');
if(browseBtn){
  browseBtn.addEventListener('click',function(){
    window.location.href= 'index.html';
  
  })
}
