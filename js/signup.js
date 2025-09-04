import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth();
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signupEmail'].value;
    const password = signupForm['signupPassword'].value;
    const name = signupForm['signupName'].value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert(`Signup successful! Welcome, ${name}`);
        window.location.href = "index.html"; // redirect to homepage
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });
}
