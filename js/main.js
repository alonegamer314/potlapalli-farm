/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
  /* ==========================
     Mobile Menu Toggle
  ========================== */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if(menuBtn && nav){
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      menuBtn.classList.toggle('open');
    });
  }

  /* ==========================
     Hero Slider Auto-Rotation
  ========================== */
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideInterval = 5000; // 5s

  function showSlide(index){
    slides.forEach((s,i) => {
      s.classList.toggle('active', i === index);
    });
  }

  function nextSlide(){
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if(slides.length > 0){
    showSlide(currentSlide);
    setInterval(nextSlide, slideInterval);
  }

  /* ==========================
     Fade-Up Scroll Animations
  ========================== */
  const fadeElements = document.querySelectorAll('.fade-up');
  const revealOnScroll = (el) => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15});
    observer.observe(el);
  }
  fadeElements.forEach(revealOnScroll);

  /* ==========================
     Mini-Cart / Add to Cart
  ========================== */
  const CART_KEY = 'potlapalli_cart_v1';
  const addButtons = document.querySelectorAll('.add-to-cart');
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      if(!card) return;
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price) || 0;
      const cart = getCart();
      if(!cart[id]) cart[id] = {id, name, price, qty: 0};
      cart[id].qty += 1;
      saveCart(cart);

      // Feedback animation
      const oldText = btn.innerHTML;
      btn.innerHTML = 'Added ✓';
      setTimeout(()=> btn.innerHTML = oldText, 1000);

      // Update mini-cart badge if exists
      const miniCart = document.querySelector('.mini-cart span');
      if(miniCart){
        const totalQty = Object.values(cart).reduce((a,b)=> a + b.qty, 0);
        miniCart.textContent = totalQty;
      }
    });
  });

  /* ==========================
     Smooth Scroll
  ========================== */
  const scrollLinks = document.querySelectorAll('nav a, .cta');
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetID = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetID);
      if(target){
        window.scrollTo({top: target.offsetTop - 60, behavior: 'smooth'});
      }
    });
  });

  /* ==========================
     Newsletter / Contact Form
  ========================== */
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you! Your message has been recorded (demo).');
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Subscribed successfully (demo).');
      newsletterForm.reset();
    });
  }

  /* ==========================
     Optional: Hero Slider Manual Controls (if needed)
  ========================== */
  // You can implement prev/next buttons here if desired
});
