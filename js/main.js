/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {

  // =========================
  // Mobile menu toggle
  // =========================
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.querySelector('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
  }

  // =========================
  // Hero Slider
  // =========================
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideInterval = setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000); // 5 seconds per slide

  // =========================
  // Reveal on scroll
  // =========================
  const reveal = (el) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('show'); 
          obs.unobserve(e.target); 
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  };
  document.querySelectorAll('.fade-up').forEach(reveal);

  // =========================
  // Simple Cart (localStorage)
  // =========================
  const CART_KEY = 'potlapalli_cart_v1';
  const addButtons = document.querySelectorAll('.add-to-cart');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

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

      // Feedback
      const old = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      setTimeout(() => btn.innerHTML = old, 900);
    });
  });

  // =========================
  // Optional: Safe form submit (demo only)
  // =========================
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! Your message has been recorded.');
      form.reset();
    });
  }

  // =========================
  // Newsletter signup demo
  // =========================
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Subscribed successfully!');
      newsletterForm.reset();
    });
  }

});
