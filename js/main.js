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
  const slideInterval = 5000;

  if (slides.length > 0) {
    slides[currentSlide].classList.add('active'); // show first slide immediately

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, slideInterval);
  }

  // =========================
  // Reveal on scroll
  // =========================
  const reveal = (el) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
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
  const cartCountEl = document.getElementById('cartCount');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const updateCartCount = () => {
    const cart = getCart();
    const totalQty = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalQty;
  };

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
      updateCartCount();

      // Feedback animation
      const oldText = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      setTimeout(() => btn.innerHTML = oldText, 900);
    });
  });

  // Initialize cart count on load
  updateCartCount();

  // =========================
  // Contact form demo submit
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
