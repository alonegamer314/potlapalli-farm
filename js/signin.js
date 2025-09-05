// js/signin.js
// Firebase Authentication Module for Sign-In

// ✅ Fix: Removed extra spaces in URL
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } 
  from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// 🔧 Firebase config (same as in your HTML)
const firebaseConfig = {
  apiKey: "AIzaSyAXmkk4DfFahS9euqh-xR7uS3JpRS0Ll0c",
  authDomain: "potlapallifarm.firebaseapp.com",
  projectId: "potlapallifarm",
  storageBucket: "potlapallifarm.firebasestorage.app",
  messagingSenderId: "1017629729159",
  appId: "1:1017629729159:web:357c420a9de335d427b322"
};

// Initialize Auth (we'll do it safely)
let auth;
try {
  auth = getAuth();
} catch (error) {
  console.error("Firebase not initialized:", error);
  alert("Authentication system is not ready. Please refresh or try later.");
}

// DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signinForm");
  const rememberMe = document.getElementById("rememberMe");

  if (!signinForm) return; // Exit if no form

  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("signinEmail");
    const passwordInput = document.getElementById("signinPassword");

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    // 🛑 Validation
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    // 🔐 Set persistence: "Remember Me" or session only
    const persistence = rememberMe?.checked 
      ? browserLocalPersistence 
      : browserSessionPersistence;

    setPersistence(auth, persistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        console.log("Signed in:", userCredential.user);
        alert("Signed in successfully! Welcome back.");
        window.location.href = "index.html";
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-email') {
          alert("The email address is not valid.");
        } else if (errorCode === 'auth/user-not-found') {
          alert("No account found with this email.");
        } else if (errorCode === 'auth/wrong-password') {
          alert("Incorrect password. Please try again.");
        } else if (errorCode === 'auth/too-many-requests') {
          alert("Too many sign-in attempts. Please try again later.");
        } else {
          alert("Error: " + error.message);
        }
      });
  });

  // 💡 Optional: Forgot Password link handler
  const forgotLink = document.getElementById("forgotPassword");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Password reset is coming soon! For now, contact support.");
    });
  }
});
