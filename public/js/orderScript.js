// Глобальні змінні
let currentAddress = {
  city: '',
  street: '',
  floor: '',
  apartment: '',
  entrance: ''
};

let addressModal;
let cartService;

document.addEventListener('DOMContentLoaded', function() {
  // Ініціалізуємо CartService
  cartService = new CartService();
  
  // Ініціалізуємо модальне вікно для адреси
  addressModal = new bootstrap.Modal(document.getElementById('addressModal'));
  
  // Ініціалізуємо обробники подій
  initializeEventListeners();
  
  // Відображаємо замовлення
  renderOrder();
  
  // Встановлюємо початковий стан кнопки оплати
  updatePaymentButtonState();
});

function renderOrder() {
  const container = document.getElementById("order-items");
  if (!container) return;
  
  container.innerHTML = "";

  // Отримуємо страви з CartService
  const items = cartService.cart;

  // Показуємо повідомлення про пустий кошик, якщо немає страв
  if (!items || items.length === 0) {
    const emptyCart = document.createElement("div");
    emptyCart.className = "empty-cart";
    emptyCart.innerHTML = `
      <i class="bi bi-cart-x"></i>
      <h3>Ваш кошик порожній</h3>
      <p>Додайте страви з меню, щоб зробити замовлення</p>
      <button class="btn btn-outline-secondary" onclick="window.location.href='menu.html'">
        <i class="bi bi-arrow-left"></i> Повернутись до меню
      </button>
    `;
    container.appendChild(emptyCart);
    updateSummary();
    return;
  }

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "d-flex align-items-center mb-3";
    
    // Базова інформація про страву
    let itemHtml = `
      <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px;">
      <div class="flex-grow-1">
        <strong>${item.name}</strong><br>
        ${item.price} грн
    `;

    // Додаємо додаткові опції, якщо вони є
    if (item.extras && item.extras.length > 0) {
      itemHtml += '<div class="extras-list">';
      item.extras.forEach(extra => {
        itemHtml += `<small class="text-muted">+ ${extra.name} (${extra.price} грн)</small><br>`;
      });
      itemHtml += '</div>';
    }

    // Додаємо примітку, якщо вона є
    if (item.notes) {
      itemHtml += `<small class="text-muted">Примітка: ${item.notes}</small>`;
    }

    itemHtml += `
      </div>
      <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${index}, -1)">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary me-3" onclick="changeQty(${index}, 1)">+</button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${index})" aria-label="Видалити">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    div.innerHTML = itemHtml;
    container.appendChild(div);
  });

  updateSummary();
}

function changeQty(index, delta) {
  cartService.updateQuantity(index, delta);
  renderOrder();
}

function deleteItem(index) {
  // Видаляємо страву з CartService (який автоматично оновить localStorage)
  cartService.removeItem(index);
  
  // Оновлюємо відображення кошика
  renderOrder();
  
  // Показуємо повідомлення про видалення
  showSuccessMessage('Страву видалено з кошика');
}

function updateSummary() {
  const list = document.getElementById("summary");
  if (!list) return;
  
  list.innerHTML = "";

  // Отримуємо страви з CartService
  const items = cartService.cart || [];
  let subtotal = cartService.getTotal();
  const originalSubtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Перевіряємо тип доставки
  const isDelivery = document.getElementById('deliveryBtn').classList.contains('btn-dark');

  // Якщо кошик порожній, показуємо початковий стан
  if (items.length === 0) {
    let emptyStateHtml = `
      <li class="list-group-item d-flex justify-content-between">
        <span class="item-name text-muted">Додайте страви з меню</span>
        <span class="item-price text-muted">0 грн</span>
      </li>`;

    // Показуємо роботу кур'єра тільки якщо вибрана доставка
    if (isDelivery) {
      emptyStateHtml += `
        <li class="list-group-item d-flex justify-content-between">
          <span class="item-name service-fee">Робота кур'єра</span>
          <span class="item-price text-muted">0 грн</span>
        </li>`;
    }

    emptyStateHtml += `
      <li class="list-group-item d-flex justify-content-between">
        <span class="item-name service-fee">Сервісний збір</span>
        <span class="item-price text-muted">0 грн</span>
      </li>
      <li class="list-group-item d-flex justify-content-between fw-bold">
        <span class="item-name">Разом</span>
        <span class="item-price">0 грн</span>
      </li>`;

    list.innerHTML = emptyStateHtml;
    updatePaymentButtonState();
    return;
  }

  // Показуємо суму замовлення
  list.innerHTML = `
    <li class="list-group-item d-flex justify-content-between">
      <span class="item-name">Сума замовлення</span>
      <span class="item-price">${originalSubtotal.toFixed(2)} грн</span>
    </li>`;

  // Показуємо знижку по промокоду, якщо він активований
  if (cartService.isPromoApplied()) {
    const discount = originalSubtotal * 0.1;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between text-success">
        <span class="item-name">Знижка по промокоду (10%)</span>
        <span class="item-price">-${discount.toFixed(2)} грн</span>
      </li>`;
  }

  // Показуємо вартість доставки, якщо вона є
  if (isDelivery) {
    const deliveryCost = originalSubtotal < 500 ? 60 : 0;
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span class="item-name service-fee">Робота кур'єра${originalSubtotal >= 500 ? ' (безкоштовно)' : ''}</span>
        <span class="item-price">${deliveryCost} грн</span>
      </li>`;
    subtotal += deliveryCost;
  }

  // Додаємо сервісний збір
  list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
      <span class="item-name service-fee">Сервісний збір</span>
      <span class="item-price">20 грн</span>
    </li>`;
  subtotal += 20;

  // Показуємо загальну суму
  list.innerHTML += `
    <li class="list-group-item d-flex justify-content-between fw-bold">
      <span class="item-name">Разом</span>
      <span class="item-price">${subtotal.toFixed(2)} грн</span>
    </li>`;

  updatePaymentButtonState();
}

