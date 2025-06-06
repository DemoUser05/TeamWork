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
  addWalletBtn: document.getElementById('addWalletBtn'),
  addWalletModal: document.getElementById('addWalletModal'),
  closeAddWalletModal: document.getElementById('closeAddWalletModal'),
  walletForm: document.getElementById('walletForm'),
  favoritesBtn: document.getElementById('favoritesBtn'),
  favoritesModal: document.getElementById('favoritesModal'),
  closeFavoritesModal: document.getElementById('closeFavoritesModal'),
  favoritesList: document.getElementById('favoritesList'),
  addFavoriteBtn: document.getElementById('addFavoriteBtn'),
  addFavoriteModal: document.getElementById('addFavoriteModal'),
  closeAddFavoriteModal: document.getElementById('closeAddFavoriteModal'),
  favoriteForm: document.getElementById('favoriteForm'),
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
function init() {
  createModals();
  setupEventListeners();
  checkAuthState();
}

// Create necessary modals
function createModals() {
  // Create add wallet modal if it doesn't exist
  if (!elements.addWalletModal) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'addWalletModal';
    modalDiv.className = 'modal';
    document.body.appendChild(modalDiv);
    elements.addWalletModal = modalDiv;
  }

  // Create wallets modal if it doesn't exist
  if (!elements.walletsModal) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'walletsModal';
    modalDiv.className = 'modal';
    document.body.appendChild(modalDiv);
    elements.walletsModal = modalDiv;
  }

  // Set up wallets modal content
  elements.walletsModal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" id="closeWalletsModal">&times;</span>
      <h2>Ваші гаманці</h2>
      <div class="modal-list" id="walletsList">
        <!-- Will be populated by JS -->
      </div>
      <button id="addWalletBtn" class="save-btn" style="width: 100%; margin-top: 10px;">
        <i class="fas fa-plus"></i> Додати гаманець
      </button>
    </div>
  `;

  // Set up add wallet modal content
  elements.addWalletModal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" id="closeAddWalletModal">&times;</span>
      <h2>Додати гаманець</h2>
      <form id="walletForm">
        <div class="form-group">
          <label for="walletName">Назва гаманця</label>
          <input type="text" id="walletName" required>
        </div>
        <div class="form-group">
          <label for="walletBalance">Початковий баланс</label>
          <input type="number" id="walletBalance" min="0" step="0.01" required>
        </div>
        <button type="submit" class="save-btn">Додати гаманець</button>
      </form>
    </div>
  `;

  // Update elements after creating modals
  elements.walletsList = document.getElementById('walletsList');
  elements.addWalletBtn = document.getElementById('addWalletBtn');
  elements.closeWalletsModal = document.getElementById('closeWalletsModal');
  elements.closeAddWalletModal = document.getElementById('closeAddWalletModal');
  elements.walletForm = document.getElementById('walletForm');
}

