// Cart service to handle cart operations
class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.promoApplied = false; // Add promoApplied as instance variable
        this.updateCartIcon();
    }

    // Add item to cart
    addItem(item, extras = [], quantity = 1) {
        const existingItem = this.cart.find(i => 
            i.name === item.name && 
            JSON.stringify(i.extras) === JSON.stringify(extras)
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...item,
                extras,
                quantity,
                totalPrice: this.calculateItemTotal(item, extras) * quantity
            });
        }

        this.saveCart();
        this.updateCartIcon();
        this.showNotification('Додано до кошика');
    }

    // Remove item from cart
    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartIcon();
    }

    // Update item quantity
    updateQuantity(index, delta) {
        const item = this.cart[index];
        const newQuantity = Math.max(0, item.quantity + delta);
        
        if (newQuantity === 0) {
            this.removeItem(index);
        } else {
            item.quantity = newQuantity;
            item.totalPrice = this.calculateItemTotal(item, item.extras) * newQuantity;
            this.saveCart();
        }
        
        this.updateCartIcon();
    }

    // Calculate total price for an item with extras
    calculateItemTotal(item, extras) {
        const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
        return item.price + extrasTotal;
    }

    // Get cart total
    getTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
        const promoDiscount = this.promoApplied ? subtotal * 0.1 : 0;
        return subtotal - promoDiscount;
    }

    // Get cart items count
    getItemsCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.promoApplied = false; // Reset promo when cart is cleared
        this.saveCart();
        this.updateCartIcon();
    }

    // Update cart icon with items count
    updateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const count = this.getItemsCount();
            
            // Remove existing badge if any
            const existingBadge = document.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add new badge if count > 0
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = count;
                cartIcon.parentElement.appendChild(badge);
            }
        }
    }

    // Show notification
    showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create and show new notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate notification
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    // Apply promo code
    applyPromoCode(code) {
        // Check if cart is empty
        if (this.cart.length === 0) {
            this.showNotification('Додайте страви в кошик перед використанням промокоду');
            return false;
        }

        const promoCode = 'DRIBKAFWXYZM';
        if (code.toUpperCase() === promoCode) {
            this.promoApplied = true;
            this.showNotification('Промокод успішно активовано! Знижка 10% застосована');
            return true;
        }
        return false;
    }

    // Check if promo is applied
    isPromoApplied() {
        return this.promoApplied;
    }

    // Handle payment completion
    handlePaymentComplete() {
        this.clearCart();
        this.promoApplied = false;
    }
} 