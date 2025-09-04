/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- Menu Toggle ---------------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
  }

  /* ---------------- Reveal on Scroll ---------------- */
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

  /* ---------------- Simple Cart (localStorage) ---------------- */
  const CART_KEY = 'potlapalli_cart_v1';
  const addButtons = document.querySelectorAll('.add-to-cart');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const id = card.dataset.id || card.querySelector('h4')?.textContent || 'item';
      const name = card.dataset.name || card.querySelector('h4')?.textContent || 'Item';
      const price = parseFloat(card.dataset.price) || 0;
      const cart = getCart();
      if (!cart[id]) cart[id] = { id, name, price, qty: 0 };
      cart[id].qty += 1;
      saveCart(cart);

      // feedback
      const old = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      setTimeout(() => btn.innerHTML = old, 900);
    });
  });

  /* ---------------- Contact Form Submit ---------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks — your message was recorded (demo).');
      form.reset();
    });
  }

  /* ---------------- Smooth Scroll ---------------- */
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------------- Back-to-top Button ---------------- */
  const topButton = document.createElement('button');
  topButton.textContent = '↑';
  topButton.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    padding: 0.5rem 1rem; background:#27ae60; color:#fff;
    border:none; border-radius:50%; cursor:pointer; display:none; z-index:9999;`;
  document.body.appendChild(topButton);

  window.addEventListener('scroll', () => {
    topButton.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
