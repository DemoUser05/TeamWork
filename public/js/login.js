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

// Функція для отримання параметрів URL
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    returnUrl: params.get('returnUrl') || 'profile.html'
  };
}

// Функція для перенаправлення після успішного входу
function redirectAfterLogin() {
  const { returnUrl } = getUrlParams();
  window.location.href = returnUrl;
}

// Функція входу по email та паролю
window.login = async () => {
  clearErrors();
  
  if (!emailInput.value || !passwordInput.value) {
    showError('Будь ласка, заповніть всі поля');
    if (!emailInput.value) highlightError(emailInput);
    if (!passwordInput.value) highlightError(passwordInput);
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    redirectAfterLogin();
  } catch (error) {
    handleLoginError(error);
  }
};

// Функція входу через Google
window.googleSignIn = async () => {
  clearErrors();
  
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    redirectAfterLogin();
  } catch (error) {
    showError('Помилка входу через Google: ' + error.message);
  }
};

// Функція скидання пароля
window.resetPassword = async () => {
  clearErrors();
  
  if (!emailInput.value) {
    showError('Введіть email для скидання пароля');
    highlightError(emailInput);
    return;
  }

  try {
    await sendPasswordResetEmail(auth, emailInput.value);
    showError('Лист для скидання пароля надіслано на ' + emailInput.value, false);
  } catch (error) {
    handleResetError(error);
  }
};

// Обробка помилок входу
function handleLoginError(error) {
  let errorMessage = '';
  
  switch (error.code) {
    case 'auth/invalid-email':
      errorMessage = 'Невірний формат email';
      highlightError(emailInput);
      break;
    case 'auth/user-disabled':
      errorMessage = 'Акаунт заблоковано';
      break;
    case 'auth/user-not-found':
      errorMessage = 'Користувача з таким email не знайдено';
      highlightError(emailInput);
      break;
    case 'auth/wrong-password':
      errorMessage = 'Невірний пароль';
      highlightError(passwordInput);
      passwordInput.value = ''; // Очищаємо поле пароля
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Забагато спроб. Спробуйте пізніше або скиньте пароль';
      break;
    default:
      errorMessage = 'Помилка входу: ' + error.message;
  }
  
  showError(errorMessage);
  shakeForm();
}

// Обробка помилок скидання пароля
function handleResetError(error) {
  let errorMessage = '';
  
  switch (error.code) {
    case 'auth/invalid-email':
      errorMessage = 'Невірний формат email';
      highlightError(emailInput);
      break;
    case 'auth/user-not-found':
      errorMessage = 'Користувача з таким email не знайдено';
      highlightError(emailInput);
      break;
    default:
      errorMessage = 'Помилка скидання пароля: ' + error.message;
  }
  
  showError(errorMessage);
}

// Показати повідомлення про помилку
function showError(message, isError = true) {
  errorContainer.textContent = message;
  errorContainer.style.color = isError ? '#ff4444' : '#00C851';
  errorContainer.classList.add('show');
}

// Підсвітити поле з помилкою
function highlightError(input) {
  input.classList.add('input-error');
  input.addEventListener('input', function removeError() {
    input.classList.remove('input-error');
    input.removeEventListener('input', removeError);
  });
}

// Очистити всі помилки
function clearErrors() {
  errorContainer.classList.remove('show');
  errorContainer.textContent = '';
  document.querySelectorAll('.input-error').forEach(input => {
    input.classList.remove('input-error');
  });
}

// Анімація струсу форми при помилці
function shakeForm() {
  const form = document.querySelector('.login-container');
  form.style.animation = 'shake 0.5s ease';
  setTimeout(() => {
    form.style.animation = '';
  }, 500);
}

// Дозволити відправку форми по Enter
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    login();
  }
});