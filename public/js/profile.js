import {
  onAuthStateChanged,
  signOut,
  updateEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc, setDoc, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

const elements = {
  backBtn: document.getElementById('backBtn'),
  cartBtn: document.getElementById('cartBtn'),
  notificationsBtn: document.getElementById('notificationsBtn'),
  profileBtn: document.getElementById('profileBtn'),
  editProfileBtn: document.getElementById('editProfileBtn'),
  editProfileModal: document.getElementById('editProfileModal'),
  closeEditModal: document.getElementById('closeEditModal'),
  profileForm: document.getElementById('profileForm'),
  subscriptionsBtn: document.getElementById('subscriptionsBtn'),
  subscriptionsModal: document.getElementById('subscriptionsModal'),
  closeSubscriptionsModal: document.getElementById('closeSubscriptionsModal'),
  subscriptionsList: document.getElementById('subscriptionsList'),
  ordersBtn: document.getElementById('ordersBtn'),
  ordersModal: document.getElementById('ordersModal'),
  closeOrdersModal: document.getElementById('closeOrdersModal'),
  ordersList: document.getElementById('ordersList'),
  walletsBtn: document.getElementById('walletsBtn'),
  walletsModal: document.getElementById('walletsModal'),
  closeWalletsModal: document.getElementById('closeWalletsModal'),
  walletsList: document.getElementById('walletsList'),
  favoritesBtn: document.getElementById('favoritesBtn'),
  favoritesModal: document.getElementById('favoritesModal'),
  closeFavoritesModal: document.getElementById('closeFavoritesModal'),
  favoritesList: document.getElementById('favoritesList'),
  promoCodeBtn: document.getElementById('promoCodeBtn'),
  promoCodeModal: document.getElementById('promoCodeModal'),
  closePromoModal: document.getElementById('closePromoModal'),
  copyPromoBtn: document.getElementById('copyPromoBtn'),
  promoCodeDisplay: document.getElementById('promoCodeDisplay'),
  avatarLarge: document.querySelector('.avatar-large'),
  avatarSmall: document.querySelector('.avatar-small'),
  phoneValue: document.getElementById('phoneValue'),
  emailValue: document.getElementById('emailValue'),
  nameValue: document.getElementById('nameValue')
};

const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Базова підписка',
    price: 100,
    description: 'Базовий план з основними перевагами',
    benefits: [
      '✓ Безкоштовна доставка',
      '✓ Знижка 5% на всі доставки',
      '✓ Доступ до спеціальних акцій'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Розширена підписка',
    price: 250,
    description: 'Преміум план з додатковими перевагами',
    benefits: [
      '✓ Безкоштовна доставка',
      '✓ Знижка 10% на всі доставки',
      '✓ Пріоритетна доставка',
      '✓ Ексклюзивні страви'
    ]
  }
};

const SUBSCRIPTION_DURATIONS = [
  { months: 1, name: '1 місяць', multiplier: 1 },
  { months: 3, name: '3 місяці', multiplier: 2.8 },
  { months: 6, name: '6 місяців', multiplier: 5.5 },
  { months: 12, name: '12 місяців', multiplier: 10 }
];