function updatePaymentButtonState() {
  const paymentBtn = document.querySelector('.payment-btn');
  if (paymentBtn) {
    const items = cartService.cart || [];
    paymentBtn.disabled = items.length === 0;
  }
}

function applyPromo() {
  const promoInput = document.getElementById("promo");
  const code = promoInput.value.trim();
  
  if (cartService.applyPromoCode(code)) {
    promoInput.style.backgroundColor = "#c2f0c2";
    updateSummary();
  } else {
    promoInput.style.backgroundColor = "#f5c2c2";
    cartService.showNotification('Недійсний промокод');
    setTimeout(() => {
      promoInput.style.backgroundColor = "";
    }, 2000);
  }
}

function toggleEdit(id) {
  const input = document.getElementById(id);
  input.disabled = !input.disabled;
  if (!input.disabled) input.focus();
}

// Функція ініціалізації обробників подій
function initializeEventListeners() {
  // Обробник для кнопки збереження адреси
  document.getElementById('saveAddressBtn').addEventListener('click', saveAddress);
  
  // Обробник для кнопки закриття
  document.querySelector('#addressModal .btn-close').addEventListener('click', () => {
    addressModal.hide();
  });
  
  // Обробник для закриття по кліку поза модальним вікном
  document.getElementById('addressModal').addEventListener('click', function(event) {
    if (event.target === this) {
      addressModal.hide();
    }
  });
  
  // Обробник для клавіші Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('addressModal').classList.contains('show')) {
      addressModal.hide();
    }
  });
}

// Функція відкриття модального вікна
function openAddressModal() {
  // Отримуємо поточну адресу з тексту, якщо вона є
  const addressText = document.querySelector('.address-text');
  if (addressText && addressText.textContent !== 'Натисніть щоб обрати адресу') {
    const parts = addressText.textContent.split(', ');
    if (parts.length >= 2) {
      currentAddress.city = parts[0] || '';
      currentAddress.street = parts[1] || '';
      
      // Парсимо додаткові дані
      parts.slice(2).forEach(part => {
        if (part.startsWith('кв.')) {
          currentAddress.apartment = part.replace('кв.', '').trim();
        } else if (part.startsWith('під\'їзд')) {
          currentAddress.entrance = part.replace('під\'їзд', '').trim();
        } else if (part.startsWith('поверх')) {
          currentAddress.floor = part.replace('поверх', '').trim();
        }
      });
    }
  }

  // Заповнюємо поля форми
  document.getElementById('city').value = currentAddress.city;
  document.getElementById('street').value = currentAddress.street;
  document.getElementById('floor').value = currentAddress.floor;
  document.getElementById('apartment').value = currentAddress.apartment;
  document.getElementById('entrance').value = currentAddress.entrance;
  
  // Відкриваємо модальне вікно
  addressModal.show();
}