// Set up event listeners
function setupEventListeners() {
  // Navigation buttons
  elements.backBtn.addEventListener('click', () => window.history.back());
  elements.cartBtn.addEventListener('click', () => window.location.href = "images/cart.png");
  elements.profileBtn.addEventListener('click', () => {});

  // Profile editing
  elements.editProfileBtn.addEventListener('click', () => showModal(elements.editProfileModal));
  elements.closeEditModal.addEventListener('click', () => hideModal(elements.editProfileModal));
  elements.profileForm.addEventListener('submit', handleProfileUpdate);

  // Menu items
  elements.subscriptionsBtn.addEventListener('click', async () => {
    await loadSubscriptions();
    showModal(elements.subscriptionsModal);
  });
  
  elements.ordersBtn.addEventListener('click', async () => {
    await loadOrders();
    showModal(elements.ordersModal);
  });
  
  elements.walletsBtn.addEventListener('click', async () => {
    await loadWallets();
    showModal(elements.walletsModal);
  });
  
  elements.favoritesBtn.addEventListener('click', async () => {
    await loadFavorites();
    showModal(elements.favoritesModal);
  });
  
  elements.promoCodeBtn.addEventListener('click', () => {
    generatePromoCode();
    showModal(elements.promoCodeModal);
  });

  // Wallet management
  elements.addWalletBtn.addEventListener('click', () => showModal(elements.addWalletModal));
  elements.closeAddWalletModal.addEventListener('click', () => hideModal(elements.addWalletModal));
  elements.walletForm.addEventListener('submit', handleAddWallet);
  elements.closeWalletsModal.addEventListener('click', () => hideModal(elements.walletsModal));

  // Close buttons
  elements.closeSubscriptionsModal.addEventListener('click', () => hideModal(elements.subscriptionsModal));
  elements.closeOrdersModal.addEventListener('click', () => hideModal(elements.ordersModal));
  elements.closeFavoritesModal.addEventListener('click', () => hideModal(elements.favoritesModal));
  elements.closePromoModal.addEventListener('click', () => hideModal(elements.promoCodeModal));
  
  elements.copyPromoBtn.addEventListener('click', copyPromoCode);

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
      alert("Помилка завантаження даних користувача");
    }
  });
}

// Update user profile display
function updateUserProfile(user, userData) {
  const firstNameLetter = userData?.name?.[0] || user.displayName?.[0] || '?';
  
  elements.avatarLarge.textContent = firstNameLetter;
  elements.avatarSmall.textContent = firstNameLetter;
  
  elements.phoneValue.textContent = userData?.phone || 'Не вказано';
  elements.emailValue.textContent = userData?.email || user.email || 'Не вказано';
  elements.nameValue.textContent = userData?.name || user.displayName || 'Не вказано';
  
  document.getElementById('name').value = userData?.name || user.displayName || '';
  document.getElementById('email').value = userData?.email || user.email || '';
  document.getElementById('phone').value = userData?.phone || '';
}

// Handle profile update
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  if (!name || !email) {
    alert("Будь ласка, заповніть обов'язкові поля (Ім'я та Email)");
    return;
  }

  try {
    const user = auth.currentUser;
    
    await updateEmail(user, email);
    await updateProfile(user, { displayName: name });
    
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name: name,
      email: email,
      phone: phone,
      updatedAt: new Date()
    });
    
    updateUserProfile(user, { name, email, phone });
    hideModal(elements.editProfileModal);
    showToast("Профіль успішно оновлено!");
  } catch (error) {
    console.error("Profile update error:", error);
    alert(`Помилка оновлення профілю: ${error.message}`);
  }
}

// Load subscriptions from Firestore
async function loadSubscriptions() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const activeSubQuery = query(
      collection(db, "subscriptions"),
      where("userId", "==", user.uid),
      where("active", "==", true)
    );

    const activeSubSnapshot = await getDocs(activeSubQuery);
    let activeSub = null;

    if (!activeSubSnapshot.empty) {
      activeSub = {
        id: activeSubSnapshot.docs[0].id,
        ...activeSubSnapshot.docs[0].data()
      };

      // Convert Firestore Timestamp to Date
      if (activeSub.expiryDate && typeof activeSub.expiryDate.toDate === 'function') {
        activeSub.expiryDate = activeSub.expiryDate.toDate();
      }
    }

    window.activeSubscription = activeSub;
    renderSubscriptions(activeSub ? [activeSub] : []);
    updateSubscriptionBadge();
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    window.activeSubscription = null;
    renderSubscriptions([]);
    updateSubscriptionBadge();
  }
}

// Load orders from Firestore
async function loadOrders() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "orders"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderOrders(orders);
  } catch (error) {
    console.error("Error loading orders:", error);
    renderOrders([]);
  }
}

// Load wallets from Firestore
async function loadWallets() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "wallets"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    
    const wallets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderWallets(wallets);
  } catch (error) {
    console.error("Error loading wallets:", error);
    renderWallets([]);
  }
}

