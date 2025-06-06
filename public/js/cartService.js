// Cart service to handle cart operations
class CartService {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartIcon();
        // Тригеримо подію оновлення при ініціалізації
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Add item to cart
    addItem(item, extras = [], quantity = 1) {
        const existingItem = this.cart.find(i => 
            i.name === item.name && 
            JSON.stringify(i.extras) === JSON.stringify(extras)
        );

        const itemTotal = this.calculateItemTotal(item, extras);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.totalPrice = itemTotal * existingItem.quantity;
        } else {
            this.cart.push({
                ...item,
                extras,
                quantity,
                totalPrice: itemTotal * quantity
            });
        }

        this.saveCart();
        this.updateCartIcon();
        this.showNotification('Додано до кошика');
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Remove item from cart
    removeItem(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartIcon();
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Update item quantity
    updateQuantity(index, delta) {
        const item = this.cart[index];
        const newQuantity = Math.max(0, item.quantity + delta);
        
        if (newQuantity === 0) {
            this.removeItem(index);
            return; // removeItem вже тригерить подію оновлення
        }
        
        item.quantity = newQuantity;
        item.totalPrice = this.calculateItemTotal(item, item.extras) * newQuantity;
        this.saveCart();
        this.updateCartIcon();
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Calculate total price for an item with extras
    calculateItemTotal(item, extras) {
        const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);
        return item.price + extrasTotal;
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
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
        this.saveCart();
        this.updateCartIcon();
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
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
} 