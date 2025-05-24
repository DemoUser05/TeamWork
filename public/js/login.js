import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { auth } from "../firebase-config.js";

const errorContainer = document.getElementById('error-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Функція входу по email та паролю
window.login = async () => {
  errorContainer.textContent = '';
  
  if (!emailInput.value || !passwordInput.value) {
    showError('Будь ласка, заповніть всі поля');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    window.location.href = "profile.html";
  } catch (error) {
    handleLoginError(error);
  }
};

// Функція входу через Google
window.googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.href = "profile.html";
  } catch (error) {
    showError('Помилка входу через Google: ' + error.message);
  }
};

// Функція скидання пароля
window.resetPassword = async () => {
  if (!emailInput.value) {
    showError('Введіть email для скидання пароля');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, emailInput.value);
    showError('Лист для скидання пароля надіслано на ' + emailInput.value, false);
  } catch (error) {
    showError('Помилка: ' + error.message);
  }
};

// Обробка помилок входу
function handleLoginError(error) {
  let errorMessage = '';
  
  switch (error.code) {
    case 'auth/invalid-email':
      errorMessage = 'Невірний формат email';
      break;
    case 'auth/user-disabled':
      errorMessage = 'Акаунт заблоковано';
      break;
    case 'auth/user-not-found':
      errorMessage = 'Акаунт не знайдено';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Невірний пароль';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Забагато спроб. Спробуйте пізніше або скиньте пароль';
      break;
    default:
      errorMessage = 'Помилка входу: ' + error.message;
  }
  
  showError(errorMessage);
}

// Показати повідомлення про помилку
function showError(message, isError = true) {
  errorContainer.textContent = message;
  errorContainer.style.color = isError ? '#ff4444' : '#00C851';
}

// Дозволити відправку форми по Enter
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    login();
  }
});