// Load favorites from Firestore
async function loadFavorites() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "favorites"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    
    const favorites = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderFavorites(favorites);
  } catch (error) {
    console.error("Error loading favorites:", error);
    renderFavorites([]);
  }
}

// Render functions
function renderSubscriptions(subscriptions) {
  const currentSubscription = subscriptions.find(sub => sub.active);
  
  elements.subscriptionsList.innerHTML = `
    ${currentSubscription ? `
      <div class="current-subscription-status">
        <div class="status-header">
          <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 24px;"></i>
          <h3>Ваша активна підписка</h3>
        </div>
        <div class="status-details">
          <p><strong>${SUBSCRIPTION_PLANS[currentSubscription.planId].name}</strong></p>
          <p>Активна до: ${new Date(currentSubscription.expiryDate).toLocaleDateString()}</p>
          <p>Вартість: ${currentSubscription.price} грн</p>
          <div class="benefits-list">
            ${SUBSCRIPTION_PLANS[currentSubscription.planId].benefits.map(benefit => 
              `<div class="benefit-item"><i class="fas fa-check"></i> ${benefit}</div>`
            ).join('')}
          </div>
        </div>
      </div>
    ` : ''}
    <div class="subscription-plans">
      ${Object.values(SUBSCRIPTION_PLANS).map(plan => `
        <div class="subscription-plan ${currentSubscription?.planId === plan.id ? 'active' : ''}">
          <h3>${plan.name}</h3>
          <div class="price">${plan.price} грн/міс</div>
          <div class="benefits">
            ${plan.benefits.map(benefit => `<div>${benefit}</div>`).join('')}
          </div>
          ${currentSubscription?.planId === plan.id ? `
            <div class="current-plan">
              <div class="status">Активна підписка</div>
              <div class="expiry">до ${new Date(currentSubscription.expiryDate).toLocaleDateString()}</div>
            </div>
          ` : `
            <button class="subscribe-btn" onclick="window.showSubscriptionModal('${plan.id}')"
              ${(currentSubscription?.planId === 'premium' && plan.id === 'basic') ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ${currentSubscription ? 
                (currentSubscription.planId === 'basic' && plan.id === 'premium' ? 'Покращити до Premium' : 'Оформити підписку') 
                : 'Оформити підписку'}
            </button>
          `}
        </div>
      `).join('')}
    </div>
  `;
}

function renderOrders(orders) {
  if (orders.length > 0) {
    elements.ordersList.innerHTML = orders.map(order => `
      <div class="modal-list-item order-item">
        <strong>Замовлення ${order.orderNumber || order.id || ''}</strong>
        <div class="order-date">${formatDate(order.createdAt)}</div>
        <div class="order-amount">${order.totalAmount || 0} грн</div>
        <div class="order-items">${getOrderItems(order.items)}</div>
        <button class="order-repeat-btn" style="margin-top:10px;background:#f0f0f0;border:none;padding:5px 10px;border-radius:5px;font-size:12px;">
          Повторити замовлення
        </button>
      </div>
    `).join('');
  } else {
    // Якщо замовлень немає, показуємо історію з localStorage
    const orderNames = JSON.parse(localStorage.getItem('profileOrderNames')) || [];
    if (orderNames.length > 0) {
      elements.ordersList.innerHTML = `
        <div class="modal-list-item order-item">
          <strong>Історія замовлень (збережено локально)</strong>
          <div class="order-items">${orderNames.map(name => `<div>${name}</div>`).join('')}</div>
        </div>
      `;
    } else {
      elements.ordersList.innerHTML = '<div class="no-data">У вас немає історії замовлень</div>';
    }
  }
}