// Функція збереження адреси
function saveAddress() {
  // Зберігаємо значення
  currentAddress = {
    city: document.getElementById('city').value.trim(),
    street: document.getElementById('street').value.trim(),
    floor: document.getElementById('floor').value.trim(),
    apartment: document.getElementById('apartment').value.trim(),
    entrance: document.getElementById('entrance').value.trim()
  };

  // Валідація обов'язкових полів
  if (!currentAddress.city || !currentAddress.street) {
    showErrorMessage('Місто та вулиця обов\'язкові для заповнення');
    return;
  }

  // Оновлюємо відображення адреси
  updateAddressDisplay();
  
  // Закриваємо модальне вікно
  addressModal.hide();
  
  // Показуємо повідомлення про успіх
  showSuccessMessage('Адресу успішно збережено');
}

// Функція оновлення відображення адреси
function updateAddressDisplay() {
  const addressText = document.querySelector('.address-text');
  if (addressText) {
    const parts = [currentAddress.city, currentAddress.street];
    if (currentAddress.apartment) parts.push(`кв. ${currentAddress.apartment}`);
    if (currentAddress.entrance) parts.push(`під'їзд ${currentAddress.entrance}`);
    if (currentAddress.floor) parts.push(`поверх ${currentAddress.floor}`);
    
    addressText.textContent = parts.join(', ');
  }
}

// Збереження та відновлення номера телефону
let savedPhoneNumber = '';

function validatePhoneNumber(phone) {
  // Видаляємо всі символи крім цифр
  const digits = phone.replace(/\D/g, '');
  
  // Перевіряємо чи починається з 380 або 0
  if (digits.startsWith('380')) {
    return digits.length === 12;
  } else if (digits.startsWith('0')) {
    return digits.length === 10;
  }
  return false;
}

function formatPhoneNumber(phone) {
  // Видаляємо всі символи крім цифр
  let digits = phone.replace(/\D/g, '');
  
  // Якщо номер починається з 0, додаємо 38
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '38' + digits;
  }
  
  // Форматуємо номер як +38 (0XX) XXX-XX-XX
  if (digits.length === 12) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
  }
  return phone;
}

function togglePhoneEdit() {
  const phoneInputWrapper = document.getElementById('phoneInputWrapper');
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput.disabled) {
    // Відкриваємо поле
    phoneInput.disabled = false;
    phoneInputWrapper.classList.add('active');
    gsap.fromTo(phoneInputWrapper, { width: 0 }, { duration: 0.5, width: 180, ease: "power2.out" });
    phoneInput.focus();
    
    // Відновлюємо збережений номер
    if (savedPhoneNumber) {
      phoneInput.value = savedPhoneNumber;
    }

    // Додаємо обробник введення
    phoneInput.addEventListener('input', function() {
      const isValid = validatePhoneNumber(this.value);
      if (isValid) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
        savedPhoneNumber = formatPhoneNumber(this.value);
        this.value = savedPhoneNumber;
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });

    // Додаємо плейсхолдер з прикладом
    phoneInput.placeholder = '+38 (0XX) XXX-XX-XX';
  } else {
    // Перевіряємо валідність перед закриттям
    if (phoneInput.value && !validatePhoneNumber(phoneInput.value)) {
      showErrorMessage('Введіть коректний номер телефону');
      return;
    }

    // Закриваємо поле
    gsap.to(phoneInputWrapper, {
      duration: 0.3,
      width: 0,
      ease: "power2.in",
      onComplete: () => {
        phoneInputWrapper.classList.remove('active');
        phoneInput.disabled = true;
      }
    });
  }
}

