/* ==========================
   main.js - Final Version
========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Menu Toggle =====
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
  }

  // ===== Scroll Reveal (Fade Up Animation) =====
  const revealElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Add-to-Cart Functionality =====
  const CART_KEY = 'potlapalli_cart_v1';
  const addButtons = document.querySelectorAll('.add-to-cart');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      if (!card) return;

      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price) || 0;

      const cart = getCart();
      if (!cart[id]) cart[id] = { id, name, price, qty: 0 };
      cart[id].qty += 1;
      saveCart(cart);

      // Temporary feedback
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 900);
    });
  });

  // ===== Contact Form Demo Submission =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks — your message was recorded (demo).');
      form.reset();
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ===== Optional: Close Mobile Menu on Link Click =====
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      if(nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
      }
    });
  });

});
