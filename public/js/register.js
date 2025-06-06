import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  doc, setDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db } from "../firebase-config.js";

// Отримуємо елементи DOM
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordStrength = document.getElementById('password-strength');
const passwordMatch = document.getElementById('password-match');
const registerBtn = document.getElementById('registerBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');

// Ініціалізуємо Google провайдер
const provider = new GoogleAuthProvider();

// Функція для перевірки сили пароля
function checkPasswordStrength(password) {
  if (!password) {
    return { strength: 'empty', message: 'Введіть пароль', class: 'error' };
  }

  // Перевірка довжини
  if (password.length < 6) {
    return { 
      strength: 'weak', 
      message: 'Слабкий пароль. Рекомендуємо використати мінімум 6 символів', 
      class: 'error' 
    };
  }

  let score = 0;
  
  // Перевірка на наявність різних типів символів
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 4) {
    return { 
      strength: 'strong', 
      message: 'Надійний пароль', 
      class: 'success',
      recommendations: []
    };
  } else if (score >= 2) {
    return { 
      strength: 'medium', 
      message: 'Середній рівень надійності', 
      class: 'warning',
      recommendations: [
        'Додайте великі літери',
        'Додайте цифри',
        'Додайте спеціальні символи (@, #, $ тощо)'
      ].filter((_, i) => i < 2) // Показуємо тільки 2 рекомендації
    };
  } else {
    return { 
      strength: 'weak', 
      message: 'Слабкий пароль', 
      class: 'error',
      recommendations: [
        'Використайте мінімум 8 символів',
        'Додайте великі та малі літери',
        'Додайте цифри',
        'Додайте спеціальні символи (@, #, $ тощо)'
      ]
    };
  }
}

// Обробник вводу пароля
passwordInput.addEventListener('input', () => {
  const result = checkPasswordStrength(passwordInput.value);
  
  // Оновлюємо індикатор сили пароля
  passwordStrength.innerHTML = `
    <div class="password-feedback ${result.class}">
      ${result.message}
      ${result.recommendations ? `
        <ul style="margin-top: 4px; font-size: 12px;">
          ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
    <div class="password-strength-indicator ${result.strength}">
      <div class="strength-bar"></div>
    </div>
  `;
  
  validateForm();
});

// Обробник підтвердження пароля
confirmPasswordInput.addEventListener('input', () => {
  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordMatch.textContent = 'Паролі не збігаються';
    passwordMatch.className = 'password-feedback error';
  } else {
    passwordMatch.textContent = 'Паролі збігаються';
    passwordMatch.className = 'password-feedback success';
  }
  validateForm();
});

// Валідація форми
function validateForm() {
  const isPasswordValid = passwordInput.value.length >= 6;
  const isMatch = passwordInput.value === confirmPasswordInput.value && passwordInput.value !== '';
  const isNameValid = document.getElementById('name').value.trim() !== '';
  const isEmailValid = document.getElementById('email').value.includes('@');
  
  registerBtn.disabled = !(isPasswordValid && isMatch && isNameValid && isEmailValid);
}

// Додаємо валідацію для інших полів
document.getElementById('name').addEventListener('input', validateForm);
document.getElementById('email').addEventListener('input', validateForm);

// Обробник реєстрації через email/пароль
registerBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;

  // Фінальна перевірка перед відправкою
  if (password !== confirmPasswordInput.value) {
    alert("Паролі не збігаються!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Зберігаємо інформацію про користувача у колекції users
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      phone: phone || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      provider: 'email'
    });

    // Створюємо порожні підколекції для нового користувача
    await Promise.all([
      setDoc(doc(db, "users", user.uid, "favorites", "initial"), {}),
      setDoc(doc(db, "users", user.uid, "orders", "initial"), {}),
      setDoc(doc(db, "users", user.uid, "subscriptions", "initial"), {}),
      setDoc(doc(db, "users", user.uid, "wallets", "initial"), {})
    ]);

    window.location.href = "profile.html";
  } catch (error) {
    handleAuthError(error);
  }
});

// Обробник реєстрації через Google
googleSignInBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Перевіряємо, чи це новий користувач
    const isNewUser = result._tokenResponse.isNewUser;
    
    if (isNewUser) {
      // Зберігаємо інформацію про користувача у колекції users
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL || null,
        provider: 'google',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Створюємо порожні підколекції для нового користувача
      await Promise.all([
        setDoc(doc(db, "users", user.uid, "favorites", "initial"), {}),
        setDoc(doc(db, "users", user.uid, "orders", "initial"), {}),
        setDoc(doc(db, "users", user.uid, "subscriptions", "initial"), {}),
        setDoc(doc(db, "users", user.uid, "wallets", "initial"), {})
      ]);
    }
    
    window.location.href = "profile.html";
  } catch (error) {
    handleAuthError(error);
  }
});

// Функція для обробки помилок аутентифікації
function handleAuthError(error) {
  let errorMessage = "Помилка: ";
  switch(error.code) {
    case 'auth/email-already-in-use':
      errorMessage += "Цей email вже зареєстровано";
      break;
    case 'auth/invalid-email':
      errorMessage += "Невірний формат email";
      break;
    case 'auth/weak-password':
      errorMessage += "Пароль занадто простий (мінімум 6 символів)";
      break;
    case 'auth/account-exists-with-different-credential':
      errorMessage += "Цей email вже зареєстровано з іншим методом входу";
      break;
    case 'auth/popup-closed-by-user':
      errorMessage = "Вікно входу було закрито";
      break;
    case 'auth/cancelled-popup-request':
      errorMessage = "Вхід скасовано";
      break;
    case 'auth/popup-blocked':
      errorMessage = "Спливаюче вікно було заблоковано. Дозвольте спливаючі вікна для цього сайту.";
      break;
    default:
      errorMessage += error.message;
  }
  alert(errorMessage);
  console.error("Деталі помилки:", error);
}