// Додаємо стилі для валідації
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    #phone.is-valid {
      border-color: #6dcf9e !important;
      background-color: #e8f8f1 !important;
    }
    #phone.is-invalid {
      border-color: #dc3545 !important;
      background-color: #fbe9eb !important;
    }
  `;
  document.head.appendChild(style);

  setupCommentHandlers();

  // Функціонал перемикання доставка/самовивіз
  const deliveryBtn = document.getElementById('deliveryBtn');
  const pickupBtn = document.getElementById('pickupBtn');
  const deliveryBlocks = document.getElementById('deliveryBlocks');
  const pickupBlocks = document.getElementById('pickupBlocks');
  const orderDetailsTitle = document.querySelector('.card-custom h5');

  // Функція для анімованого приховування елемента
  function hideWithAnimation(element) {
    if (!element) return;
    element.classList.add('fade-block');
    setTimeout(() => {
      element.style.display = 'none';
    }, 300);
  }

  // Функція для анімованого показу елемента
  function showWithAnimation(element) {
    if (!element) return;
    element.style.display = 'block';
    // Невелика затримка для спрацювання анімації
    setTimeout(() => {
      element.classList.remove('fade-block');
    }, 50);
  }

  pickupBtn.addEventListener('click', () => {
    // Змінюємо стилі кнопок з анімацією
    gsap.to(pickupBtn, { scale: 1.05, duration: 0.3 });
    gsap.to(deliveryBtn, { scale: 1, duration: 0.3 });

    pickupBtn.classList.remove('btn-light');
    pickupBtn.classList.add('btn-dark');
    deliveryBtn.classList.remove('btn-dark');
    deliveryBtn.classList.add('btn-light');

    // Анімуємо зміну заголовка
    gsap.to(orderDetailsTitle, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      onComplete: () => {
        orderDetailsTitle.textContent = 'Деталі самовивозу';
        gsap.to(orderDetailsTitle, {
          opacity: 1,
          y: 0,
          duration: 0.15
        });
      }
    });

    // Анімуємо перехід між блоками
    gsap.to(deliveryBlocks, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        deliveryBlocks.style.display = 'none';
        pickupBlocks.style.display = 'block';
        gsap.fromTo(pickupBlocks, 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    });

    // Оновлюємо суму замовлення
    updateSummary();
  });

  deliveryBtn.addEventListener('click', () => {
    // Змінюємо стилі кнопок з анімацією
    gsap.to(deliveryBtn, { scale: 1.05, duration: 0.3 });
    gsap.to(pickupBtn, { scale: 1, duration: 0.3 });

    deliveryBtn.classList.remove('btn-light');
    deliveryBtn.classList.add('btn-dark');
    pickupBtn.classList.remove('btn-dark');
    pickupBtn.classList.add('btn-light');

    // Анімуємо зміну заголовка
    gsap.to(orderDetailsTitle, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      onComplete: () => {
        orderDetailsTitle.textContent = 'Деталі замовлення';
        gsap.to(orderDetailsTitle, {
          opacity: 1,
          y: 0,
          duration: 0.15
        });
      }
    });

    // Анімуємо перехід між блоками
    gsap.to(pickupBlocks, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        pickupBlocks.style.display = 'none';
        deliveryBlocks.style.display = 'block';
        gsap.fromTo(deliveryBlocks, 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    });

    // Оновлюємо суму замовлення
    updateSummary();
  });

  // Ініціалізуємо початковий стан
  deliveryBlocks.style.display = 'block';
  pickupBlocks.style.display = 'none';
  gsap.set(deliveryBlocks, { opacity: 1, y: 0 });

  // Валідація часу самовивозу
  const pickupTime = document.getElementById('pickupTime');
  if (pickupTime) {
    // Встановлюємо значення за замовчуванням на поточний час (якщо в межах робочого часу)
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if (hours >= 10 && hours < 22) {
      pickupTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      pickupTime.value = '10:00'; // Встановлюємо на початок робочого дня
    }

    pickupTime.addEventListener('change', function() {
      const time = this.value;
      const [hours, minutes] = time.split(':').map(Number);
      
      if (hours < 10 || (hours === 22 && minutes > 0) || hours > 22) {
        showSuccessMessage('Оберіть час між 10:00 та 22:00');
        this.value = hours < 10 ? '10:00' : '22:00';
      }
    });
  }

  // Логіка кнопки оплати
  const payButton = document.querySelector('.btn-success');
  if (payButton) {
    payButton.addEventListener('click', handlePayment);
  }
});

// Comment handling functions
function setupCommentHandlers() {
  const courierCommentBtn = document.getElementById('save-courier-comment');
  const generalCommentBtn = document.getElementById('save-general-comment');
  const courierComment = document.getElementById('courier-comment');
  const generalComment = document.getElementById('general-comment');

  courierCommentBtn.addEventListener('click', () => {
    if (courierComment.value.trim()) {
      // Save the courier comment (you can add API call here if needed)
      showSuccessMessage('Коментар для кур\'єра збережено');
      courierComment.value = '';
    }
  });

  generalCommentBtn.addEventListener('click', () => {
    if (generalComment.value.trim()) {
      // Save the general comment (you can add API call here if needed)
      showSuccessMessage('Коментар збережено');
      generalComment.value = '';
    }
  });
}

function showSuccessMessage(message) {
  // Create success message element
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  successDiv.style.zIndex = '1050';
  successDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Add to document
  document.body.appendChild(successDiv);

  // Remove after 3 seconds
  setTimeout(() => {
    successDiv.classList.remove('show');
    setTimeout(() => successDiv.remove(), 150);
  }, 3000);
}

function handlePayment() {
  // Перевіряємо, чи вибрана оплата карткою
  const cardPaymentSelected = document.getElementById('pay2').checked;
  
  if (cardPaymentSelected) {
    // Зберігаємо дані замовлення в localStorage
    const orderData = {
      items: cartService.cart,
      address: currentAddress,
      phone: document.getElementById('phone').value,
      comments: {
        courier: document.getElementById('courier-comment')?.value || '',
        general: document.getElementById('general-comment')?.value || ''
      }
    };
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    // Перенаправляємо на сторінку оплати
    window.location.href = 'payment.html';
    return;
  }

  // Для інших способів оплати - існуюча логіка
  const paymentBtn = document.querySelector('.payment-btn');
  if (paymentBtn.disabled) return;

  // Показуємо анімацію завантаження
  paymentBtn.disabled = true;
  paymentBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Обробка замовлення...
  `;

  // Імітуємо обробку замовлення
  setTimeout(() => {
    // Очищаємо кошик і скидаємо промокод
    cartService.handlePaymentComplete();
    
    // Показуємо повідомлення про успіх
    showSuccessMessage('Замовлення успішно оформлено!');
    
    // Перенаправляємо на головну сторінку
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }, 2000);
}

function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  errorDiv.style.zIndex = '1050';
  errorDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.classList.remove('show');
    setTimeout(() => errorDiv.remove(), 150);
  }, 3000);
}

function calculateTotal() {
  let total = 0;
  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.price * item.qty;
  });

  total = subtotal;
  
  if (discount > 0) {
    total -= discount;
  }

  const isDelivery = document.getElementById('deliveryBtn').classList.contains('btn-dark');
  if (isDelivery && subtotal < 500) {
    total += 60; // Вартість доставки
  }

  total += 20; // Сервісний збір

  return total;
}

function resetForm() {
  // Скидаємо адресу
  const addressText = document.querySelector('.address-text');
  if (addressText) {
    addressText.textContent = '';
  }

  // Скидаємо ресторан і час самовивозу
  document.getElementById('restaurantSelect').value = '';
  document.getElementById('pickupTime').value = '';

  // Скидаємо коментарі
  document.getElementById('courier-comment').value = '';
  document.getElementById('general-comment').value = '';

  // Скидаємо промокод
  document.getElementById('promo').value = '';
  discount = 0;

  // Оновлюємо відображення
  updateSummary();
}

renderOrder();