/**
 * Amazon Clone - Shopping Cart & Product Management
 * This file handles all the interactive features of our e-commerce site
 */

// ===== GLOBAL VARIABLES =====
// These store the current state of our shopping experience
let shoppingCart = [];           // What the customer has added to their cart
let totalCartValue = 0;          // How much everything costs together

// ===== PRODUCT CATALOG =====
// Our store's inventory - each product has all the info customers need
const productCatalog = {
    1: {
        id: 1,
        name: "Laptop",
        price: 1299.00,
        image: "laptop.jpg",
        originalPrice: 1399.00,
        category: "Electronics",
        description: "High-performance laptop perfect for work and gaming"
    },
    2: {
        id: 2,
        name: "iPhone 16 Pro",
        price: 999.00,
        image: "iphone.jpg",
        originalPrice: 1099.00,
        category: "Electronics",
        description: "Latest iPhone with advanced camera and performance"
    },
    3: {
        id: 3,
        name: "Headphones",
        price: 249.00,
        image: "headphones.jpg",
        originalPrice: 279.00,
        category: "Electronics",
        description: "Premium wireless headphones with noise cancellation"
    },
    4: {
        id: 4,
        name: "Apple Watch",
        price: 399.00,
        image: "watch.png",
        originalPrice: 449.00,
        category: "Electronics",
        description: "Smartwatch that tracks your health and keeps you connected"
    },
    5: {
        id: 5,
        name: "Tablet",
        price: 599.00,
        image: "tablet.png",
        originalPrice: 649.00,
        category: "Electronics",
        description: "Versatile tablet for entertainment and productivity"
    },
    6: {
        id: 6,
        name: "Speaker",
        price: 49.99,
        image: "speaker.jpg",
        originalPrice: 59.99,
        category: "Electronics",
        description: "Smart speaker with voice assistant capabilities"
    }
};

// ===== APPLICATION STARTUP =====
// When the page loads, we set up everything the user needs
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Amazon Clone is starting up...');
    refreshShoppingCartDisplay();
    connectAllUserInteractions();
});

// ===== SETTING UP USER INTERACTIONS =====
// This function connects all the buttons and inputs to their actions
function connectAllUserInteractions() {
    console.log('🔗 Connecting all user interactions...');
    
    // Make the search bar work
    setupSearchFunctionality();
    
    // Make category buttons work
    setupCategoryFiltering();
    
    // Add nice hover effects to product cards
    addProductCardAnimations();
    
    // Make checkout button work
    connectCheckoutButton();
}

// ===== SEARCH FUNCTIONALITY =====
// Let users find products by typing what they're looking for
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    // Search when user presses Enter
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                console.log('🔍 User searched for:', this.value);
                findProductsBySearchTerm();
            }
        });
    }
    
    // Search when user clicks the search button
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            console.log('🔍 User clicked search button');
            findProductsBySearchTerm();
        });
    }
}

// ===== CATEGORY FILTERING =====
// Let users browse products by category (Electronics, Books, etc.)
function setupCategoryFiltering() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const selectedCategory = this.querySelector('h3').textContent;
            console.log('📂 User selected category:', selectedCategory);
            showProductsInCategory(selectedCategory);
        });
    });
}

// ===== PRODUCT CARD ANIMATIONS =====
// Add smooth hover effects to make the site feel more interactive
function addProductCardAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // When mouse hovers over a product
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        // When mouse leaves the product
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== SHOPPING CART FUNCTIONS =====
// These functions handle adding, removing, and managing items in the cart

/**
 * Add a product to the shopping cart
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
    console.log('🛒 Adding product to cart:', productId);
    
    const productToAdd = productCatalog[productId];
    if (!productToAdd) {
        console.error('❌ Product not found:', productId);
        return;
    }
    
    // Check if this product is already in the cart
    const existingCartItem = shoppingCart.find(item => item.id === productId);
    
    if (existingCartItem) {
        // If it's already in cart, just increase the quantity
        existingCartItem.quantity += 1;
        console.log('➕ Increased quantity for:', productToAdd.name);
    } else {
        // If it's not in cart, add it as a new item
        shoppingCart.push({
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            image: productToAdd.image,
            quantity: 1
        });
        console.log('✨ Added new item to cart:', productToAdd.name);
    }
    
    // Update the display and show a nice animation
    refreshShoppingCartDisplay();
    playAddToCartAnimation(productId);
}

/**
 * Remove a product completely from the shopping cart
 * @param {number} productId - The ID of the product to remove
 */
function removeFromCart(productId) {
    console.log('🗑️ Removing product from cart:', productId);
    
    const itemToRemove = shoppingCart.find(item => item.id === productId);
    if (itemToRemove) {
        console.log('❌ Removed:', itemToRemove.name);
    }
    
    // Remove the item from the cart array
    shoppingCart = shoppingCart.filter(item => item.id !== productId);
    refreshShoppingCartDisplay();
}

/**
 * Change how many of a product the customer wants
 * @param {number} productId - The ID of the product
 * @param {number} newQuantity - How many they want now
 */
function updateQuantity(productId, newQuantity) {
    console.log('📊 Updating quantity for product', productId, 'to', newQuantity);
    
    const cartItem = shoppingCart.find(item => item.id === productId);
    if (cartItem) {
        if (newQuantity <= 0) {
            // If they want 0 or less, remove it completely
            removeFromCart(productId);
        } else {
            // Update the quantity
            cartItem.quantity = newQuantity;
            console.log('✅ Updated quantity for:', cartItem.name);
            refreshShoppingCartDisplay();
        }
    }
}

