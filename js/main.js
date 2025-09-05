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
