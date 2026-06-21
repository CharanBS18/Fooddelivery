const menuData = [
    { id: 1, name: "Truffle Mushroom Burger", price: 18.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1400", dec: "Premium wagyu beef, black truffle mayo, aged cheddar", tag: "Bestseller" },
    { id: 2, name: "Spicy Salmon Poke", price: 21.50, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1400", dec: "Fresh Atlantic salmon, edamame, spicy mayo, mango", tag: "Healthy" },
    { id: 3, name: "Artisanal Margherita", price: 24.00, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=1400", dec: "San Marzano tomatoes, buffalo mozzarella, fresh basil", tag: "Popular" },
    { id: 4, name: "Wagyu Steak Frites", price: 45.00, img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=1400", dec: "Grade A5 Wagyu, truffle fries, peppercorn sauce", tag: "Premium" },
    { id: 5, name: "Matcha Lava Cake", price: 12.50, img: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&q=80&w=1400", dec: "Kyoto matcha green tea, white chocolate center", tag: "Dessert" },


];




function initApp() {
    renderMenu();
    initHeroStackInteractor();

    const exploreBtn = document.getElementById('explore-menu-btn');
    const featuredSection = document.getElementById('featured-menu-grid');

    if (exploreBtn && featuredSection) {
        exploreBtn.addEventListener('click', () => {
            featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}





function initHeroStackInteractor() {
    const container = document.getElementById('hero-stack-interactor');
    if (!container || typeof window.gsap === 'undefined') return;

    const items = [
        {
            clipId: 'clip-original',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            clipId: 'clip-hexagons',
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
        {
            clipId: 'clip-pixels',
            image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        },
    ];

    const stackImage = document.getElementById('hero-stack-image');
    const stackGroup = document.getElementById('hero-stack-group');
    const stackButtons = Array.from(container.querySelectorAll('.hero-stack-item'));
    const stackNums = Array.from(container.querySelectorAll('.hero-stack-num'));
    const stackTitles = Array.from(container.querySelectorAll('.hero-stack-title'));
    const gsap = window.gsap;

    let activeIndex = 0;
    let masterTimeline = null;
    let hoverSwitchTimer = null;

    const updateActiveStyles = (index) => {
        stackNums.forEach((numEl, i) => {
            numEl.classList.remove('text-orange-500', 'scale-110', 'text-zinc-400');
            numEl.classList.add(i === index ? 'text-orange-500' : 'text-zinc-400');
            if (i === index) numEl.classList.add('scale-110');
        });

        stackTitles.forEach((titleEl, i) => {
            titleEl.classList.remove('text-zinc-950', 'opacity-100', 'translate-x-2', 'text-zinc-500', 'opacity-50');
            if (i === index) {
                titleEl.classList.add('text-zinc-950', 'opacity-100', 'translate-x-2');
            } else {
                titleEl.classList.add('text-zinc-500', 'opacity-50');
            }
        });
    };

    const createLoop = (index) => {
        const item = items[index];
        const selector = `#${item.clipId} .stack-path`;

        if (masterTimeline) masterTimeline.kill();
        gsap.killTweensOf(selector);
        stackImage?.setAttribute('href', item.image);
        stackGroup?.setAttribute('clip-path', `url(#${item.clipId})`);

        gsap.set(selector, {
            scale: 0.001,
            transformOrigin: '50% 50%',
            willChange: 'transform',
            transformPerspective: 400,
        });

        // Lighter loop: reveal once, then subtle pulse. This avoids expensive full redraw cycles.
        const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });
        timeline
            .to(selector, {
                scale: 1,
                duration: 0.55,
                stagger: { amount: 0.2, from: 'center' },
                ease: 'power3.out',
                force3D: true,
            })
            .to(selector, {
                scale: 1.025,
                duration: 1.1,
                yoyo: true,
                repeat: 3,
                ease: 'sine.inOut',
                stagger: { amount: 0.14, from: 'center' },
                force3D: true,
            });

        masterTimeline = timeline;
    };

    const switchTo = (index) => {
        if (activeIndex === index) return;
        activeIndex = index;
        updateActiveStyles(index);
        createLoop(index);
    };

    stackButtons.forEach((buttonEl, index) => {
        buttonEl.addEventListener('mouseenter', () => {
            clearTimeout(hoverSwitchTimer);
            hoverSwitchTimer = setTimeout(() => switchTo(index), 70);
        });
        buttonEl.addEventListener('focus', () => {
            switchTo(index);
        });
    });

    updateActiveStyles(0);
    createLoop(0);
}

function renderMenu() {
    const menuContainer = document.getElementById('featured-menu-grid');
    if (!menuContainer) return;

    const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1400';

    menuContainer.innerHTML = menuData.map(item => `
        <div class="glass-card p-4 rounded-2xl border border-white/20 shadow-lg shadow-zinc-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full bg-white/60">
            <div class="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-zinc-800 z-10 shadow-sm">${item.tag}</span>
                <img
                    src="${item.img || PLACEHOLDER_IMG}"
                    srcset="${(item.img || PLACEHOLDER_IMG).replace(/w=800/g, 'w=600')} 600w, ${(item.img || PLACEHOLDER_IMG).replace(/w=800/g, 'w=1000')} 1000w, ${(item.img || PLACEHOLDER_IMG).replace(/w=800/g, 'w=1400')} 1400w"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    alt="${item.name}"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"
                >
            </div>
            <div class="flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="font-headline font-bold text-xl text-zinc-900 mb-1">${item.name}</h3>
                    <p class="text-zinc-500 text-sm mb-4 line-clamp-2">${item.dec}</p>
                </div>
                <div class="flex justify-between items-center mt-auto">
                    <span class="font-bold text-2xl text-primary">$${item.price.toFixed(2)}</span>
                    <span class="text-xs text-zinc-500 font-semibold tracking-wide uppercase">View Only</span>
                </div>
            </div>
        </div>
    `).join('');
}



window.addEventListener('DOMContentLoaded', initApp);

