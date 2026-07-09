// --- DATABASE OF DESTINATIONS & PRICING ---
const travelData = {
    paris: {
        transport: [
            { id: 't1', name: 'Air France Economy Flight', price: 650, meta: '🛫 Travel Time: 11h 20m • Direct' },
            { id: 't2', name: 'Eurostar High-Speed Train', price: 120, meta: '🚊 Travel Time: 2h 15m • Scenic Route' }
        ],
        hotels: [
            { id: 'h1', name: 'Hotel de Crillon Luxury Palace', price: 450, meta: '⭐️ 5 Star • Near Eiffel Tower' },
            { id: 'h2', name: 'St Christopher’s Inn Hostel', price: 45, meta: '⭐️ Budget • Social Vibe & Bar' }
        ],
        attractions: [
            { id: 'a1', name: 'Eiffel Tower Priority Access', price: 38 },
            { id: 'a2', name: 'Louvre Museum Guided Tour', price: 65 }
        ]
    },
    tokyo: {
        transport: [
            { id: 't3', name: 'Japan Airlines Executive Suite', price: 1100, meta: '🛫 Travel Time: 14h 05m • Luxury Fly' },
            { id: 't4', name: 'Shinkansen Bullet Train Ticket', price: 130, meta: '🚄 Travel Time: 2h 30m • Kyoto Connection' }
        ],
        hotels: [
            { id: 'h3', name: 'Park Hyatt Shinjuku', price: 550, meta: '⭐️ 5 Star • Epic Skyline Skyline Views' },
            { id: 'h4', name: 'Capsule Hotel Anshin Oyado', price: 40, meta: '⭐️ Unique Capsule Experience' }
        ],
        attractions: [
            { id: 'a3', name: 'teamLab Planets Digital Art Ticket', price: 28 },
            { id: 'a4', name: 'Tokyo Skytree Observation Deck', price: 22 }
        ]
    },
    bali: {
        transport: [
            { id: 't5', name: 'Garuda Indonesia Holiday Flight', price: 500, meta: '🛫 Travel Time: 8h 45m' },
            { id: 't6', name: 'Island Speedboat Transfer', price: 35, meta: '🚤 Speedboat • Sanur to Nusa Penida' }
        ],
        hotels: [
            { id: 'h5', name: 'Four Seasons Resort Sayan (Ubud)', price: 750, meta: '⭐️ 5 Star • Jungle Heaven & Private Pools' },
            { id: 'h6', name: 'Seminyak Beachside Surf Villa', price: 55, meta: '⭐️ 3 Star • Right on the Beach' }
        ],
        attractions: [
            { id: 'a5', name: 'Ubud Sacred Monkey Forest Sanctuary Tour', price: 15 },
            { id: 'a6', name: 'Tanah Lot Sunset Temple Excursion', price: 25 }
        ]
    }
};

// Global App State Variables
let cart = [];
let currentUser = null;

// --- DOM ELEMENT REFERENCES ---
const authScreen = document.getElementById('auth-screen');
const homepageScreen = document.getElementById('homepage-screen');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const logoutBtn = document.getElementById('logout-btn');

const destSelect = document.getElementById('destination-select');
const priceSort = document.getElementById('price-sort');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');

// --- INITIALIZATION & EFFECTS ---
window.addEventListener('DOMContentLoaded', () => {
    generateFloatingEmojis();
    setupTheme();
    renderContent();
});

// Theme Switching Functionality
function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        showToast("Theme switched successfully!", "info");
    });
}

// Interactive Floating Background Emojis
function generateFloatingEmojis() {
    const emojis = ['🥖', '🏖️', '👒', '🌋', '⛰️', '✈️', '🛳️', '🎟️', '🥐', '⛩️'];
    const container = document.getElementById('emoji-container');
    
    setInterval(() => {
        const span = document.createElement('span');
        span.className = 'floating-emoji';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = (Math.random() * 4 + 6) + 's'; // Between 6s and 10s
        container.appendChild(span);
        
        // Remove emoji once animation cycle completed
        setTimeout(() => span.remove(), 10000);
    }, 1500);
}

// Universal Animated Notification Pop-ups
function showToast(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fa-solid fa-circle-info text-blue"></i>';
    if(type === 'success') {
        toast.style.borderLeftColor = 'var(--color-green)';
        icon = '<i class="fa-solid fa-circle-check text-green"></i>';
    } else if(type === 'error') {
        toast.style.borderLeftColor = 'var(--color-red)';
        icon = '<i class="fa-solid fa-triangle-exclamation text-red"></i>';
    }
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// --- AUTHENTICATION CONTROLLERS ---
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    loginForm.classList.remove('hide'); signupForm.classList.add('hide');
});

tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    signupForm.classList.remove('hide'); loginForm.classList.add('hide');
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('sign-pass').value;
    const repass = document.getElementById('sign-repass').value;
    
    if(pass !== repass) {
        showToast("Passwords do not match! Check again.", "error");
        return;
    }
    currentUser = document.getElementById('sign-name').value;
    successfulAuth();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser = "Traveler";
    successfulAuth();
});

function successfulAuth() {
    showToast(`Welcome Authorized Account: ${currentUser}! Loading your Dream Hub.`, 'success');
    authScreen.classList.add('hide');
    homepageScreen.classList.remove('hide');
    logoutBtn.classList.remove('hide');
}

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    cart = [];
    updateCartUI();
    authScreen.classList.remove('hide');
    homepageScreen.classList.add('hide');
    logoutBtn.classList.add('hide');
    showToast("Logged out successfully.", "info");
});

// --- RENDER APPLICATION CARDS & DATA ---
destSelect.addEventListener('change', renderContent);
priceSort.addEventListener('change', renderContent);

function renderContent() {
    const city = destSelect.value;
    const sortBy = priceSort.value;
    
    // Fetch shallow data clones
    let transport = [...travelData[city].transport];
    let hotels = [...travelData[city].hotels];
    let attractions = [...travelData[city].attractions];
    
    // Sort logic arrays
    const sorter = (a, b) => sortBy === 'low-high' ? a.price - b.price : b.price - a.price;
    transport.sort(sorter);
    hotels.sort(sorter);
    attractions.sort(sorter);
    
    // Target inner displays
    buildColumnHtml('transport-list', transport, 'fa-plane');
    buildColumnHtml('hotel-list', hotels, 'fa-hotel');
    buildColumnHtml('attractions-list', attractions, 'fa-eye');
}

function buildColumnHtml(elementId, items, fallbackIcon) {
    const listContainer = document.getElementById(elementId);
    listContainer.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'sub-item';
        card.innerHTML = `
            <div class="sub-item-header">
                <span>${item.name}</span>
                <span class="text-green">$${item.price}</span>
            </div>
            ${item.meta ? `<div class="sub-item-meta">${item.meta}</div>` : ''}
            <button class="btn-add-cart" onclick="addToCart('${item.name}', ${item.price})">Add to Cart <i class="fa-solid fa-plus"></i></button>
        `;
        listContainer.appendChild(card);
    });
}

// --- CART SYSTEM MANAGEMENT ---
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`Added ${name} to your Custom Itinerary!`, 'success');
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Hero Promotional Quick Select Click Action
function quickSelectParis() {
    destSelect.value = 'paris';
    renderContent();
    addToCart('Air France Economy Flight', 650);
    addToCart('Hotel de Crillon Luxury Palace', 450);
    showToast("Paris Featured Highlights successfully mapped!", "success");
}

// --- MODAL VIEWS CONTROL ---
cartBtn.addEventListener('click', () => {
    const itemsWrapper = document.getElementById('cart-items-container');
    itemsWrapper.innerHTML = '';
    
    if(cart.length === 0) {
        itemsWrapper.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--text-muted)">Your Cart itinerary is currently empty. Start packing!</p>`;
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <span class="text-green" style="margin-right:15px;">$${item.price}</span>
                    <button class="btn-icon text-red" style="padding: 4px 8px;" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            itemsWrapper.appendChild(row);
        });
    }
    
    // Compute Totals
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('modal-item-count').innerText = cart.length;
    document.getElementById('modal-total-price').innerText = `$${total}`;
    
    cartModal.classList.remove('hide');
});

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartUI();
    showToast(`Removed "${removedItem.name}" from schedule.`, "info");
    cartBtn.click(); // Re-trigger modal render loop refresh
}

closeModal.addEventListener('click', () => cartModal.classList.add('hide'));
window.addEventListener('click', (e) => { if(e.target === cartModal) cartModal.classList.add('hide'); });

document.getElementById('checkout-btn').addEventListener('click', () => {
    if(cart.length === 0) {
        showToast("Cannot process checkout with empty selections!", "error");
        return;
    }
    showToast("🎉 Booking Complete! Tickets and summary have been emailed to you.", "success");
    cart = [];
    updateCartUI();
    cartModal.classList.add('hide');
});
