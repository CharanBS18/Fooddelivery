const menuData = [
    { id: 1, name: "Truffle Mushroom Burger", price: 18.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800", dec: "Premium wagyu beef, black truffle mayo, aged cheddar", tag: "Bestseller" },
    { id: 2, name: "Spicy Salmon Poke", price: 21.50, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800", dec: "Fresh Atlantic salmon, edamame, spicy mayo, mango", tag: "Healthy" },
    { id: 3, name: "Artisanal Margherita", price: 24.00, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800", dec: "San Marzano tomatoes, buffalo mozzarella, fresh basil", tag: "Popular" },
    { id: 4, name: "Wagyu Steak Frites", price: 45.00, img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800", dec: "Grade A5 Wagyu, truffle fries, peppercorn sauce", tag: "Premium" },
    { id: 5, name: "Matcha Lava Cake", price: 12.50, img: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=800", dec: "Kyoto matcha green tea, white chocolate center", tag: "Dessert" },
    { id: 6, name: "Lobster Ravioli", price: 28.00, img: "https://images.unsplash.com/photo-1621376856424-6ccfb5e7df24?auto=format&fit=crop&q=80&w=800", dec: "Maine lobster, ricotta, saffron bisque sauce", tag: "Chef's Pick" }
];

let cart = [];

function initApp() {
    renderMenu();
    updateCartIcon();
    
    // Bind cart toggle
    document.getElementById('cart-btn').addEventListener('click', toggleCart);
    document.getElementById('close-cart-btn').addEventListener('click', toggleCart);
    document.getElementById('checkout-btn').addEventListener('click', checkout);
    document.getElementById('cart-overlay').addEventListener('click', toggleCart);
}

function renderMenu() {
    const menuContainer = document.getElementById('featured-menu-grid');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = menuData.map(item => `
        <div class="glass-card p-4 rounded-2xl border border-white/20 shadow-lg shadow-zinc-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full bg-white/60">
            <div class="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-zinc-800 z-10 shadow-sm">${item.tag}</span>
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            </div>
            <div class="flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="font-headline font-bold text-xl text-zinc-900 mb-1">${item.name}</h3>
                    <p class="text-zinc-500 text-sm mb-4 line-clamp-2">${item.dec}</p>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <span class="font-bold text-2xl text-primary">$${item.price.toFixed(2)}</span>
                    <button onclick="addToCart(${item.id})" class="bg-primary/10 hover:bg-primary-gradient text-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90">
                        <span class="material-symbols-outlined text-[20px]">add</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleCart() {
    const cartEl = document.getElementById('cart-slideover');
    const overlay = document.getElementById('cart-overlay');
    cartEl.classList.toggle('translate-x-full');
    overlay.classList.toggle('opacity-0');
    overlay.classList.toggle('pointer-events-none');
}

function addToCart(id) {
    const item = menuData.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    // Small animation on cart icon
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('scale-110');
    setTimeout(() => cartBtn.classList.remove('scale-110'), 200);
    
    updateCartUI();
    updateCartIcon();
}

function removeFromCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
        if (existing.qty > 1) {
            existing.qty--;
        } else {
            cart = cart.filter(c => c.id !== id);
        }
    }
    updateCartUI();
    updateCartIcon();
}

function updateCartIcon() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if(count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-zinc-400 gap-4 mt-20">
                <span class="material-symbols-outlined text-6xl opacity-50">shopping_bag</span>
                <p class="font-medium">Your cart is empty.</p>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => {
            total += item.price * item.qty;
            return `
            <div class="flex gap-4 items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <img src="${item.img}" class="w-16 h-16 rounded-lg object-cover">
                <div class="flex-grow">
                    <h4 class="font-bold text-zinc-900 text-sm">${item.name}</h4>
                    <span class="text-primary font-bold block">$${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="flex items-center gap-2 bg-white rounded-full border border-zinc-200 p-1">
                    <button onclick="removeFromCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                        <span class="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                    <button onclick="addToCart(${item.id})" class="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                        <span class="material-symbols-outlined text-[16px]">add</span>
                    </button>
                </div>
            </div>
            `;
        }).join('');
    }
    
    totalEl.textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if(cart.length === 0) return;
    alert("Order placed successfully! The chef is preparing your meal.");
    cart = [];
    updateCartUI();
    updateCartIcon();
    toggleCart();
}

window.addEventListener('DOMContentLoaded', initApp);
