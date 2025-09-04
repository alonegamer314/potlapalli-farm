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
