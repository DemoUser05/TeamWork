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

    // Показ сповіщення про успішну оплату
    function showSuccessNotification() {
        // Створюємо елемент сповіщення
        const notification = document.createElement('div');
        notification.className = 'payment-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-check-circle-fill"></i>
                <div class="notification-text">
                    <h4>Оплата пройшла успішно!</h4>
                    <p>Незабаром кур'єр зв'яжеться з вами</p>
                </div>
            </div>
        `;

        // Додаємо стилі для сповіщення
        const style = document.createElement('style');
        style.textContent = `
            .payment-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                animation: slideIn 0.5s ease-out;
                border: 1px solid rgba(254, 154, 155, 0.2);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .notification-content i {
                font-size: 24px;
                color: #2ecc71;
            }

            .notification-text {
                color: #333;
            }

            .notification-text h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .notification-text p {
                margin: 5px 0 0;
                font-size: 14px;
                color: #666;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Видаляємо сповіщення після затримки
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                notification.remove();
                style.remove();
                // Перенаправляємо на сторінку успіху
                window.location.href = 'index.html';
            }, 500);
        }, 2000);
    }

    // Валідація форми
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Очищення попередніх помилок
        clearValidationErrors();

        // Валідація полів
        let isValid = true;
        
        // Перевірка номера карти
        const cardNumberValue = cardNumber.value.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cardNumberValue)) {
            showError(cardNumber, 'Введіть правильний номер карти');
            isValid = false;
        }

        // Перевірка терміну дії
        const [month, year] = expiry.value.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (!month || !year || 
            !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year) ||
            parseInt(month) < 1 || parseInt(month) > 12 ||
            (parseInt(year) < currentYear || 
             (parseInt(year) === currentYear && parseInt(month) < currentMonth))) {
            showError(expiry, 'Введіть правильний термін дії');
            isValid = false;
        }

        // Перевірка CVV
        if (!/^\d{3}$/.test(cvv.value)) {
            showError(cvv, 'Введіть правильний CVV код');
            isValid = false;
        }

        // Перевірка імені
        const cardName = document.getElementById('card-name');
        if (!/^[A-ZА-ЯІЇЄ\s]{2,}$/.test(cardName.value.toUpperCase())) {
            showError(cardName, 'Введіть ім\'я, як вказано на карті');
            isValid = false;
        }

        if (isValid) {
            // Показуємо анімацію завантаження
            const submitBtn = paymentForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            paymentForm.classList.add('loading');

            try {
                // Імітуємо обробку платежу
                await processPayment();
                
                // Показуємо сповіщення про успішну оплату
                showSuccessNotification();
                
                // Очищаємо кошик
                localStorage.removeItem('cart');
            } catch (error) {
                showError(submitBtn, 'Помилка оплати. Спробуйте ще раз.');
                submitBtn.disabled = false;
                paymentForm.classList.remove('loading');
            }
        }
    });

    // Функція для відображення помилок
    function showError(element, message) {
        element.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        element.parentNode.appendChild(feedback);
    }

    // Функція для очищення помилок
    function clearValidationErrors() {
        const invalidInputs = paymentForm.querySelectorAll('.is-invalid');
        const errorMessages = paymentForm.querySelectorAll('.invalid-feedback');
        
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));
        errorMessages.forEach(msg => msg.remove());
    }

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