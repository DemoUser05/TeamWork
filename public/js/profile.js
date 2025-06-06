import {
  onAuthStateChanged,
  signOut,
  updateEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// DOM Elements
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

// Subscription plans
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

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuthState();
  initializeSubscriptions();
});

// Set up event listeners
function setupEventListeners() {
  // Profile editing
  elements.editProfileBtn?.addEventListener('click', () => showModal(elements.editProfileModal));
  elements.closeEditModal?.addEventListener('click', () => hideModal(elements.editProfileModal));
  elements.profileForm?.addEventListener('submit', handleProfileUpdate);

  // Menu items
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

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      hideAllModals();
    }
  });
}

// Check authentication state
function checkAuthState() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
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

// Update user profile information
function updateUserProfile(user, userData) {
  // Update avatar - використовуємо ім'я з userData, якщо воно є, інакше використовуємо displayName з user
  const name = userData.name || user.displayName || '';
  const firstLetter = name ? name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
  
  if (elements.avatarLarge) elements.avatarLarge.textContent = firstLetter;
  if (elements.avatarSmall) elements.avatarSmall.textContent = firstLetter;

  // Update profile information
  if (elements.phoneValue) elements.phoneValue.textContent = userData.phone || 'Не вказано';
  if (elements.emailValue) elements.emailValue.textContent = userData.email || user.email || 'Не вказано';
  if (elements.nameValue) elements.nameValue.textContent = userData.name || user.displayName || 'Не вказано';

  // Update form values
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  if (nameInput) nameInput.value = userData.name || user.displayName || '';
  if (emailInput) emailInput.value = userData.email || user.email || '';
  if (phoneInput) phoneInput.value = userData.phone || '';
}

// Handle profile update
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

// Generate promo code
function generatePromoCode() {
  const code = 'DRIBKA' + Math.random().toString(36).substring(2, 8).toUpperCase();
  if (elements.promoCodeDisplay) {
    elements.promoCodeDisplay.textContent = code;
  }
}

// Copy promo code
function copyPromoCode() {
  const code = elements.promoCodeDisplay.textContent;
  navigator.clipboard.writeText(code)
    .then(() => showToast("Код скопійовано"))
    .catch(() => showToast("Помилка копіювання"));
}

// Modal functions
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

// Initialize subscriptions
function initializeSubscriptions() {
  if (!elements.subscriptionsList) return;
  
  // Clear existing content
  elements.subscriptionsList.innerHTML = '';
  
  // Create subscription plans container
  const plansContainer = document.createElement('div');
  plansContainer.className = 'subscription-plans';
  
  // Add subscription plans
  Object.values(SUBSCRIPTION_PLANS).forEach(plan => {
    const planElement = createSubscriptionPlanElement(plan);
    plansContainer.appendChild(planElement);
  });
  
  elements.subscriptionsList.appendChild(plansContainer);
}

// Create subscription plan element
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
  
  // Add click handler for subscribe button
  const subscribeBtn = planDiv.querySelector('.subscribe-btn');
  subscribeBtn.addEventListener('click', () => showDurationOptions(plan));
  
  return planDiv;
}

// Show subscription duration options
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
  
  // Add click handlers for duration options
  const durationOptions = modalContent.querySelectorAll('.duration-option');
  const confirmBtn = modalContent.querySelector('#confirmSubscription');
  const totalAmount = modalContent.querySelector('.total-amount');
  
  durationOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      durationOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Update total amount
      const months = parseInt(option.dataset.months);
      const duration = SUBSCRIPTION_DURATIONS.find(d => d.months === months);
      const total = Math.round(plan.price * duration.multiplier);
      totalAmount.textContent = `${total} грн`;
      
      // Enable confirm button
      confirmBtn.disabled = false;
    });
  });
  
  // Add click handler for confirm button
  confirmBtn.addEventListener('click', async () => {
    const selectedOption = modalContent.querySelector('.duration-option.selected');
    if (!selectedOption) return;
    
    const months = parseInt(selectedOption.dataset.months);
    const duration = SUBSCRIPTION_DURATIONS.find(d => d.months === months);
    const total = Math.round(plan.price * duration.multiplier);
    
    try {
      // Get current user
      const user = auth.currentUser;
      if (!user) throw new Error('Користувач не авторизований');
      
      // Add subscription to user's subscriptions
      const subscriptionData = {
        planId: plan.id,
        planName: plan.name,
        startDate: new Date(),
        endDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
        price: total,
        status: 'active'
      };
      
      await setDoc(doc(db, "users", user.uid, "subscriptions", plan.id), subscriptionData);
      
      // Show success message
      showToast('Підписку успішно оформлено!');
      
      // Close modal
      hideModal(elements.subscriptionsModal);
      
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      showToast('Помилка при оформленні підписки. Спробуйте ще раз.');
    }
  });
}

// Show subscription plans
function showSubscriptionPlans() {
  if (!elements.subscriptionsModal) return;
  initializeSubscriptions();
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Hide and remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Logout function
window.logout = async function() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error);
    showToast("Помилка виходу з системи");
  }
};