document.addEventListener('DOMContentLoaded', async function() {
  // Перевіряємо чи потрібно відкрити модальне вікно промокоду
  if (localStorage.getItem('openPromoModal') === 'true' || window.location.hash === '#promo') {
    // Відкриваємо модальне вікно промокоду
    const promoCodeModal = document.getElementById('promoCodeModal');
    if (promoCodeModal) {
      promoCodeModal.style.display = 'block';
      // Очищаємо флаг
      localStorage.removeItem('openPromoModal');
    }
  }

  // Ініціалізація кнопок модальних вікон
  const promoCodeBtn = document.getElementById('promoCodeBtn');
  const promoCodeModal = document.getElementById('promoCodeModal');
  const closePromoModal = document.getElementById('closePromoModal');

  if (promoCodeBtn && promoCodeModal) {
    promoCodeBtn.addEventListener('click', () => {
      promoCodeModal.style.display = 'block';
    });
  }

  if (closePromoModal && promoCodeModal) {
    closePromoModal.addEventListener('click', () => {
      promoCodeModal.style.display = 'none';
    });
  }

  // Закриття модального вікна при кліку поза ним
  window.addEventListener('click', (event) => {
    if (event.target === promoCodeModal) {
      promoCodeModal.style.display = 'none';
    }
  });

  // Копіювання промокоду
  const copyPromoBtn = document.getElementById('copyPromoBtn');
  const promoCodeDisplay = document.getElementById('promoCodeDisplay');

  if (copyPromoBtn && promoCodeDisplay) {
    // Встановлюємо промокод
    promoCodeDisplay.textContent = 'FIRST10';

    copyPromoBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(promoCodeDisplay.textContent)
        .then(() => {
          copyPromoBtn.innerHTML = '<i class="fas fa-check"></i> Скопійовано';
          setTimeout(() => {
            copyPromoBtn.innerHTML = '<i class="fas fa-copy"></i> Скопіювати код';
          }, 2000);
        })
        .catch(err => {
          console.error('Помилка при копіюванні:', err);
        });
    });
  }

  setupEventListeners();
  checkAuthState();
  initializeSubscriptions();
});

function setupEventListeners() {
  elements.editProfileBtn?.addEventListener('click', () => showModal(elements.editProfileModal));
  elements.closeEditModal?.addEventListener('click', () => hideModal(elements.editProfileModal));
  elements.profileForm?.addEventListener('submit', handleProfileUpdate);

  elements.subscriptionsBtn?.addEventListener('click', () => {
    showSubscriptionPlans();
    showModal(elements.subscriptionsModal);
  });
  elements.closeSubscriptionsModal?.addEventListener('click', () => hideModal(elements.subscriptionsModal));
  
  elements.promoCodeBtn?.addEventListener('click', () => {
    generatePromoCode();
    showModal(elements.promoCodeModal);
  });
  elements.closePromoModal?.addEventListener('click', () => hideModal(elements.promoCodeModal));
  elements.copyPromoBtn?.addEventListener('click', copyPromoCode);
  
  elements.ordersBtn?.addEventListener('click', () => showModal(elements.ordersModal));
  elements.closeOrdersModal?.addEventListener('click', () => hideModal(elements.ordersModal));
  
  elements.favoritesBtn?.addEventListener('click', () => showModal(elements.favoritesModal));
  elements.closeFavoritesModal?.addEventListener('click', () => hideModal(elements.favoritesModal));

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      hideAllModals();
    }
  });
}

function checkAuthState() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        updateUserProfile(user, userData);
      } else {
        updateUserProfile(user, {});
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      showToast("Помилка завантаження даних користувача");
    }
  });
}

function updateUserProfile(user, userData) {
  const name = userData.name || user.displayName || '';
  const firstLetter = name ? name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
  
  if (elements.avatarLarge) elements.avatarLarge.textContent = firstLetter;
  if (elements.avatarSmall) elements.avatarSmall.textContent = firstLetter;

  if (elements.phoneValue) elements.phoneValue.textContent = userData.phone || 'Не вказано';
  if (elements.emailValue) elements.emailValue.textContent = userData.email || user.email || 'Не вказано';
  if (elements.nameValue) elements.nameValue.textContent = userData.name || user.displayName || 'Не вказано';

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  if (nameInput) nameInput.value = userData.name || user.displayName || '';
  if (emailInput) emailInput.value = userData.email || user.email || '';
  if (phoneInput) phoneInput.value = userData.phone || '';
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) return;

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name,
      email,
      phone,
      updatedAt: new Date()
    });

    if (email !== user.email) {
      await updateEmail(user, email);
    }

    await updateProfile(user, {
      displayName: name
    });

    updateUserProfile(user, { name, email, phone });
    hideModal(elements.editProfileModal);
    showToast("Профіль успішно оновлено");
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast("Помилка оновлення профілю");
  }
}

function generatePromoCode() {
  const code = 'DRIBKAFWXYZM';
  if (elements.promoCodeDisplay) {
    elements.promoCodeDisplay.textContent = code;
  }
}