function renderWallets(wallets) {
  elements.walletsList.innerHTML = wallets.length > 0
    ? wallets.map(wallet => `
        <div class="modal-list-item wallet-item" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="wallet-info">
            <div class="wallet-name">${wallet.name || 'Гаманець'}</div>
            <div class="wallet-balance">${wallet.balance || 0} грн</div>
          </div>
          <div class="wallet-actions" style="display: flex; gap: 10px;">
            <button class="top-up-btn" onclick="showTopUpModal('${wallet.id}', ${wallet.balance || 0})" 
              style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
              <i class="fas fa-plus"></i> Поповнити
            </button>
            <button class="delete-wallet" data-id="${wallet.id}" 
              style="background: none; border: none; color: #ff4444; cursor: pointer;">
              <i class="fas fa-trash"></i> Видалити
            </button>
          </div>
        </div>
      `).join('')
    : '<div class="no-data">У вас немає гаманців</div>';
  
  // Add event listeners for delete buttons
  document.querySelectorAll('.delete-wallet').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const walletId = e.currentTarget.getAttribute('data-id');
      await deleteWallet(walletId);
    });
  });
}

function renderFavorites(favorites) {
  elements.favoritesList.innerHTML = favorites.length > 0
    ? favorites.map(fav => `
        <div class="modal-list-item favorite-item" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="favorite-info">
            <strong>${fav.dishName || 'Улюблена страва'}</strong>
            <span>${fav.dishCategory ? `(${fav.dishCategory})` : ''}</span>
          </div>
          <button class="remove-favorite" data-id="${fav.id}" style="background: none; border: none; color: #ff4444; cursor: pointer;">
            <i class="fas fa-times"></i> Видалити
          </button>
        </div>
      `).join('')
    : '<div class="no-data">У вас немає улюблених страв</div>';
  
  // Додаємо обробники подій для кнопок видалення
  document.querySelectorAll('.remove-favorite').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const favoriteId = e.currentTarget.getAttribute('data-id');
      await deleteFavorite(favoriteId);
    });
  });
}

// Helper functions
function getOrderItems(items) {
  if (!items) return 'Немає інформації';
  if (Array.isArray(items)) {
    return items.map(item => item.name || 'Без назви').join(', ');
  }
  return items;
}

function formatDate(timestamp) {
  if (!timestamp) return 'Невідома дата';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error("Помилка форматування дати:", e);
    return 'Невідома дата';
  }
}

function generatePromoCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const digits = '0123456789';
  let code = 'NAZ';
  
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  for (let i = 0; i < 3; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  elements.promoCodeDisplay.textContent = code;
  return code;
}

function copyPromoCode() {
  navigator.clipboard.writeText(elements.promoCodeDisplay.textContent)
    .then(() => showToast("Код скопійовано!"))
    .catch(() => alert("Не вдалося скопіювати код"));
}

function showModal(modal) {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function hideAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
  document.body.style.overflow = 'auto';
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

// Logout function
window.logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Помилка при виході з акаунту");
  }
};

/**
 * Функція для обробки кліку на кнопку "Назад"
 * Якщо є історія переходів - повертає на попередню сторінку
 * Якщо історії немає - перенаправляє на головну сторінку
 */
function handleBackButton() {
  // Перевіряємо чи є сторінки в історії браузера
  if (window.history.length > 1) {
    // Повертаємось на попередню сторінку
    window.history.back();
  } else {
    // Якщо немає історії - йдемо на головну
    window.location.href = "index.html";
  }
}

// Додаємо обробник подій для кнопки "Назад" при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  // Знаходимо всі елементи з класом back-btn або з текстом "Назад"
  const backButtons = document.querySelectorAll('.back-btn, [class*="back-button"], a[href*="back"]');
  
  // Додаємо обробник кліку для кожної знайденої кнопки
  backButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault(); // Запобігаємо стандартній поведінці
      handleBackButton();
    });
  });
  
  // Додаткова обробка для мобільних пристроїв (апаратна кнопка "Назад")
  window.addEventListener('popstate', () => {
    handleBackButton();
  });
});

// Альтернативний варіант для стрілки "←" (якщо вона окремий елемент)
function setupBackArrow() {
  const backArrow = document.getElementById('backArrow');
  if (backArrow) {
    backArrow.addEventListener('click', handleBackButton);
  }
}

