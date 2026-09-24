/* ============================================================
   POTLAPALLI FARMS — MAIN APPLICATION LOGIC
   Sections: Firebase → State → Utils → Theme → Header → Nav →
             Cart → Products → Hero → Scroll → Auth → Notifications
   Products now come from Firestore in real time. Falls back to
   the hardcoded list if the collection is empty.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore, collection, query, where, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// App Check — re-enable once Blaze plan is active (see docs/ROADMAP.md Phase 1)
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

/* ---------- 1. FIREBASE ---------- */
const firebaseConfig = {
    apiKey: "AIzaSyAXmkk4DfFahS9euqh-xR7uS3JpRS0Ll0c",
    authDomain: "potlapallifarm.firebaseapp.com",
    projectId: "potlapallifarm",
    storageBucket: "potlapallifarm.firebasestorage.app",
    messagingSenderId: "1017629729159",
    appId: "1:1017629729159:web:357c420a9de335d427b322",
};

const app = initializeApp(firebaseConfig);

// App Check (disabled until billing is enabled)
// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaEnterpriseProvider('YOUR_SITE_KEY'),
//     isTokenAutoRefreshEnabled: true
// });

const auth = getAuth(app);
const db = getFirestore(app);

/* ---------- 2. CONSTANTS & STATE ---------- */
const CART_KEY = 'potlapalliCart';
const SEEN_STATUSES_KEY = 'potlapalliSeenStatuses';
const THEME_KEY = 'potlapalliTheme';

// Fallback catalog — used only when the Firestore `products` collection is empty.
const FALLBACK_PRODUCTS = [
    { id: 'live-ram',         name: 'Live Ram (Macherla Pottelu)',       price: 450, unit: 'kg',    category: 'Live Meat',  isMeat: true,  isLive: true,  description: 'Live Ram, range 15–40 kg.',             image: 'assets/images/live-ram.jpg' },
    { id: 'buck',             name: 'Buck (Meka Pothu)',                 price: 450, unit: 'kg',    category: 'Live Meat',  isMeat: true,  isLive: true,  description: 'Live Buck, range 15–40 kg.',            image: 'assets/images/buck.jpg' },
    { id: 'live-natu-kodi',   name: 'Live Natu Kodi (Country Chicken)',  price: 700, unit: 'kg',    category: 'Live Birds', isMeat: false, isLive: true,  description: 'Live country chicken, your choice.',    image: 'assets/images/live-natu-kodi.jpg' },
    { id: 'sonali-chicken',   name: 'Sonali Country Chicken',            price: 550, unit: 'kg',    category: 'Meat',       isMeat: true,  isLive: false, description: 'Premium Sonali with smokey turmeric.',  image: 'assets/images/sonali-chicken.jpg' },
    { id: 'backyard-chicken', name: 'Backyard Country Chicken',          price: 800, unit: 'kg',    category: 'Meat',       isMeat: true,  isLive: false, description: 'High-quality backyard country chicken.', image: 'assets/images/backyard.jpg' },
    { id: 'natu-kodi-smokey', name: 'Natu Kodi (Smoked)',                price: 900, unit: 'kg',    category: 'Meat',       isMeat: true,  isLive: false, description: 'Delicately smoked country chicken.',    image: 'assets/images/natu-kodi-smokey.jpg' },
    { id: 'goat',             name: 'Premium Goat Meat',                 price: 900, unit: 'kg',    category: 'Meat',       isMeat: true,  isLive: false, description: 'Tender, pasture-raised goat meat.',     image: 'assets/images/goat.jpg' },
    { id: 'eggs-dozen',       name: 'Country Chicken Eggs (12)',         price: 180, unit: 'dozen', category: 'Eggs',       isMeat: false, isLive: false, description: 'A dozen golden-yolk country eggs.',     image: 'assets/images/eggs-dozen.jpg' },
    { id: 'eggs-tray',        name: 'Country Chicken Eggs (30 Tray)',    price: 430, unit: 'tray',  category: 'Eggs',       isMeat: false, isLive: false, description: 'Tray of 30 golden-yolk eggs.',          image: 'assets/images/tray.jpg' },
];

// Live catalog (mutated by the Firestore listener)
let PRODUCTS = FALLBACK_PRODUCTS.slice();

const UPCOMING_PRODUCTS = ['Fish', 'Prawns', 'Crabs', 'Buffalo Milk', 'Cow Milk', 'Button Mushrooms'];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=600';

let currentUser = null;
let activeOrdersUnsub = null;
let productsUnsub = null;

