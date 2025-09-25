// js/cart.js
// "God Tier" JavaScript for a fully functional and persistent shopping cart.

document.addEventListener('DOMContentLoaded', () => {

    // --- Product Data (This must be consistent across all your files) ---
    // This object provides the master details for each product.
    const products = {
        'goat': { id: 'goat', name: 'Premium Goat Meat', price: 850, image: 'https://placehold.co/200x200/e8f5e9/333?text=Goat' },
        'chicken': { id: 'chicken', name: 'Country Chicken', price: 320, image: 'https://placehold.co/200x200/fff9c4/333?text=Chicken' },
        'eggs': { id: 'eggs', name: 'Farm Eggs', price: 8, image: 'https://placehold.co/200x200/ffe0b2/333?text=Eggs' },
        'milk': { id: 'milk', name: 'Fresh Goat Milk', price: 60, image: 'https://placehold.co/200x200/f5f5f5/333?text=Milk' }
    };

    // --- DOM Element Selection ---
    const cartContentEl = document.getElementById('cart-content'); // Main container for the cart
    const headerCartCountEl = document.getElementById('cartCount'); // The number in the header

    // --- THE FIX: Use a consistent key for localStorage across all pages ---
    const CART_STORAGE_KEY = 'potlapalliCart';

    /**
     * Retrieves the cart from browser storage.
     * @returns {Array} The cart array.
     */
    function getCart() {
        try {
            const cartData = localStorage.getItem(CART_STORAGE_KEY);
            // We expect the cart to be an array of objects, not an object.
            return cartData && Array.isArray(JSON.parse(cartData)) ? JSON.parse(cartData) : [];
        } catch (e) {
            console.error("Could not parse cart from localStorage", e);
            return []; // Return an empty array on error
        }
    }

    /**
     * Saves the cart to browser storage and triggers a re-render.
     * @param {Array} cart - The cart array to save.
     */
    function saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        renderCart();
        updateHeaderCartCount();
    }

    /**
     * Updates the small cart count number in the website's header.
     */
    function updateHeaderCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if(headerCartCountEl) {
            headerCartCountEl.textContent = totalItems;
        }
    }

    /**
     * Updates the quantity of an item in the cart.
     * @param {string} productId - The ID of the product to update.
     * @param {number} change - The amount to change the quantity by (+1 or -1).
     */
    function updateItemQuantity(productId, change) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            // If quantity drops to 0 or less, remove the item completely.
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        saveCart(cart);
    }

    /**
     * Removes an item from the cart after user confirmation.
     * @param {string} productId - The ID of the product to remove.
     */
    function removeItem(productId) {
        let cart = getCart();
        const productName = products[productId]?.name || 'this item';
        const confirmed = confirm(`Are you sure you want to remove ${productName} from your cart?`);
        
        if (confirmed) {
            cart = cart.filter(item => item.id !== productId);
            saveCart(cart);
        }
    }

    /**
     * Renders the entire cart UI to the page based on the current cart data.
     */
    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            cartContentEl.innerHTML = `
                <div class="empty-cart">
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any fresh products yet.</p>
                    <a href="index.html" class="btn btn-primary" style="display:inline-block; width:auto;">Continue Shopping</a>
                </div>`;
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartContentEl.innerHTML = `
            <div class="cart-layout">
                <div class="cart-items">
                    ${cart.map(item => `
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${products[item.id]?.image || 'https://placehold.co/200x200/ccc/333?text=Image'}" alt="${item.name}">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>₹${item.price}</p>
                                <div class="quantity-controls">
                                    <button class="qty-btn decrease-qty-btn" title="Decrease quantity">-</button>
                                    <span class="qty">${item.quantity}</span>
                                    <button class="qty-btn increase-qty-btn" title="Increase quantity">+</button>
                                </div>
                            </div>
                            <span class="item-total">₹${item.price * item.quantity}</span>
                            <button class="remove-btn" title="Remove item"><i class="fas fa-trash"></i></button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery Fee</span>
                        <span>FREE</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <span>₹${subtotal}</span>
                    </div>
                    <a href="contact.html" class="btn btn-primary">Proceed to Checkout</a>
                    <a href="index.html" class="btn btn-outline">Continue Shopping</a>
                </div>
            </div>
        `;
    }

    // --- Event Delegation for Cart Actions (More robust and efficient) ---
    cartContentEl.addEventListener('click', (e) => {
        const target = e.target;
        const itemEl = target.closest('.cart-item');
        if (!itemEl) return;

        const productId = itemEl.dataset.id;

        if (target.closest('.increase-qty-btn')) {
            updateItemQuantity(productId, 1);
        } else if (target.closest('.decrease-qty-btn')) {
            updateItemQuantity(productId, -1);
        } else if (target.closest('.remove-btn')) {
            removeItem(productId);
        }
    });

    // --- Initial Load ---
    // Render the cart and update the header count when the page is first loaded.
    renderCart();
    updateHeaderCartCount();
});
