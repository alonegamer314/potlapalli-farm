// js/signup.js
// Firebase sign-up handler for Potlapalli Farm

// ✅ Import Firebase Auth modules (no extra spaces in URL!)
import {
  getAuth,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// 🔧 Firebase config (same as in your other pages)
const firebaseConfig = {
  apiKey: "AIzaSyAXmkk4DfFahS9euqh-xR7uS3JpRS0Ll0c",
  authDomain: "potlapallifarm.firebaseapp.com",
  projectId: "potlapallifarm",
  storageBucket: "potlapallifarm.firebasestorage.app",
  messagingSenderId: "1017629729159",
  appId: "1:1017629729159:web:357c420a9de335d427b322",
};

// Initialize Firebase Auth
let auth;
try {
  auth = getAuth();
} catch (error) {
  console.error("Failed to initialize Firebase Auth:", error);
  alert("Authentication system is not ready. Please try again later.");
}

// DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const rememberMe = document.getElementById("rememberMe");

  // Exit if form doesn't exist (e.g., script loaded by mistake)
  if (!signupForm) return;

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get input values
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    // 🛑 Validation
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    if (!password) {
      alert("Please create a password.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

    // 🔐 Set persistence based on "Remember Me"
    const persistence = rememberMe?.checked
      ? browserLocalPersistence
      : browserSessionPersistence;

    // Apply persistence and create user
    setPersistence(auth, persistence)
      .then(() => {
        return createUserWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        console.log("User registered:", userCredential.user);
        alert("🎉 Account created successfully! Welcome to Potlapalli Farm.");
        window.location.href = "index.html"; // Redirect to homepage
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
          alert("An account with this email already exists. Please sign in instead.");
        } else if (errorCode === 'auth/invalid-email') {
          alert("The email address you entered is not valid.");
        } else if (errorCode === 'auth/operation-not-allowed') {
          alert("Sign-up is currently disabled. Please contact support.");
        } else if (errorCode === 'auth/weak-password') {
          alert("Password is too weak. Use at least 6 characters.");
        } else {
          alert("An error occurred: " + error.message);
        }
      });
  });
});