/* ---------- 3. UTILITIES ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatMoney(n) {
    return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
}

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function showToast(message, type = 'success') {
    const container = $('#toast-container');
    if (!container) return;

    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showLoader(show = true) {
    const loader = $('#global-loader');
    if (loader) loader.hidden = !show;
}

function debounce(fn, wait = 100) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

/* ---------- 4. THEME ---------- */
function initTheme() {
    const toggle = $('#themeToggle');
    const icon = toggle?.querySelector('i');

    const apply = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    };

    const saved = localStorage.getItem(THEME_KEY)
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    apply(saved);

    toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        apply(current === 'dark' ? 'light' : 'dark');
    });
}

/* ---------- 5. HEADER SCROLL ---------- */
function initHeaderScroll() {
    const header = $('#header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ---------- 6. MOBILE NAV ---------- */
function buildMobileNavLinks(user) {
    const links = [
        { href: '#home', icon: 'fa-home', label: 'Home' },
        { href: '#products', icon: 'fa-store', label: 'Products' },
        { href: '#how-it-works', icon: 'fa-circle-question', label: 'How It Works' },
        { href: '#contact', icon: 'fa-phone', label: 'Contact' },
    ];

    if (user) {
        links.push({ href: 'orders.html', icon: 'fa-receipt', label: 'My Orders' });
        links.push({ href: 'profile.html', icon: 'fa-user', label: 'My Profile' });
        links.push({ href: '#', icon: 'fa-sign-out-alt', label: 'Log Out', action: 'logout' });
    } else {
        links.push({ href: 'signin.html', icon: 'fa-sign-in-alt', label: 'Log In' });
        links.push({ href: 'signup.html', icon: 'fa-user-plus', label: 'Sign Up' });
    }

    const list = $('#mobileNavLinks');
    if (!list) return;
    list.innerHTML = links.map(l => `
        <li>
            <a href="${l.href}" ${l.action ? `data-action="${l.action}"` : ''}>
                <i class="fas ${l.icon}"></i>
                <span>${l.label}</span>
            </a>
        </li>
    `).join('');
}

function initMobileNav() {
    const nav = $('#mobileNav');
    const backdrop = $('#mobileNavBackdrop');
    const openBtn = $('#menuBtn');
    const closeBtn = $('#mobileNavClose');
    const links = $('#mobileNavLinks');

    const open = () => {
        nav?.classList.add('active');
        backdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const close = () => {
        nav?.classList.remove('active');
        backdrop?.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    links?.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        if (a.dataset.action === 'logout') {
            e.preventDefault();
            handleLogout();
        }
        close();
    });
}

/* ---------- 7. CART: STORAGE ---------- */
function getCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount(true);
    renderCartDrawer();
}

function updateCartCount(animate = false) {
    const el = $('#cartCount');
    if (!el) return;
    const count = getCart().length;
    el.textContent = count;
    if (animate && count > 0) {
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 300);
    }
}

function addToCart(productId, quantity) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existing = cart.find(i => i.id === productId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            isMeat: product.isMeat,
            image: product.image,
            quantity,
        });
    }

    saveCart(cart);

    const qtyLabel = product.isMeat
        ? `${quantity.toFixed(2).replace(/\.?0+$/, '')} kg`
        : `${quantity} ${product.unit}`;
    showToast(`${product.name} (${qtyLabel}) added to cart`);
}

function updateCartItemQty(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const isGoat = productId === 'goat';
    const isMeat = item.isMeat;
    const minQty = isGoat ? 0.75 : (isMeat ? 0.5 : 1);
    const step = isMeat ? 0.25 : 1;

    item.quantity = Math.max(minQty, item.quantity + (delta * step));

    saveCart(cart);
}

function removeCartItem(productId) {
    const cart = getCart().filter(i => i.id !== productId);
    saveCart(cart);
    showToast('Item removed from cart', 'info');
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    renderCartDrawer();
}

/* ---------- 8. CART: DRAWER UI ---------- */
function formatQty(item) {
    if (item.isMeat) {
        return `${item.quantity.toFixed(2).replace(/\.?0+$/, '')} kg`;
    }
    return `${item.quantity} ${item.unit}`;
}

