
// js/orders.js
// Firebase logic for the Potlapalli Farm Order History page

// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyAXmkk4DfFahS9euqh-xR7uS3JpRS0Ll0c",
    authDomain: "potlapallifarm.firebaseapp.com",
    projectId: "potlapallifarm",
    storageBucket: "potlapallifarm.firebasestorage.app",
    messagingSenderId: "1017629729159",
    appId: "1:1017629729159:web:357c420a9de335d427b322"
};

// --- Initialize Firebase Services ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DOM Element Selection ---
const mainContent = document.getElementById('main-content');
const authWall = document.getElementById('auth-wall');
const orderListEl = document.getElementById('order-list');
const trackingModal = document.getElementById('trackingModal');
const trackingTimelineList = document.getElementById('tracking-timeline-list');
const cancelConfirmModal = document.getElementById('cancelConfirmModal');
const toastEl = document.getElementById('toast');

// --- Helper Functions ---

/**
 * Shows a toast notification message.
 * @param {string} message - The message to display.
 * @param {boolean} isError - If true, styles the toast as an error.
 */
function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = isError ? 'toast show error' : 'toast show';
    setTimeout(() => { toastEl.className = 'toast'; }, 3000);
}

// --- Core Rendering Functions ---

/**
 * Renders the list of orders into the DOM.
 * @param {Array} orders - An array of order objects from Firestore.
 */
function renderOrders(orders) {
    if (!orderListEl) return;
    if (orders.length === 0) {
        orderListEl.innerHTML = `<div class="no-orders"><h3>No Orders Found</h3><p>You haven't placed any orders yet. Start shopping!</p></div>`;
        return;
    }

    // Sort orders by date, newest first
    const sortedOrders = orders.sort((a, b) => b.orderDate.seconds - a.orderDate.seconds);

    orderListEl.innerHTML = sortedOrders.map(order => {
        const orderDate = new Date(order.orderDate.seconds * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'});
        return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id.slice(-6).toUpperCase()}</div>
                    <div class="order-date">Placed on: ${orderDate}</div>
                </div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            <div class="order-body">
                <div class="order-summary">${order.items.length} item(s) totaling ₹${order.totalAmount}</div>
                <div class="order-items">
                    ${order.items.slice(0, 4).map(item => `<img class="order-item-img" src="${item.image}" alt="${item.name}" title="${item.name}">`).join('')}
                    ${order.items.length > 4 ? `<span>+${order.items.length - 4} more</span>` : ''}
                </div>
            </div>
            <div class="order-footer">
                <button class="btn btn-outline track-order-btn" data-order-status="${order.status}">Track Order</button>
                <button class="btn btn-danger cancel-order-btn" data-order-id="${order.id}" ${order.status !== 'Processing' ? 'disabled' : ''}>Cancel Order</button>
            </div>
        </div>
    `}).join('');
}


/**
 * Renders the tracking timeline inside the modal based on the order's status.
 * @param {string} status - The current status of the order.
 */
function renderTrackingTimeline(status) {
    if (!trackingTimelineList || !trackingModal) return;
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(status);
    
    trackingTimelineList.innerHTML = statuses.map((s, index) => `
        <li class="tracking-step ${index <= currentIndex ? 'completed' : ''}">
            <div class="icon"><i class="fas fa-${index <= currentIndex ? 'check' : 'box'}"></i></div>
            <div class="details"><h4>${s}</h4><p>${index <= currentIndex ? 'Completed' : 'Pending'}</p></div>
        </li>
    `).join('');
    
    trackingModal.classList.add('show');
}

// --- Firebase Data Functions ---

/**
 * Cancels an order by updating its status in Firestore.
 * @param {string} orderId - The ID of the order to cancel.
 */
async function performCancelOrder(orderId) {
    const orderRef = doc(db, 'orders', orderId);
    try {
        await updateDoc(orderRef, { status: 'Cancelled' });
        showToast('Order cancelled successfully.');
        const user = auth.currentUser;
        if (user) {
            loadOrders(user.uid); // Reload orders to show the change
        }
    } catch (error) {
        showToast('Failed to cancel order. Please try again.', true);
        console.error("Error cancelling order:", error);
    }
}

/**
 * Fetches and displays all orders for a given user ID.
 * @param {string} userId - The UID of the logged-in user.
 */
async function loadOrders(userId) {
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", userId));
    try {
        const querySnapshot = await getDocs(ordersQuery);
        const orders = [];
        querySnapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
        renderOrders(orders);
    } catch (error) {
        if(orderListEl) orderListEl.innerHTML = `<p>There was an error loading your orders. Please refresh the page.</p>`;
        console.error("Error loading orders:", error);
    }
}

// --- Main Application Logic ---

// Listen for authentication state changes to protect the page
onAuthStateChanged(auth, user => {
    if (user) {
        // User is signed in, show the main content and load their orders
        mainContent.style.display = 'block';
        if(authWall) authWall.style.display = 'none';
        loadOrders(user.uid);
    } else {
        // User is signed out, show the auth wall
        mainContent.style.display = 'none';
        if(authWall) authWall.style.display = 'block';
    }
});

// --- Event Listeners ---

// Use event delegation for dynamically created buttons in the order list
orderListEl.addEventListener('click', e => {
    const target = e.target.closest('button');
    if (!target) return;

    if (target.classList.contains('track-order-btn')) {
        const status = target.dataset.orderStatus;
        renderTrackingTimeline(status);
    }
    
    if (target.classList.contains('cancel-order-btn')) {
        const orderId = target.dataset.orderId;
        if (orderId) {
            cancelConfirmModal.dataset.orderId = orderId;
            cancelConfirmModal.classList.add('show');
        }
    }
});

// Listener for the tracking modal's close button
trackingModal?.querySelector('.close-modal').addEventListener('click', () => {
    trackingModal.classList.remove('show');
});

// Listeners for the cancel confirmation modal
cancelConfirmModal?.querySelector('.close-modal').addEventListener('click', () => {
    cancelConfirmModal.classList.remove('show');
});
cancelConfirmModal?.querySelector('#cancelModalCloseBtn').addEventListener('click', () => {
    cancelConfirmModal.classList.remove('show');
});
cancelConfirmModal?.querySelector('#cancelModalConfirmBtn').addEventListener('click', () => {
    const orderId = cancelConfirmModal.dataset.orderId;
    if (orderId) {
        performCancelOrder(orderId);
        cancelConfirmModal.classList.remove('show');
    }
});

