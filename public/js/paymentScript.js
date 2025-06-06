document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо дані з кошика
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const summary = document.getElementById('summary');
    const paymentAmount = document.getElementById('payment-amount');
    
    // Відображення товарів з кошика
    function displayOrderItems() {
        if (!cart.length) {
            window.location.href = 'cart.html';
            return;
        }

        orderItems.innerHTML = cart.map(item => `
            <div class="item">
                <img src="${item.image}" alt="${item.name}">
                <div class="flex-grow-1">
                    <div class="item-name">${item.name}</div>
                    <div class="quantity-controls">
                        ${item.quantity} шт.
                    </div>
                </div>
                <div class="item-price">${(item.price * item.quantity).toFixed(2)} ₴</div>
            </div>
        `).join('');
    }

    // Відображення підсумку
    function displaySummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = subtotal >= 500 ? 0 : 50;
        const serviceFee = 20; // Сервісний збір
        
        // Перевіряємо чи є активний промокод
        const activePromoCode = localStorage.getItem('activePromoCode');
        let discount = 0;
        if (activePromoCode === 'DRIBKAFWXYZM') {
            discount = subtotal * 0.1; // 10% знижка
        }
        
        const total = subtotal + deliveryFee + serviceFee - discount;

        summary.innerHTML = `
            <li class="d-flex justify-content-between">
                <span class="item-name">Сума замовлення</span>
                <span class="item-price">${subtotal.toFixed(2)} ₴</span>
            </li>
            ${discount > 0 ? `
            <li class="d-flex justify-content-between text-success">
                <span class="item-name">Знижка (Промокод)</span>
                <span class="item-price">-${discount.toFixed(2)} ₴</span>
            </li>
            ` : ''}
            <li class="d-flex justify-content-between">
                <span class="item-name">Доставка</span>
                <div class="d-flex flex-column align-items-end">
                    <span class="item-price">${deliveryFee.toFixed(2)} ₴</span>
                    ${subtotal >= 500 ? '<small class="text-success">Безкоштовно при замовленні від 500 грн</small>' : ''}
                </div>
            </li>
            <li class="d-flex justify-content-between">
                <span class="item-name">Сервісний збір</span>
                <span class="item-price">${serviceFee.toFixed(2)} ₴</span>
            </li>
            <li class="d-flex justify-content-between">
                <span class="item-name fw-bold">Загальна сума</span>
                <span class="item-price fw-bold">${total.toFixed(2)} ₴</span>
            </li>
        `;

        paymentAmount.textContent = `${total.toFixed(2)} ₴`;
    }

    // Форматування номера карти
    const cardNumber = document.getElementById('card-number');
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Форматування терміну дії
    const expiry = document.getElementById('expiry');
    expiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Форматування CVV
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });

    // Обробник форми оплати
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Обробка оплати...
        `;

        // Імітуємо обробку платежу
        setTimeout(() => {
            // Очищаємо кошик
            localStorage.removeItem('cart');
            localStorage.removeItem('orderData');

            // Показуємо повідомлення про успіх
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success text-center';
            successMessage.style.position = 'fixed';
            successMessage.style.top = '20px';
            successMessage.style.left = '50%';
            successMessage.style.transform = 'translateX(-50%)';
            successMessage.style.padding = '20px 40px';
            successMessage.style.borderRadius = '10px';
            successMessage.style.backgroundColor = '#FE9A9B';
            successMessage.style.color = 'white';
            successMessage.style.zIndex = '1000';
            successMessage.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            successMessage.style.minWidth = '300px';
            successMessage.style.animation = 'slideDown 0.5s ease-out';
            successMessage.innerHTML = `
                <h4 class="mb-3">Оплата пройшла успішно!</h4>
                <p class="mb-0">Незабаром з вами зв'яжеться кур'єр</p>
            `;

            // Додаємо стилі анімації
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideDown {
                    from {
                        transform: translate(-50%, -100%);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(successMessage);
            
            // Перенаправляємо на головну сторінку
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    });

    // Імітація обробки платежу
    function processPayment() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    // Ініціалізація відображення
    displayOrderItems();
    displaySummary();
}); 