function renderCartDrawer() {
    const body = $('#cartDrawerBody');
    const footer = $('#cartDrawerFooter');
    if (!body || !footer) return;

    const cart = getCart();

    if (cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <h4>Your cart is empty</h4>
                <p>Add some fresh produce to get started</p>
                <button class="cart-checkout-btn" id="emptyCartShop" style="max-width:220px;margin:0 auto;">
                    Browse Products
                </button>
            </div>`;
        footer.innerHTML = '';
        $('#emptyCartShop')?.addEventListener('click', closeCartDrawer);
        return;
    }

    body.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img class="cart-item-img"
                 src="${item.image}"
                 onerror="this.onerror=null;this.src='${FALLBACK_IMG}'"
                 alt="${escapeHtml(item.name)}">
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <div class="cart-item-price">${formatMoney(item.price)} / ${item.unit}</div>
                <div class="cart-item-controls">
                    <div class="qty-stepper">
                        <button data-action="dec" aria-label="Decrease"><i class="fas fa-minus"></i></button>
                        <span class="qty-value">${formatQty(item)}</span>
                        <button data-action="inc" aria-label="Increase"><i class="fas fa-plus"></i></button>
                    </div>
                    <button class="cart-item-remove" data-action="remove" aria-label="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">${formatMoney(item.price * item.quantity)}</div>
        </div>
    `).join('');

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    footer.innerHTML = `
        <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>${formatMoney(subtotal)}</span>
        </div>
        <div class="cart-summary-row">
            <span>Delivery</span>
            <span style="color: var(--primary); font-weight: 600;">FREE</span>
        </div>
        <div class="cart-summary-row total">
            <span>Total</span>
            <span>${formatMoney(subtotal)}</span>
        </div>
        <a href="cart.html" class="cart-checkout-btn">View Cart & Checkout</a>
    `;
}

function openCartDrawer() {
    $('#cartDrawer')?.classList.add('active');
    $('#cartDrawerBackdrop')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    $('#cartDrawer')?.classList.remove('active');
    $('#cartDrawerBackdrop')?.classList.remove('active');
    document.body.style.overflow = '';
}

