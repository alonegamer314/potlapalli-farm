/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  // menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
  }

  // reveal on scroll
  const reveal = (el) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
      });
    }, {threshold: 0.15});
    observer.observe(el);
  };
  document.querySelectorAll('.fade-up').forEach(reveal);

  // cart functionality
  const CART_KEY = 'potlapalli_cart_v1';
  const addButtons = document.querySelectorAll('.add-to-cart');
  const cartSidebar = document.createElement('div');
  cartSidebar.id = 'cartSidebar';
  document.body.appendChild(cartSidebar);

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

  const updateCartUI = () => {
    const cart = getCart();
    let html = '<h4>Cart</h4>';
    if(Object.keys(cart).length === 0){
      html += '<p>Your cart is empty</p>';
    } else {
      html += '<ul>';
      Object.values(cart).forEach(item => {
        html += `<li>${item.name} × ${item.qty} <span>₹${item.price * item.qty}</span></li>`;
      });
      html += '</ul>';
      const total = Object.values(cart).reduce((sum,item)=>sum+item.price*item.qty,0);
      html += `<div class="cart-total">Total: ₹${total}</div>`;
    }
    cartSidebar.innerHTML = html;
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
      updateCartUI();

      // feedback
      const old = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      setTimeout(() => btn.innerHTML = old, 900);
    });
  });

  updateCartUI();

  // contact form demo
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks — your message was recorded (demo).');
      form.reset();
    });
  }
});