// Викликаємо функцію налаштування стрілки
setupBackArrow();

// Make subscription functions globally available
window.showSubscriptionModal = showSubscriptionModal;
window.selectDuration = selectDuration;
window.purchaseSubscription = purchaseSubscription;

// Update showSubscriptionModal function to use proper onclick handlers
async function showSubscriptionModal(planId) {
  // Check for active subscription first
  if (window.activeSubscription) {
    if (window.activeSubscription.planId === planId) {
      alert('У вас вже є активна підписка цього типу');
      return;
    } else if (window.activeSubscription.planId === 'premium' && planId === 'basic') {
      alert('Ви не можете перейти з преміум на базову підписку. Дочекайтесь закінчення поточної підписки.');
      return;
    }
  }

  const plan = SUBSCRIPTION_PLANS[planId];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'subscriptionDetailsModal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="document.getElementById('subscriptionDetailsModal').remove()">&times;</span>
      <h2>Оформлення ${plan.name}</h2>
      ${window.activeSubscription ? `
        <div class="upgrade-notice" style="background: #fff3cd; color: #856404; padding: 10px; border-radius: 8px; margin-bottom: 20px;">
          <i class="fas fa-info-circle"></i>
          Ви переходите з ${SUBSCRIPTION_PLANS[window.activeSubscription.planId].name} на ${plan.name}.
          Невикористані дні поточної підписки будуть враховані при розрахунку вартості.
        </div>
      ` : ''}
      <div class="subscription-details">
        <h3>Виберіть тривалість підписки:</h3>
        <div class="duration-options">
          ${SUBSCRIPTION_DURATIONS.map(duration => `
            <div class="duration-option" onclick="window.selectDuration(this, ${duration.months}, ${plan.price * duration.multiplier})">
              <div class="duration-name">${duration.name}</div>
              <div class="duration-price">${Math.round(plan.price * duration.multiplier)} грн</div>
              ${duration.months > 1 ? `<div class="savings">Економія ${Math.round(100 - (100 * duration.multiplier / duration.months))}%</div>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="total-section">
          <div class="total-label">До сплати:</div>
          <div class="total-amount" id="subscriptionTotal">0 грн</div>
        </div>
        <button class="save-btn" onclick="window.purchaseSubscription('${planId}')">
          ${window.activeSubscription ? 'Змінити підписку' : 'Оформити підписку'}
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';
}

// Handle duration selection
function selectDuration(element, months, price) {
  document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('subscriptionTotal').textContent = `${price} грн`;
  window.selectedDuration = months;
  window.selectedPrice = price;
}

// Purchase subscription
async function purchaseSubscription(planId) {
  if (!window.selectedDuration || !window.selectedPrice) {
    alert('Будь ласка, виберіть тривалість підписки');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) return;

    // Check for active subscription
    const activeSubQuery = query(
      collection(db, "subscriptions"),
      where("userId", "==", user.uid),
      where("active", "==", true)
    );
    const activeSubSnapshot = await getDocs(activeSubQuery);

    if (!activeSubSnapshot.empty) {
      const currentSub = activeSubSnapshot.docs[0].data();
      if (currentSub.planId === planId) {
        alert('У вас вже є активна підписка цього типу');
        return;
      }
    }

    // Get user's wallet
    const walletsSnapshot = await getDocs(
      query(collection(db, "wallets"), 
            where("userEmail", "==", user.email))
    );

    if (walletsSnapshot.empty) {
      alert('У вас немає гаманця. Спочатку створіть гаманець.');
      hideModal(document.getElementById('subscriptionDetailsModal'));
      showModal(elements.walletsModal);
      return;
    }

    // Get wallet with highest balance
    let bestWallet = null;
    let bestWalletRef = null;
    walletsSnapshot.forEach(doc => {
      const wallet = doc.data();
      if (!bestWallet || wallet.balance > bestWallet.balance) {
        bestWallet = wallet;
        bestWalletRef = doc.ref;
      }
    });

    if (!bestWallet || bestWallet.balance < window.selectedPrice) {
      alert(`Недостатньо коштів на балансі. Необхідно: ${window.selectedPrice} грн`);
      return;
    }

    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now.setMonth(now.getMonth() + window.selectedDuration));

    // Create subscription
    const subscriptionData = {
      userEmail: user.email,
      userId: user.uid,
      planId: planId,
      planName: SUBSCRIPTION_PLANS[planId].name,
      startDate: new Date(),
      expiryDate: expiryDate,
      price: window.selectedPrice,
      duration: window.selectedDuration,
      active: true,
      benefits: SUBSCRIPTION_PLANS[planId].benefits
    };

    // Deactivate current subscription if exists
    if (!activeSubSnapshot.empty) {
      await updateDoc(activeSubSnapshot.docs[0].ref, { active: false });
    }

    // Update wallet balance
    await updateDoc(bestWalletRef, {
      balance: bestWallet.balance - window.selectedPrice
    });

    // Save new subscription
    const newSubRef = await addDoc(collection(db, "subscriptions"), subscriptionData);
    
    // Update local state
    window.activeSubscription = {
      id: newSubRef.id,
      ...subscriptionData
    };

    // Close modal and update UI
    document.getElementById('subscriptionDetailsModal').remove();
    await loadSubscriptions();
    await loadWallets();
    
    showToast('Підписку успішно оформлено!');
  } catch (error) {
    console.error("Error purchasing subscription:", error);
    alert('Помилка при оформленні підписки: ' + error.message);
  }
}

