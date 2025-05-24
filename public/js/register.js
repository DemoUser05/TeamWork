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
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
  
  if (strongRegex.test(password)) {
    return { strength: 'strong', message: 'Надійний пароль', class: 'success' };
  } else if (mediumRegex.test(password)) {
    return { strength: 'medium', message: 'Середній рівень. Додайте спецсимволи (@, ! тощо)', class: '' };
  } else {
    return { strength: 'weak', message: 'Слабкий пароль. Мінімум 6 символів, літери та цифри', class: 'error' };
  }
}

// Обробник вводу пароля
passwordInput.addEventListener('input', () => {
  const result = checkPasswordStrength(passwordInput.value);
  passwordStrength.textContent = result.message;
  passwordStrength.className = result.class;
  validateForm();
});

// Обробник підтвердження пароля
confirmPasswordInput.addEventListener('input', () => {
  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordMatch.textContent = 'Паролі не збігаються';
    passwordMatch.className = 'error';
  } else {
    passwordMatch.textContent = 'Паролі збігаються';
    passwordMatch.className = 'success';
  }
  validateForm();
});

// Валідація форми
function validateForm() {
  const isPasswordValid = checkPasswordStrength(passwordInput.value).strength !== 'weak';
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