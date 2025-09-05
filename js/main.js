/* js/main.js */

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Mobile menu toggle
  // =========================
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuBtn.classList.toggle("open");
    });
  }
// Close mobile menu when clicking a link or auth button
document.querySelectorAll('#nav a, #mobileAuthButtons a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});

  // =========================
  // Hero section overlay animation (if needed)
  // =========================
  // You can extend this if you want a slider
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.classList.add("show");
  }

  // =========================
  // Fade-up scroll animations
  // =========================
  const reveal = (el) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  };
  document.querySelectorAll(".fade-up").forEach(reveal);

  // =========================
  // Product Quantity & Cart
  // =========================
  const cartCount = document.getElementById("cartCount");

  document.querySelectorAll(".product-card").forEach(card => {
    const qtyInput = card.querySelector(".qty");
    const minusBtn = card.querySelector(".minus");
    const plusBtn = card.querySelector(".plus");
    const addBtn = card.querySelector(".add-to-cart-btn");

    // Increase quantity
    plusBtn.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });

    // Decrease quantity
    minusBtn.addEventListener("click", () => {
      if (parseInt(qtyInput.value) > 0) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });

    // Add to cart
    addBtn.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value);
      if (qty > 0) {
        cartCount.textContent = parseInt(cartCount.textContent) + qty;
        qtyInput.value = 0; // reset quantity after adding

        // Small feedback animation
        const oldText = addBtn.innerHTML;
        addBtn.innerHTML = "Added ✓";
        setTimeout(() => addBtn.innerHTML = oldText, 900);
      }
    });
  });

  // =========================
  // Contact Form Submit
  // =========================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your message has been recorded.");
      contactForm.reset();
    });
  }

  // =========================
  // Newsletter Signup Submit
  // =========================
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Subscribed successfully!");
      newsletterForm.reset();
    });
  }

});

// Smooth scroll for hero "Enter Farm" button
const heroBtn = document.querySelector('.hero-btn');
if (heroBtn) {
  heroBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(heroBtn.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// =========================
// Fade-up animation for gallery
// =========================
const revealGallery = (el) => {
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
document.querySelectorAll('.fade-up').forEach(revealGallery);

document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'potlapalli_cart_v1';
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const renderCart = () => {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';
    let total = 0;

    Object.values(cart).forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const card = document.createElement('div');
      card.className = 'cart-item';
      card.innerHTML = `
        <img src="assets/images/${item.id.split('-')[0]}.jpg" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <div class="quantity-controls">
            <button class="minus">−</button>
            <input type="text" value="${item.qty}" readonly>
            <button class="plus">+</button>
          </div>
          <p>Subtotal: ₹<span class="itemSubtotal">${itemTotal}</span></p>
          <button class="remove-item">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(card);

      // Quantity buttons
      const minusBtn = card.querySelector('.minus');
      const plusBtn = card.querySelector('.plus');
      const qtyInput = card.querySelector('input');
      const subtotalEl = card.querySelector('.itemSubtotal');
      const removeBtn = card.querySelector('.remove-item');

      minusBtn.addEventListener('click', () => {
        if(item.qty > 1) {
          item.qty--;
          qtyInput.value = item.qty;
          subtotalEl.textContent = item.price * item.qty;
          saveCart(cart);
          updateTotal();
        }
      });

      plusBtn.addEventListener('click', () => {
        item.qty++;
        qtyInput.value = item.qty;
        subtotalEl.textContent = item.price * item.qty;
        saveCart(cart);
        updateTotal();
      });

      removeBtn.addEventListener('click', () => {
        delete cart[item.id];
        saveCart(cart);
        renderCart();
        updateTotal();
      });
    });

    cartTotalEl.textContent = total;
  };

  const updateTotal = () => {
    const cart = getCart();
    let total = 0;
    Object.values(cart).forEach(item => total += item.price * item.qty);
    cartTotalEl.textContent = total;
  };

  renderCart();

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert('Checkout feature coming soon!');
  });
});

// =========================
// Gallery Modal & Reveal
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // Smooth reveal
  document.querySelectorAll('.fade-up').forEach(el => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  });

  // Gallery modal
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalClose = document.getElementById('modalClose');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      if(modal && modalImg){
        modal.style.display = 'flex';
        modalImg.src = item.dataset.full;
      }
    });
  });

  if(modalClose){
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  if(modal){
    modal.addEventListener('click', e => {
      if(e.target === modal) modal.style.display = 'none';
    });
  }

});

// =========================
// Gallery Click -> Detail Page
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.dataset.title;
      const description = item.dataset.description;
      const image = item.dataset.image;

      // Pass data via localStorage
      localStorage.setItem('galleryTitle', title);
      localStorage.setItem('galleryDesc', description);
      localStorage.setItem('galleryImage', image);

      window.location.href = 'gallery-detail.html';
    });
  });

  // Fill detail page if on gallery-detail.html
  if(document.getElementById('detailTitle')){
    const title = localStorage.getItem('galleryTitle');
    const desc = localStorage.getItem('galleryDesc');
    const image = localStorage.getItem('galleryImage');

    if(title && desc && image){
      document.getElementById('detailTitle').textContent = title;
      document.getElementById('detailDescription').textContent = desc;
      document.getElementById('detailImage').src = image;
      document.getElementById('detailImage').alt = title;
    }
  }
});

// Toggle mobile nav
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
});