// Update subscription badge
function updateSubscriptionBadge() {
  const subscriptionBtn = document.getElementById('subscriptionsBtn');
  if (!subscriptionBtn) return;

  if (window.activeSubscription) {
    const plan = SUBSCRIPTION_PLANS[window.activeSubscription.planId];
    if (!plan) return;

    subscriptionBtn.innerHTML = `
      <i class="fas fa-crown menu-icon" style="color: #FFD700;"></i>
      <span>
        ${plan.name}
        <div style="font-size: 12px; color: #4CAF50;">Активна до ${new Date(window.activeSubscription.expiryDate).toLocaleDateString()}</div>
      </span>
      <i class="fas fa-chevron-right"></i>
    `;
  } else {
    subscriptionBtn.innerHTML = `
      <i class="fas fa-crown menu-icon"></i>
      <span>Підписки</span>
      <i class="fas fa-chevron-right"></i>
    `;
  }
}

// Add CSS styles for subscription status
const style = document.createElement('style');
style.textContent = `
  .current-subscription-status {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    border: 2px solid #4CAF50;
  }

  .status-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  .status-header h3 {
    margin: 0;
    color: #4CAF50;
  }

  .status-details {
    color: #666;
  }

  .status-details p {
    margin: 5px 0;
  }

  .status-details strong {
    color: #333;
  }
`;
document.head.appendChild(style);

// Add styles for benefits list
const benefitsStyle = document.createElement('style');
benefitsStyle.textContent = `
  .benefits-list {
    margin-top: 15px;
  }
  
  .benefit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
    color: #666;
  }
  
  .benefit-item i {
    color: #4CAF50;
  }
  
  .upgrade-notice {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .upgrade-notice i {
    font-size: 20px;
  }
`;
document.head.appendChild(benefitsStyle);

// Handle adding a new wallet
async function handleAddWallet(e) {
  e.preventDefault();
  
  const name = document.getElementById('walletName').value.trim();
  const balance = parseFloat(document.getElementById('walletBalance').value) || 0;
  
  if (!name) {
    alert("Будь ласка, введіть назву гаманця");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) return;
    
    const walletData = {
      name,
      balance,
      userEmail: user.email,
      userId: user.uid,
      createdAt: new Date()
    };
    
    // Add to Firestore
    await addDoc(collection(db, "wallets"), walletData);
    
    // Reload wallets
    await loadWallets();
    hideModal(elements.addWalletModal);
    showToast("Гаманець успішно додано!");
    elements.walletForm.reset();
  } catch (error) {
    console.error("Error adding wallet:", error);
    alert(`Помилка додавання гаманця: ${error.message}`);
  }
}