function initCartDrawer() {
    $('#cartBtn')?.addEventListener('click', openCartDrawer);
    $('#cartDrawerClose')?.addEventListener('click', closeCartDrawer);
    $('#cartDrawerBackdrop')?.addEventListener('click', closeCartDrawer);

    // Event delegation on cart drawer body
    $('#cartDrawerBody')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const itemEl = btn.closest('.cart-item');
        const id = itemEl?.dataset.id;
        if (!id) return;

        const action = btn.dataset.action;
        if (action === 'inc') updateCartItemQty(id, 1);
        else if (action === 'dec') updateCartItemQty(id, -1);
        else if (action === 'remove') removeCartItem(id);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartDrawer();
            $('#mobileNav')?.classList.remove('active');
            $('#mobileNavBackdrop')?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ---------- 9. PRODUCTS ---------- */
function initialQty(product) {
    if (product.id === 'goat') return 0.75;
    return product.isMeat ? 0.5 : 1;
}

function formatProductPrice(product, qty) {
    const total = product.price * qty;
    return formatMoney(total);
}

function renderProductCard(product) {
    const qty = initialQty(product);
    const unitLabel = product.isMeat ? 'kg' : (product.unit || 'kg');
    const badge = product.isLive
        ? `<span class="product-badge live">Live</span>`
        : `<span class="product-badge">${escapeHtml(product.category || 'Fresh')}</span>`;

    const imgHtml = `
        <img src="${product.image}"
             onerror="this.onerror=null;this.src='${FALLBACK_IMG}'"
             alt="${escapeHtml(product.name)}" loading="lazy">`;

    // Stock handling — if stock is 0, show "Sold out"
    const outOfStock = typeof product.stock === 'number' && product.stock <= 0;

    if (product.isLive) {
        return `
            <div class="product-card animated-section" data-id="${product.id}">
                ${badge}
                ${imgHtml}
                <div class="product-content">
                    <h3>${escapeHtml(product.name)}</h3>
                    <p>${escapeHtml(product.description)}
                        <span class="unit-label">${formatMoney(product.price)} / ${unitLabel} (Live weight)</span>
                    </p>
                    <div class="price-line">
                        <span class="price">${formatMoney(product.price)}<small>/${unitLabel}</small></span>
                    </div>
                    <a href="#contact" class="add-to-cart-btn contact-btn">
                        <i class="fas fa-phone"></i> Contact to Order
                    </a>
                </div>
            </div>`;
    }

    const addBtn = outOfStock
        ? `<button class="add-to-cart-btn" disabled><i class="fas fa-ban"></i> Sold out</button>`
        : `<button class="add-to-cart-btn" data-action="add">
               <i class="fas fa-cart-plus"></i> Add to Cart
           </button>`;

    return `
        <div class="product-card animated-section ${outOfStock ? 'sold-out' : ''}" data-id="${product.id}">
            ${badge}
            ${imgHtml}
            <div class="product-content">
                <h3>${escapeHtml(product.name)}</h3>
                <p>${escapeHtml(product.description)}
                    <span class="unit-label">${formatMoney(product.price)} / ${unitLabel}</span>
                </p>
                <div class="price-line">
                    <span class="price price-display" data-base="${product.price}">${formatProductPrice(product, qty)}</span>
                    <div class="quantity-controls">
                        <button class="qty-btn minus-btn" data-action="dec" aria-label="Decrease"><i class="fas fa-minus"></i></button>
                        <span class="qty" data-qty="${qty}">${product.isMeat ? qty.toFixed(2) : qty}</span>
                        <button class="qty-btn plus-btn" data-action="inc" aria-label="Increase"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                ${addBtn}
            </div>
        </div>`;
}

function renderProducts() {
    const grid = $('#product-grid');
    if (!grid) return;

    if (PRODUCTS.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
                <i class="fas fa-leaf" style="font-size: 2rem; opacity: 0.4; display: block; margin-bottom: 14px;"></i>
                <p>No products available right now. Please check back soon.</p>
            </div>`;
        return;
    }

    grid.innerHTML = PRODUCTS.map(renderProductCard).join('');

    // Event delegation for quantity controls & add to cart
    // (Removed once before reattaching — avoids duplicate listeners on refresh)
    if (grid._listener) grid.removeEventListener('click', grid._listener);
    grid._listener = (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const product = PRODUCTS.find(p => p.id === card.dataset.id);
        if (!product || product.isLive) return;

        const qtyEl = card.querySelector('.qty');
        const priceEl = card.querySelector('.price-display');
        if (!qtyEl || !priceEl) return;

        const isGoat = product.id === 'goat';
        const isMeat = product.isMeat;
        const step = isMeat ? 0.25 : 1;
        const minQty = isGoat ? 0.75 : (isMeat ? 0.5 : 1);

        const btn = e.target.closest('[data-action]');
        if (!btn || btn.disabled) return;

        const action = btn.dataset.action;

        if (action === 'add') {
            const qty = parseFloat(qtyEl.dataset.qty) || minQty;
            addToCart(product.id, qty);
            const reset = initialQty(product);
            qtyEl.dataset.qty = reset;
            qtyEl.textContent = isMeat ? reset.toFixed(2) : reset;
            priceEl.textContent = formatMoney(product.price * reset);
            return;
        }

        let qty = parseFloat(qtyEl.dataset.qty) || minQty;

        if (action === 'inc') qty += step;
        else if (action === 'dec') qty = Math.max(minQty, qty - step);

        qtyEl.dataset.qty = qty;
        qtyEl.textContent = isMeat ? qty.toFixed(2) : qty;
        priceEl.textContent = formatMoney(product.price * qty);
    };
    grid.addEventListener('click', grid._listener);

    // Re-observe newly added cards for scroll animations
    observeAnimatedSections();
}

function renderUpcoming() {
    const list = $('#upcoming-list');
    if (!list) return;
    list.innerHTML = UPCOMING_PRODUCTS
        .map(p => `<li><i class="fas fa-check"></i> ${escapeHtml(p)}</li>`)
        .join('');
}

/* ---------- 9b. LOAD PRODUCTS FROM FIRESTORE ---------- */
function loadProducts() {
    const grid = $('#product-grid');
    if (!grid) return; // not on homepage

    try {
        productsUnsub = onSnapshot(
            collection(db, 'products'),
            (snap) => {
                if (snap.empty) {
                    // Firestore has no products yet — use fallback so site stays alive
                    PRODUCTS = FALLBACK_PRODUCTS.slice();
                } else {
                    PRODUCTS = snap.docs.map(d => {
                        const data = d.data();
                        return {
                            id: d.id,
                            name: data.name || 'Product',
                            price: Number(data.price) || 0,
                            unit: data.unit || 'kg',
                            category: data.category || 'Fresh',
                            isMeat: !!data.isMeat,
                            isLive: !!data.isLive,
                            description: data.description || '',
                            image: data.image || '',
                            stock: typeof data.stock === 'number' ? data.stock : null,
                        };
                    });
                }
                renderProducts();
            },
            (err) => {
                console.warn('Products listener failed, using fallback:', err.message);
                PRODUCTS = FALLBACK_PRODUCTS.slice();
                renderProducts();
            }
        );
    } catch (err) {
        console.warn('Could not start products listener:', err);
        PRODUCTS = FALLBACK_PRODUCTS.slice();
        renderProducts();
    }
}

/* ---------- 10. HERO SLIDER ---------- */
function initHeroSlider() {
    const slider = $('#heroSlider');
    const nav = $('#sliderNav');
    if (!slider || !nav) return;

    const slides = $$('.hero-slide', slider);
    if (slides.length <= 1) return;

    let index = 0;
    let timer;

    // Build dots
    nav.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
            index = i;
            update();
            restart();
        });
        nav.appendChild(dot);
    });

    const dots = $$('.slider-dot', nav);

    function update() {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function next() {
        index = (index + 1) % slides.length;
        update();
    }

    function restart() {
        clearInterval(timer);
        timer = setInterval(next, 5500);
    }

    // Pause on hover for desktop
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);

    // Swipe support (mobile)
    let startX = 0;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) index = (index + 1) % slides.length;
            else index = (index - 1 + slides.length) % slides.length;
            update();
            restart();
        }
    });

    restart();
}

/* ---------- 11. SCROLL ANIMATIONS ---------- */
let scrollObserver = null;

function observeAnimatedSections() {
    if (!scrollObserver) {
        scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.animated-section:not(.visible)').forEach(el => scrollObserver.observe(el));
}

function initScrollAnimations() {
    observeAnimatedSections();
}

/* ---------- 12. AUTH UI ---------- */
function renderAuthControls(user) {
    const el = $('#auth-controls');
    if (!el) return;

    if (user) {
        const shortName = (user.displayName || user.email || '').split('@')[0].split(' ')[0];
        el.innerHTML = `
            <a href="orders.html" class="auth-btn" title="My Orders">
                <i class="fas fa-receipt"></i>
            </a>
            <a href="profile.html" class="auth-btn" title="My Profile">
                <i class="fas fa-user-circle"></i> ${escapeHtml(shortName).slice(0, 12)}
            </a>
            <button class="auth-btn" id="logoutBtn">Log Out</button>
        `;
        $('#logoutBtn')?.addEventListener('click', handleLogout);
    } else {
        el.innerHTML = `
            <a href="signin.html" class="auth-btn">Log In</a>
            <a href="signup.html" class="auth-btn primary">Sign Up</a>
        `;
    }

    buildMobileNavLinks(user);
}

async function handleLogout() {
    try {
        await signOut(auth);
        showToast('Signed out successfully', 'info');
    } catch (err) {
        console.error('Logout error:', err);
        showToast('Could not sign out. Try again.', 'error');
    }
}

/* ---------- 13. ORDER NOTIFICATIONS ---------- */
function startOrderNotifications(uid) {
    // Stop any existing listener
    if (activeOrdersUnsub) activeOrdersUnsub();

    const seen = JSON.parse(localStorage.getItem(SEEN_STATUSES_KEY) || '{}');

    try {
        const q = query(collection(db, 'orders'), where('userId', '==', uid));
        activeOrdersUnsub = onSnapshot(q, (snap) => {
            snap.docChanges().forEach((change) => {
                const order = change.doc.data();
                const id = change.doc.id;
                const status = order.status || 'Pending';
                const prev = seen[id];

                if (change.type === 'added') {
                    // First time seeing this order — record without notifying
                    seen[id] = status;
                } else if (change.type === 'modified' && prev !== status) {
                    seen[id] = status;
                    const niceStatus = status.replace(/([A-Z])/g, ' $1').trim();
                    showToast(`Order #${id.slice(-6).toUpperCase()}: ${niceStatus}`, 'info');
                }
            });
            localStorage.setItem(SEEN_STATUSES_KEY, JSON.stringify(seen));
        }, (err) => {
            console.warn('Order notifications unavailable:', err.message);
        });
    } catch (err) {
        console.warn('Could not start order notifications:', err);
    }
}

function stopOrderNotifications() {
    if (activeOrdersUnsub) {
        activeOrdersUnsub();
        activeOrdersUnsub = null;
    }
}

/* ---------- 14. AUTH LISTENER ---------- */
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    renderAuthControls(user);

    if (user) {
        startOrderNotifications(user.uid);
    } else {
        stopOrderNotifications();
    }
});

/* ---------- 15. INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeaderScroll();
    initMobileNav();
    initCartDrawer();
    renderUpcoming();
    initHeroSlider();
    initScrollAnimations();
    updateCartCount();
    renderCartDrawer();

    // Products come from Firestore (with fallback)
    loadProducts();
});

/* Expose for other pages (cart.html, checkout.html) to reuse in future phases */
export { auth, db, getCart, saveCart, showToast, formatMoney, escapeHtml };
