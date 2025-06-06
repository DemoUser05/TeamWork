// Initialize cart service
const cartService = new CartService();

// Format card number with spaces
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for(let i = 0; i < value.length; i++) {
        if(i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if(value.length > 2) {
        input.value = value.slice(0, 2) + '/' + value.slice(2);
    } else {
        input.value = value;
    }
}

// Render order details
function renderOrderDetails() {
    const container = document.getElementById('order-details');
    container.innerHTML = '';

    cartService.cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <h6>${item.name}</h6>
                <div class="extras">${item.extras.map(extra => extra.name).join(', ')}</div>
                <div>Кількість: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${item.totalPrice} ₴</div>
        `;
        container.appendChild(div);
    });

    updateSummary();
}

// Update summary
function updateSummary() {
    const subtotal = cartService.getTotal();
    const deliveryFee = subtotal >= 500 ? 0 : (subtotal > 0 ? 60 : 0);
    const serviceFee = subtotal > 0 ? 20 : 0;
    const total = subtotal + deliveryFee + serviceFee;

    document.getElementById('subtotal').textContent = `${subtotal} ₴`;
    document.getElementById('delivery').textContent = deliveryFee === 0 
        ? (subtotal >= 500 ? 'Безкоштовно' : '0 ₴')
        : `${deliveryFee} ₴`;
    document.getElementById('service').textContent = `${serviceFee} ₴`;
    document.getElementById('total').textContent = `${total} ₴`;
    document.getElementById('pay-amount').textContent = `${total} ₴`;

    // Disable pay button if cart is empty
    const payButton = document.getElementById('pay-button');
    payButton.disabled = total === 0;
}

// Form validation
function validateForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardHolder = document.getElementById('card-holder').value.trim();

    if(cardNumber.length !== 16) {
        alert('Будь ласка, введіть правильний номер картки');
        return false;
    }

    if(!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Будь ласка, введіть правильний термін дії картки (MM/YY)');
        return false;
    }

    if(cvv.length !== 3) {
        alert('Будь ласка, введіть правильний CVV код');
        return false;
    }

    if(cardHolder.length < 5) {
        alert('Будь ласка, введіть ім\'я власника картки');
        return false;
    }

    return true;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Render initial order details
    renderOrderDetails();

    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));

    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    expiryInput.addEventListener('input', () => formatExpiryDate(expiryInput));

    // Form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(validateForm()) {
            // Here you would typically send the payment data to your backend
            alert('Оплата пройшла успішно! Дякуємо за замовлення.');
            cartService.clearCart();
            window.location.href = 'index.html'; // Redirect to home page
        }
    });
}); 