// Delete wallet function
async function deleteWallet(walletId) {
  if (!confirm("Ви впевнені, що хочете видалити цей гаманець?")) return;
  
  try {
    await deleteDoc(doc(db, "wallets", walletId));
    await loadWallets();
    showToast("Гаманець видалено!");
  } catch (error) {
    console.error("Error deleting wallet:", error);
    alert("Помилка видалення гаманця");
  }
}

// Add wallet top-up functions
async function handleTopUpWallet(walletId, amount) {
  if (!amount || amount <= 0) {
    alert('Будь ласка, введіть коректну суму');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) return;

    const walletRef = doc(db, "wallets", walletId);
    const walletSnap = await getDoc(walletRef);
    
    if (!walletSnap.exists()) {
      alert('Гаманець не знайдено');
      return;
    }

    const currentBalance = walletSnap.data().balance || 0;
    await updateDoc(walletRef, {
      balance: currentBalance + amount,
      lastTopUp: new Date(),
      lastTopUpAmount: amount
    });

    await loadWallets();
    document.getElementById('topUpWalletModal').remove();
    showToast(`Баланс поповнено на ${amount} грн`);
  } catch (error) {
    console.error("Error topping up wallet:", error);
    alert('Помилка при поповненні балансу');
  }
}

function showTopUpModal(walletId, currentBalance) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'topUpWalletModal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="document.getElementById('topUpWalletModal').remove()">&times;</span>
      <h2>Поповнення гаманця</h2>
      <div class="current-balance">
        <p>Поточний баланс: <strong>${currentBalance} грн</strong></p>
      </div>
      <div class="top-up-options">
        <h3>Оберіть суму поповнення:</h3>
        <div class="amount-options">
          <button onclick="selectAmount(100)">100 грн</button>
          <button onclick="selectAmount(200)">200 грн</button>
          <button onclick="selectAmount(500)">500 грн</button>
          <button onclick="selectAmount(1000)">1000 грн</button>
        </div>
        <div class="custom-amount">
          <label for="customAmount">Інша сума:</label>
          <input type="number" id="customAmount" min="1" step="1" placeholder="Введіть суму">
        </div>
      </div>
      <button class="save-btn" onclick="handleTopUpWallet('${walletId}', Number(document.getElementById('customAmount').value))">
        Поповнити
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Add styles for top up modal
  const style = document.createElement('style');
  style.textContent = `
    .current-balance {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
    
    .amount-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin: 15px 0;
    }
    
    .amount-options button {
      padding: 12px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .amount-options button:hover {
      border-color: #2196F3;
    }
    
    .amount-options button.selected {
      background: #2196F3;
      color: white;
      border-color: #2196F3;
    }
    
    .custom-amount {
      margin: 15px 0;
    }
    
    .custom-amount input {
      width: 100%;
      padding: 10px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      margin-top: 5px;
    }
    
    .custom-amount input:focus {
      border-color: #2196F3;
      outline: none;
    }
  `;
  document.head.appendChild(style);
}

function selectAmount(amount) {
  const customAmount = document.getElementById('customAmount');
  if (customAmount) {
    customAmount.value = amount;
  }
  
  // Update button styles
  const buttons = document.querySelectorAll('.amount-options button');
  buttons.forEach(btn => {
    if (Number(btn.textContent.replace(/[^0-9]/g, '')) === amount) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

// Make functions globally available
window.showTopUpModal = showTopUpModal;
window.handleTopUpWallet = handleTopUpWallet;
window.selectAmount = selectAmount;

// Initialize the app
document.addEventListener('DOMContentLoaded', init);