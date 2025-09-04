
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const auth = getAuth();
const signinForm = document.getElementById('signinForm');

if (signinForm) {
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signinForm['signinEmail'].value;
    const password = signinForm['signinPassword'].value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert(`Signin successful! Welcome back`);
        window.location.href = "index.html"; // redirect to homepage
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });
}
