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

// Mini Cart Functionality
const cartBtn = document.getElementById('cartBtn');
const miniCart = document.getElementById('miniCart');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = miniCart.querySelector('.cart-items');
const cartTotalEl = document.getElementById('cartTotal');

const getCart = () => JSON.parse(localStorage.getItem('potlapalli_cart_v1') || '{}');
const saveCart = (c) => localStorage.setItem('potlapalli_cart_v1', JSON.stringify(c));

const updateMiniCart = () => {
  const cart = getCart();
  cartItemsContainer.innerHTML = '';
  let total = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<span>${item.name} x ${item.qty}</span><span>₹${item.price*item.qty}</span>`;
    cartItemsContainer.appendChild(div);
  });
  cartTotalEl.textContent = `₹${total}`;
};

// Toggle Mini Cart
cartBtn.addEventListener('click', () => {
  miniCart.classList.toggle('open');
  updateMiniCart();
});
closeCart.addEventListener('click', () => miniCart.classList.remove('open'));

// Update cart automatically when adding items
document.querySelectorAll('.add-to-cart').forEach(btn => {
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
    updateMiniCart();

    // feedback
    const old = btn.innerHTML;
    btn.innerHTML = 'Added ✓';
    setTimeout(() => btn.innerHTML = old, 900);
  });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Mobile Menu Toggle =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

if(menuBtn && nav){
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.classList.toggle('open');
  });
}

// ===== Header Scroll Shadow =====
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if(window.scrollY > 50){
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== Mini Cart Count (localStorage) =====
const cartCountEl = document.getElementById('cartCount');
const CART_KEY = 'potlapalli_cart_v1';
const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  let total = 0;
  Object.values(cart).forEach(item => total += item.qty);
  if(cartCountEl) cartCountEl.textContent = total;
};
// Run initially and after adding items
updateCartCount();
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => setTimeout(updateCartCount, 100));
});

// Cart panel toggle
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');

const updateCartUI = () => {
  const cart = getCart();
  cartItemsContainer.innerHTML = '';
  let total = 0;

  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>${item.name} x ${item.qty}</div>
      <div>₹${item.price * item.qty}</div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = total;
};

// Show cart panel when adding item
addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    updateCartUI();
    cartPanel.classList.add('show');
    cartOverlay.classList.add('active');
  });
});

// Close cart
closeCart.addEventListener('click', () => {
  cartPanel.classList.remove('show');
  cartOverlay.classList.remove('active');
});
cartOverlay.addEventListener('click', () => {
  cartPanel.classList.remove('show');
  cartOverlay.classList.remove('active');
});