function copyPromoCode() {
  const code = elements.promoCodeDisplay.textContent;
  navigator.clipboard.writeText(code)
    .then(() => showToast("Код скопійовано"))
    .catch(() => showToast("Помилка копіювання"));
}

function showModal(modal) {
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function hideAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
  document.body.style.overflow = 'auto';
}

function initializeSubscriptions() {
  if (!elements.subscriptionsList) return;
  
  elements.subscriptionsList.innerHTML = '';
  
  const plansContainer = document.createElement('div');
  plansContainer.className = 'subscription-plans';
  
  Object.values(SUBSCRIPTION_PLANS).forEach(plan => {
    const planElement = createSubscriptionPlanElement(plan);
    plansContainer.appendChild(planElement);
  });
  
  elements.subscriptionsList.appendChild(plansContainer);
}

function createSubscriptionPlanElement(plan) {
  const planDiv = document.createElement('div');
  planDiv.className = 'subscription-plan';
  planDiv.innerHTML = `
    <h3>${plan.name}</h3>
    <div class="price">${plan.price} грн/міс</div>
    <div class="benefits">
      ${plan.benefits.map(benefit => `<div>${benefit}</div>`).join('')}
    </div>
    <button class="subscribe-btn" data-plan="${plan.id}">Обрати план</button>
  `;
  
  const subscribeBtn = planDiv.querySelector('.subscribe-btn');
  subscribeBtn.addEventListener('click', () => showDurationOptions(plan));
  
  return planDiv;
}

function showDurationOptions(plan) {
  const modalContent = elements.subscriptionsModal.querySelector('.modal-content');
  modalContent.innerHTML = `
    <h2>Оберіть тривалість підписки</h2>
    <p class="modal-description">План: ${plan.name}</p>
    <div class="subscription-details">
      <div class="duration-options">
        ${SUBSCRIPTION_DURATIONS.map(duration => `
          <div class="duration-option" data-months="${duration.months}">
            <div class="duration-name">${duration.name}</div>
            <div class="duration-price">${Math.round(plan.price * duration.multiplier)} грн</div>
            ${duration.months > 1 ? `
              <div class="savings">
                Економія ${Math.round(100 - (duration.multiplier * 100 / duration.months))}%
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
      <div class="total-section">
        <span class="total-label">Всього до сплати:</span>
        <span class="total-amount">0 грн</span>
      </div>
      <button class="save-btn" id="confirmSubscription" disabled>
        Підтвердити підписку
      </button>
    </div>
    <button class="back-btn" onclick="showSubscriptionPlans()">← Назад до планів</button>
  `;
  
  const durationOptions = modalContent.querySelectorAll('.duration-option');
  const confirmBtn = modalContent.querySelector('#confirmSubscription');
  const totalAmount = modalContent.querySelector('.total-amount');
  
  durationOptions.forEach(option => {
    option.addEventListener('click', () => {
      durationOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      const months = parseInt(option.dataset.months);
      const duration = SUBSCRIPTION_DURATIONS.find(d => d.months === months);
      const total = Math.round(plan.price * duration.multiplier);
      totalAmount.textContent = `${total} грн`;
      
      confirmBtn.disabled = false;
    });
  });
  
  confirmBtn.addEventListener('click', async () => {
    const selectedOption = modalContent.querySelector('.duration-option.selected');
    if (!selectedOption) return;
    
    const months = parseInt(selectedOption.dataset.months);
    const duration = SUBSCRIPTION_DURATIONS.find(d => d.months === months);
    const total = Math.round(plan.price * duration.multiplier);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Користувач не авторизований');
      
      const subscriptionData = {
        planId: plan.id,
        planName: plan.name,
        startDate: new Date(),
        endDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
        price: total,
        status: 'active'
      };
      
      await setDoc(doc(db, "users", user.uid, "subscriptions", plan.id), subscriptionData);
      
      showToast('Підписку успішно оформлено!');
      
      hideModal(elements.subscriptionsModal);
      
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      showToast('Помилка при оформленні підписки. Спробуйте ще раз.');
    }
  });
}

function showSubscriptionPlans() {
  if (!elements.subscriptionsModal) return;
  initializeSubscriptions();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error signing out:", error);
    showToast("Помилка виходу з системи");
  }
};