/**
 * Update everything related to the shopping cart display
 * This includes the cart count, total price, and list of items
 */
function refreshShoppingCartDisplay() {
    console.log('🔄 Refreshing cart display...');
    
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cartTotal');
    
    // Calculate how many total items are in the cart
    const totalItemsInCart = shoppingCart.reduce((total, item) => total + item.quantity, 0);
    
    // Update the cart count badge (the number next to the cart icon)
    if (cartCountElement) {
        cartCountElement.textContent = totalItemsInCart;
        
        // Add a fun bounce animation when items are added
        if (totalItemsInCart > 0) {
            cartCountElement.classList.add('bounce');
            setTimeout(() => cartCountElement.classList.remove('bounce'), 600);
        }
    }
    
    // Calculate the total cost of everything in the cart
    totalCartValue = shoppingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update the total price display
    if (cartTotalElement) {
        cartTotalElement.textContent = totalCartValue.toFixed(2);
    }
    
    // Update the list of items in the cart sidebar
    if (cartItemsContainer) {
        if (shoppingCart.length === 0) {
            // Show a friendly message when cart is empty
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            // Show all the items in the cart with controls to manage them
            cartItemsContainer.innerHTML = shoppingCart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" title="Remove one">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})" title="Add one more">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    console.log('✅ Cart display updated. Items:', totalItemsInCart, 'Total: $' + totalCartValue.toFixed(2));
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        const isOpen = cartSidebar.classList.contains('open');
        
        if (isOpen) {
            cartSidebar.classList.remove('open');
            cartOverlay.classList.remove('open');
        } else {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('open');
        }
    }
}

// Show add to cart animation
function showAddToCartAnimation(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.classList.add('loading');
        setTimeout(() => {
            productCard.classList.remove('loading');
        }, 1000);
    }
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        showAllProducts();
        return;
    }
    
    const productCards = document.querySelectorAll('.product-card');
    let foundProducts = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productId = parseInt(card.getAttribute('data-product-id'));
        const product = products[productId];
        
        if (productName.includes(searchTerm) || 
            product.name.toLowerCase().includes(searchTerm)) {
            card.style.display = 'block';
            foundProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no products found
    showSearchResults(foundProducts, searchTerm);
}

// Show all products
function showAllProducts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Remove any existing search message
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Show search results message
function showSearchResults(count, searchTerm) {
    // Remove any existing search message
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const featuredProducts = document.querySelector('.featured-products');
    if (featuredProducts) {
        const message = document.createElement('div');
        message.className = 'search-message';
        message.style.cssText = `
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 5px;
            margin-bottom: 20px;
            color: #666;
        `;
        
        if (count === 0) {
            message.innerHTML = `No products found for "${searchTerm}". <button onclick="showAllProducts()" style="background: #febd69; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Show All Products</button>`;
        } else {
            message.innerHTML = `Found ${count} product(s) for "${searchTerm}". <button onclick="showAllProducts()" style="background: #febd69; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Show All Products</button>`;
        }
        
        featuredProducts.insertBefore(message, featuredProducts.querySelector('.products-grid'));
    }
}

// Filter by category
function filterByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    let foundProducts = 0;
        productCards.forEach(card => {
        const productId = parseInt(card.getAttribute('data-product-id'));
        const product = products[productId];
        
        // Check if product category matches the selected category
        if (product && product.category === category) {
            card.style.display = 'block';
            foundProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show category filter message
    showCategoryResults(foundProducts, category);
}

// Show category filter results
function showCategoryResults(count, category) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const featuredProducts = document.querySelector('.featured-products');
    if (featuredProducts) {
        const message = document.createElement('div');
        message.className = 'search-message';
        message.style.cssText = `
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 5px;
            margin-bottom: 20px;
            color: #666;
        `;
        
        message.innerHTML = `Showing ${count} product(s) in ${category}. <button onclick="showAllProducts()" style="background: #febd69; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">Show All Products</button>`;
        
        featuredProducts.insertBefore(message, featuredProducts.querySelector('.products-grid'));
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading state to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Checkout functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    const removeLoading = addLoadingState(checkoutBtn, 'Processing...');
    
    // Simulate checkout process
    setTimeout(() => {
        removeLoading();
        alert(`Order placed successfully! Total: $${cartTotal.toFixed(2)}\n\nThank you for shopping with us!`);
        
        // Clear cart after successful checkout
        cart = [];
        updateCartDisplay();
        toggleCart();
    }, 2000);
}

// Add checkout event listener
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close cart with Escape key
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    // Swipe up to close cart (mobile)
    if (Math.abs(diff) > swipeThreshold) {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('open') && diff < 0) {
            toggleCart();
        }
    }
}

// Add product quick view functionality
function showProductQuickView(productId) {
    const product = products[productId];
    if (!product) return;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; position: relative;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="margin-bottom: 10px; color: #131921;">${product.name}</h2>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <span style="font-size: 1.5rem; font-weight: bold; color: #b12704;">$${product.price.toFixed(2)}</span>
                <span style="color: #666; text-decoration: line-through;">$${product.originalPrice.toFixed(2)}</span>
            </div>
            <p style="color: #666; margin-bottom: 20px;">High-quality product with excellent reviews. Perfect for your needs!</p>
            <button onclick="addToCart(${product.id}); this.parentElement.parentElement.remove();" style="width: 100%; background: #febd69; color: #131921; border: none; padding: 15px; font-size: 16px; font-weight: bold; border-radius: 5px; cursor: pointer;">Add to Cart</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Add click event to product cards for quick view
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on add to cart button
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(this.getAttribute('data-product-id'));
                showProductQuickView(productId);
            }
        });
    });
});
