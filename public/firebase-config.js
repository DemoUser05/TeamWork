import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGZM3_NLN1akBOPkGSd4b3d5KxGIHYJw8",
  authDomain: "comando4ka.firebaseapp.com",
  projectId: "comando4ka",
  storageBucket: "comando4ka.appspot.com",
  messagingSenderId: "442969089264",
  appId: "1:442969089264:web:0b9742bef7982e32a50e35",
  measurementId: "G-C78TLLLGPY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Експортуємо для використання в інших модулях
export { auth, db };

// Додаємо до глобального об'єкта window для зворотної сумісності
window.auth = auth;
window.db = db;