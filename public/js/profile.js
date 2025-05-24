import {
  onAuthStateChanged,
  signOut,
  updateEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc
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

// Initialize the page
function init() {
  setupEventListeners();
  checkAuthState();
}

// Set up all event listeners
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

  // Favorites management
  elements.addFavoriteBtn.addEventListener('click', () => showModal(elements.addFavoriteModal));
  elements.closeAddFavoriteModal.addEventListener('click', () => hideModal(elements.addFavoriteModal));
  elements.favoriteForm.addEventListener('submit', handleAddFavorite);

  // Close buttons
  elements.closeSubscriptionsModal.addEventListener('click', () => hideModal(elements.subscriptionsModal));
  elements.closeOrdersModal.addEventListener('click', () => hideModal(elements.ordersModal));
  elements.closeWalletsModal.addEventListener('click', () => hideModal(elements.walletsModal));
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

    const q = query(collection(db, "subscriptions"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    
    const subscriptions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderSubscriptions(subscriptions);
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    renderSubscriptions([]);
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

// Handle adding a new wallet
async function handleAddWallet(e) {
  e.preventDefault();
  
  const name = document.getElementById('walletName').value.trim();
  const balance = parseFloat(document.getElementById('walletBalance').value) || 0;
  const isPrimary = document.getElementById('walletPrimary').checked;
  
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
      isPrimary,
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

// Handle adding a new favorite dish
async function handleAddFavorite(e) {
  e.preventDefault();
  
  const dishName = document.getElementById('favoriteName').value.trim();
  const dishCategory = document.getElementById('favoriteCategory').value.trim();
  
  if (!dishName) {
    alert("Будь ласка, введіть назву страви");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) return;
    
    const favoriteData = {
      dishName,
      dishCategory,
      userEmail: user.email,
      userId: user.uid,
      createdAt: new Date()
    };
    
    // Add to Firestore
    await addDoc(collection(db, "favorites"), favoriteData);
    
    // Reload favorites
    await loadFavorites();
    hideModal(elements.addFavoriteModal);
    showToast("Страва додана до улюблених!");
    elements.favoriteForm.reset();
  } catch (error) {
    console.error("Error adding favorite:", error);
    alert(`Помилка додавання страви: ${error.message}`);
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

// Delete favorite function
async function deleteFavorite(favoriteId) {
  if (!confirm("Видалити цю страву з улюблених?")) return;
  
  try {
    await deleteDoc(doc(db, "favorites", favoriteId));
    await loadFavorites();
    showToast("Страва видалена з улюблених!");
  } catch (error) {
    console.error("Error deleting favorite:", error);
    alert("Помилка видалення страви");
  }
}

// Render functions
function renderSubscriptions(subscriptions) {
  elements.subscriptionsList.innerHTML = subscriptions.length > 0 
    ? subscriptions.map(sub => `
        <div class="modal-list-item subscription-item ${sub.active ? 'active' : ''}">
          <strong>${sub.name || 'Підписка'}</strong>
          <div class="status">${sub.description || 'Активна'}</div>
          ${sub.active ? `<div class="benefits" style="margin-top:10px;font-size:14px;color:#666;">
            ${sub.benefits || '✓ Безкоштовна доставка<br>✓ Знижка 10% на всі страви'}
          </div>` : ''}
        </div>
      `).join('')
    : '<div class="no-data">У вас немає активних підписок</div>';
}

function renderOrders(orders) {
  elements.ordersList.innerHTML = orders.length > 0
    ? orders.map(order => `
        <div class="modal-list-item order-item">
          <strong>Замовлення ${order.orderNumber || order.id || ''}</strong>
          <div class="order-date">${formatDate(order.createdAt)}</div>
          <div class="order-amount">${order.totalAmount || 0} грн</div>
          <div class="order-items">${getOrderItems(order.items)}</div>
          <button class="order-repeat-btn" style="margin-top:10px;background:#f0f0f0;border:none;padding:5px 10px;border-radius:5px;font-size:12px;">
            Повторити замовлення
          </button>
        </div>
      `).join('')
    : '<div class="no-data">У вас немає історії замовлень</div>';
}

// Оновлена функція renderWallets
function renderWallets(wallets) {
  elements.walletsList.innerHTML = wallets.length > 0
    ? wallets.map(wallet => `
        <div class="modal-list-item wallet-item" style="display: flex; justify-content: space-between; align-items: center;">
          <div class="wallet-info">
            <div class="wallet-name">${wallet.name || 'Гаманець'}</div>
            <div class="wallet-balance">${wallet.balance || 0} грн</div>
          </div>
          <div class="wallet-actions" style="margin-left: auto;">
            <button class="delete-wallet" data-id="${wallet.id}" style="background: none; border: none; color: #ff4444; cursor: pointer;">
              <i class="fas fa-trash"></i> Видалити
            </button>
          </div>
        </div>
      `).join('')
    : '<div class="no-data">У вас немає гаманців</div>';
  
  // Додаємо обробники подій для кнопок видалення
  document.querySelectorAll('.delete-wallet').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const walletId = e.currentTarget.getAttribute('data-id');
      await deleteWallet(walletId);
    });
  });
}

// Оновлена функція renderFavorites
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

// Initialize the app
document.addEventListener('DOMContentLoaded', init);