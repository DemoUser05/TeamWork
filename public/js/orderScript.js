const items = [
  { name: "Лента ребер", price: 190, img: "images/rebra.png", qty: 1 },
  { name: "Prosciutto Cotto", price: 389, img: "images/cotto.png", qty: 1 },
  { name: "Filet mignon", price: 391, img: "images/filet.png", qty: 1 }
];

let discount = 0;

function renderOrder() {
  const container = document.getElementById("order-items");
  container.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "d-flex align-items-center mb-3";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="me-2">
      <div class="flex-grow-1">
        <strong>${item.name}</strong><br>
        ${item.price} грн
      </div>
      <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${index}, -1)">-</button>
      <span>${item.qty}</span>
      <button class="btn btn-sm btn-outline-secondary ms-1" onclick="changeQty(${index}, 1)">+</button>
    `;
    container.appendChild(div);
  });

  updateSummary();
}

function changeQty(index, delta) {
  items[index].qty = Math.max(0, items[index].qty + delta);
  renderOrder();
}

function updateSummary() {
  const list = document.getElementById("summary");
  list.innerHTML = "";

  let total = 0;
  let subtotal = 0;

  items.forEach(item => {
    if (item.qty > 0) {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.textContent = `${item.name} x ${item.qty}`;
      const span = document.createElement("span");
      span.textContent = `${item.price * item.qty} грн`;
      li.appendChild(span);
      list.appendChild(li);
      subtotal += item.price * item.qty;
    }
  });

  total = subtotal;

  // Знижка
  if (discount > 0) {
    const disc = document.createElement("li");
    disc.className = "list-group-item d-flex justify-content-between";
    disc.innerHTML = `<strong>Знижка</strong> <span style="color: #b89eff;">-${discount} грн</span>`;
    list.appendChild(disc);
    total -= discount;
  }

  // Робота кур'єра
  const deliveryFee = subtotal >= 500 ? 0 : 60;
  const delivery = document.createElement("li");
  delivery.className = "list-group-item d-flex justify-content-between";
  delivery.innerHTML = deliveryFee === 0
    ? `<span>Робота кур'єра</span> <span style="color: #5e5b8c;"><s>60 грн</s> Безкоштовно</span>`
    : `<span>Робота кур'єра</span> <span>${deliveryFee} грн</span>`;
  list.appendChild(delivery);
  total += deliveryFee;

  // Сервісний збір
  const serviceFee = 20;
  const service = document.createElement("li");
  service.className = "list-group-item d-flex justify-content-between";
  service.innerHTML = `<span>Сервісний збір</span> <span>${serviceFee} грн</span>`;
  list.appendChild(service);
  total += serviceFee;

  // Разом
  const totalItem = document.createElement("li");
  totalItem.className = "list-group-item d-flex justify-content-between fw-bold";
  totalItem.innerHTML = `Разом <span>${total} грн</span>`;
  list.appendChild(totalItem);
}


function applyPromo() {
  const code = document.getElementById("promo").value.trim().toLowerCase();
  if (code === "daily dose") {
    discount = 50;
    gsap.to("#promo", { backgroundColor: "#c2f0c2", duration: 0.5 });
  } else {
    discount = 0;
    gsap.to("#promo", { backgroundColor: "#f5c2c2", duration: 0.5 });
  }
  updateSummary();
}

function toggleEdit(id) {
  const input = document.getElementById(id);
  input.disabled = !input.disabled;
  if (!input.disabled) input.focus();
}

// >>> Модальне вікно для адреси <<<
function openAddressModal() {
  const modalElement = document.getElementById('addressModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

document.addEventListener('DOMContentLoaded', () => {
  // Збереження адреси з модального вікна
  const saveAddressBtn = document.getElementById('saveAddressBtn');
  const addressDisplay = document.getElementById('address');
  const addressModal = new bootstrap.Modal(document.getElementById('addressModal'));

  saveAddressBtn.addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    const street = document.getElementById('street').value.trim();
    const floor = document.getElementById('floor').value.trim();
    const apartment = document.getElementById('apartment').value.trim();
    const entrance = document.getElementById('entrance').value.trim();

    const parts = [city, street, floor, apartment, entrance].filter(Boolean);
    addressDisplay.value = parts.length ? parts.join(', ') : 'Не вказано';

    addressModal.hide();
  });

  // Анімація для телефону
  const editPhoneBtns = document.querySelectorAll('button[onclick*="togglePhoneEdit"]');
  const phoneInputWrapper = document.getElementById('phoneInputWrapper');
  const phoneInput = document.getElementById('phone');
  
  let phoneVisible = false;
  
  editPhoneBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!phoneVisible) {
        phoneInput.disabled = false;
        phoneInputWrapper.classList.add('active');
        gsap.fromTo(phoneInputWrapper, { width: 0 }, { duration: 0.5, width: 180, ease: "power2.out" });
        phoneInput.focus();
      } else {
        gsap.to(phoneInputWrapper, {
          duration: 0.3,
          width: 0,
          ease: "power2.in",
          onComplete: () => {
            phoneInputWrapper.classList.remove('active');
            phoneInput.disabled = true;
            phoneInput.value = '';
          }
        });
      }
      phoneVisible = !phoneVisible;
    });
  });  
});


renderOrder();