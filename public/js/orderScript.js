// Initialize cart service
const cartService = new CartService();

function renderOrder() {
    const container = document.getElementById("order-items");
    container.innerHTML = "";

    if (cartService.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="bi bi-cart3"></i>
                <p>Ваш кошик порожній</p>
                <a href="index.html" class="btn btn-outline-light">Перейти до меню</a>
            </div>
        `;
        return;
    }

    cartService.cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item d-flex align-items-center gap-3 mb-3";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <div class="text-muted small">
                    ${item.extras.map(extra => `${extra.name}`).join(', ')}
                </div>
                <div class="price">${item.price} грн</div>
            </div>
            <div class="quantity-controls">
                <button class="btn btn-sm" onclick="cartService.updateQuantity(${index}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm" onclick="cartService.updateQuantity(${index}, 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });

    updateSummary();
}

function updateSummary() {
    const list = document.getElementById("summary");
    list.innerHTML = "";

    // Subtotal
    const subtotal = cartService.getTotal();
    const subtotalItem = document.createElement("li");
    subtotalItem.innerHTML = `<span>Вартість страв</span><span>${subtotal} ₴</span>`;
    list.appendChild(subtotalItem);

    // Delivery fee
    const deliveryFee = subtotal >= 500 ? 0 : 60;
    const deliveryItem = document.createElement("li");
    deliveryItem.innerHTML = deliveryFee === 0
        ? `<span>Доставка</span><span class="text-success">Безкоштовно</span>`
        : `<span>Доставка</span><span>${deliveryFee} ₴</span>`;
    list.appendChild(deliveryItem);

    // Service fee
    const serviceFee = subtotal > 0 ? 20 : 0;
    const serviceItem = document.createElement("li");
    serviceItem.innerHTML = `<span>Сервісний збір</span><span>${serviceFee} ₴</span>`;
    list.appendChild(serviceItem);

    // Total
    const total = subtotal + deliveryFee + serviceFee;
    const totalItem = document.createElement("li");
    totalItem.innerHTML = `<span>Всього до сплати</span><strong>${total} ₴</strong>`;
    list.appendChild(totalItem);

    // Update pay button state
    const payButton = document.querySelector('.btn-success');
    if (payButton) {
        payButton.disabled = total === 0;
    }
}

// Handle promo code
function applyPromo() {
    const promoInput = document.querySelector('input[placeholder="Промокод"]');
    const code = promoInput.value.trim().toLowerCase();
    
    if (code === 'daily dose') {
        const discount = Math.min(50, cartService.getTotal() * 0.1); // 10% off, max 50 UAH
        if (discount > 0) {
            cartService.showNotification('Промокод застосовано!');
            promoInput.style.borderColor = '#FE9A9B';
            setTimeout(() => promoInput.style.borderColor = '', 2000);
        } else {
            cartService.showNotification('Додайте товари в кошик');
            promoInput.style.borderColor = '#dc3545';
            setTimeout(() => promoInput.style.borderColor = '', 2000);
        }
    } else {
        cartService.showNotification('Недійсний промокод');
        promoInput.style.borderColor = '#dc3545';
        setTimeout(() => promoInput.style.borderColor = '', 2000);
    }
}

// Handle delivery toggle
document.addEventListener('DOMContentLoaded', () => {
    const deliveryBtn = document.querySelector('.toggle-switch .btn-dark');
    const pickupBtn = document.querySelector('.toggle-switch .btn-light');
    
    if (deliveryBtn && pickupBtn) {
        deliveryBtn.addEventListener('click', () => {
            if (!deliveryBtn.classList.contains('active')) {
                deliveryBtn.classList.add('active');
                pickupBtn.classList.remove('active');
                document.querySelector('.delivery-address').style.display = 'block';
            }
        });
        
        pickupBtn.addEventListener('click', () => {
            if (!pickupBtn.classList.contains('active')) {
                pickupBtn.classList.add('active');
                deliveryBtn.classList.remove('active');
                document.querySelector('.delivery-address').style.display = 'none';
            }
        });
    }
});

// Initialize the order page
renderOrder();