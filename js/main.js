// Single DOMContentLoaded wrapper
document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Mobile Menu Toggle
  ========================= */
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    // Close mobile menu when clicking any nav link
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });
  }

  /* =========================
     Fade-up Scroll Animations
  ========================= */
  const revealElements = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
  };

  // Run once
  revealElements();

  /* =========================
     Product Quantity & Cart Logic
  ========================= */
  const cartCountEl = document.getElementById("cartCount");

  // Update cart count on page load
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;
  };

  // Initialize cart count
  updateCartCount();

  // Handle each product card
  document.querySelectorAll(".product-card").forEach((card) => {
    const qtyInput = card.querySelector(".qty");
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const addToCartBtn = card.querySelector(".add-to-cart-btn");

    const productId = card.dataset.id;
    const productPrice = parseFloat(card.dataset.price);
    const productName = card.querySelector("h3").textContent;

    // Increase quantity
    plusBtn.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    // Decrease quantity
    minusBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value);
      if (qty > 0) {
        qtyInput.value = qty - 1;
      }
    });

    // Add to Cart
    addToCartBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value);
      if (qty <= 0) return alert("Please select a quantity.");

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.push({ id: productId, name: productName, price: productPrice, qty });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      // Feedback animation
      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = "Added ✓";
      setTimeout(() => {
        addToCartBtn.textContent = originalText;
      }, 900);

      // Reset input
      qtyInput.value = "0";
    });
  });

  /* =========================
     Contact Form Handler
  ========================= */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your message has been recorded.");
      contactForm.reset();
    });
  }

  /* =========================
     Newsletter Form Handler
  ========================= */
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Subscribed successfully!");
      newsletterForm.reset();
    });
  }

  /* =========================
     Gallery Modal (if exists)
  ========================= */
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  if (modal && modalImg && modalClose) {
    // Open modal on gallery item click
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const fullImage = item.dataset.full || item.querySelector("img").src;
        modal.style.display = "flex";
        modalImg.src = fullImage;
      });
    });

    // Close modal on X
    modalClose.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Close modal if clicking outside image
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  /* =========================
     Gallery Detail Page (if on gallery-detail.html)
  ========================= */
  if (document.getElementById("detailTitle")) {
    const title = localStorage.getItem("galleryTitle");
    const desc = localStorage.getItem("galleryDesc");
    const image = localStorage.getItem("galleryImage");

    if (title && desc && image) {
      document.getElementById("detailTitle").textContent = title;
      document.getElementById("detailDescription").textContent = desc;
      document.getElementById("detailImage").src = image;
      document.getElementById("detailImage").alt = title;
    } else {
      // Fallback if no data
      document.getElementById("detailTitle").textContent = "Gallery Detail";
      document.getElementById("detailDescription").textContent =
        "No data available.";
    }
  }

  /* =========================
     Gallery Click -> Detail Page
  ========================= */
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.dataset.title || "Untitled";
      const description = item.dataset.description || "No description.";
      const image = item.querySelector("img").src;

      localStorage.setItem("galleryTitle", title);
      localStorage.setItem("galleryDesc", description);
      localStorage.setItem("galleryImage", image);

      window.location.href = "gallery-detail.html";
    });
  });
});

/* =========================
   Smooth Scroll for Hero Button (outside DOMContentLoaded for safety)
========================= */
const heroBtn = document.querySelector(".hero-btn");
if (heroBtn) {
  heroBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(heroBtn.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// js/main.js
// Main JavaScript for Potlapalli Farm
// Handles: Cart, Mobile Menu, Fade-in Animations

// =========================
// 1. CART SYSTEM
// =========================

// Product Database (must match HTML)
const products = {
  goat: { name: "Premium Goat Meat", price: 850 },
  chicken: { name: "Country Chicken", price: 320 },
  eggs: { name: "Farm Eggs", price: 8 },
  milk: { name: "Fresh Goat Milk", price: 60 }
};

// Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to Cart (called from index.html)
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(`Added ${products[productId].name} to cart!`);
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = totalItems;
}

// Render cart on cart.html
function renderCart() {
  const cart = getCart();
  const cartItemsEl = document.getElementById('cartItems');
  const emptyCartEl = document.getElementById('emptyCart');
  const cartSummaryEl = document.getElementById('cartSummary');
  const summaryRowsEl = document.getElementById('summaryRows');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!cartItemsEl) return; // Only run on cart.html

  if (cart.length === 0) {
    emptyCartEl.style.display = 'block';
    cartSummaryEl.style.display = 'none';
    return;
  }

  let total = 0;
  cartItemsEl.innerHTML = '';

  cart.forEach(item => {
    const product = products[item.id];
    const itemTotal = product.price * item.qty;
    total += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <img src="assets/images/${item.id}.jpg" alt="${product.name}">
      <div class="item-details">
        <h4>${product.name}</h4>
        <div class="price">₹${product.price} per unit</div>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
          <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      </div>
      <div class="item-total">₹${itemTotal}</div>
    `;
    cartItemsEl.appendChild(itemEl);
  });

  // Update summary
  summaryRowsEl.innerHTML = '';
  cart.forEach(item => {
    const product = products[item.id];
    const row = document.createElement('div');
    row.classList.add('summary-row');
    row.textContent = `${product.name} × ${item.qty}`;
    summaryRowsEl.appendChild(row);
  });

  cartTotalEl.textContent = `₹${total}`;
  cartSummaryEl.style.display = 'block';
}

// Update quantity
function updateQty(id, change) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      removeItem(id);
    } else {
      saveCart(cart);
      renderCart();
    }
  }
}

// Remove item
function removeItem(id) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
}

// =========================
// 2. MOBILE MENU (if you have hamburger)
// =========================

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // Initial cart count
  updateCartCount();

  // Render cart if on cart page
  if (document.getElementById('cartItems')) {
    renderCart();
  }

  // Fade-in animations
  const fadeElements = document.querySelectorAll('.fade-up');
  const handleScroll = () => {
    fadeElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 150) {
        el.classList.add('show');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('DOMContentLoaded', handleScroll);
});

// =========================
// 1. PRODUCT DATABASE
// =========================
const products = {
  goat: { name: "Premium Goat Meat", price: 850 },
  chicken: { name: "Country Chicken", price: 320 },
  eggs: { name: "Farm Eggs", price: 8 },
  milk: { name: "Fresh Goat Milk", price: 60 }
};

// =========================
// 2. CART HELPERS
// =========================
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = totalItems;
}

// =========================
// 3. QUANTITY CONTROLS (on index.html)
// =========================
function changeQty(id, delta) {
  const input = document.getElementById(`qty-${id}`);
  let qty = parseInt(input.value);
  qty = Math.max(1, qty + delta); // Prevents going below 1
  input.value = qty;
}

// =========================
// 4. ADD TO CART (with quantity)
// =========================
function addToCartFromInput(id) {
  const input = document.getElementById(`qty-${id}`);
  const qty = parseInt(input.value);

  const cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }

  saveCart(cart);
  updateCartCount();
  input.value = 1; // Reset to 1 after adding
  alert(`Added ${qty} unit(s) of ${products[id].name} to cart!`);
}

// =========================
// 5. FADE-IN & INIT
// =========================
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Fade-in animations
  const fadeElements = document.querySelectorAll('.fade-up');
  const handleScroll = () => {
    fadeElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 150) {
        el.classList.add('show');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('DOMContentLoaded', handleScroll);
});
