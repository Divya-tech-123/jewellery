/**
 * LUMIÈRE FINE JEWELLERY — MOBILE-FIRST INTERACTIVITY
 */

// Global State
const state = {
  cart: [
    { name: 'Lakshmi Kasu Mala Gold Necklace', price: 84500, img: 'assets/category_necklace.jpg' },
    { name: 'Temple Nakshi Peacock Jhumkas', price: 48900, img: 'assets/category_earrings.jpg' }
  ],
  wishlist: ['Lakshmi Kasu Mala']
};

// Toggle Mobile Menu Drawer
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer) {
    drawer.classList.toggle('active');
    document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
  }
}

// Toggle Cart Drawer
function toggleCartDrawer(e) {
  if (e) e.preventDefault();
  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) {
    cartDrawer.classList.toggle('active');
    document.body.style.overflow = cartDrawer.classList.contains('active') ? 'hidden' : '';
  }
}

// Add Item To Cart
function addToCart(name, price, img) {
  state.cart.push({ name, price, img });
  updateCartUI();
  showToast(`✨ Added "${name}" to shopping bag!`);
}

// Remove Item From Cart
function removeCartItem(btn, price) {
  const row = btn.closest('.cart-item-row');
  if (row) {
    const itemName = row.getAttribute('data-name');
    const index = state.cart.findIndex(i => i.name === itemName);
    if (index > -1) {
      state.cart.splice(index, 1);
    }
    row.remove();
    updateCartUI();
    showToast('Item removed from cart.');
  }
}

// Update Cart Badge & Subtotal
function updateCartUI() {
  const count = state.cart.length;
  const subtotal = state.cart.reduce((acc, curr) => acc + curr.price, 0);

  // Update badges
  const mobileBadge = document.getElementById('mobileCartBadge');
  const botBadge = document.getElementById('botCartBadge');
  const drawerTotal = document.getElementById('cartTotalCount');
  const subtotalEl = document.getElementById('cartSubtotal');

  if (mobileBadge) mobileBadge.textContent = count;
  if (botBadge) botBadge.textContent = count;
  if (drawerTotal) drawerTotal.textContent = count;
  if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
}

// Toggle Wishlist
function toggleWishlistItem(btn, name) {
  btn.classList.toggle('active');
  const isHeartActive = btn.classList.contains('active');
  btn.textContent = isHeartActive ? '♥' : '♡';

  if (isHeartActive) {
    if (!state.wishlist.includes(name)) state.wishlist.push(name);
    showToast(`♥ Saved "${name}" to Wishlist!`);
  } else {
    state.wishlist = state.wishlist.filter(item => item !== name);
    showToast(`Removed from Wishlist.`);
  }

  const wCount = state.wishlist.length;
  const mobileWBadge = document.getElementById('mobileWishlistBadge');
  const botWBadge = document.getElementById('botWishlistBadge');
  if (mobileWBadge) mobileWBadge.textContent = wCount;
  if (botWBadge) botWBadge.textContent = wCount;
}

function toggleWishlistModal(e) {
  if (e) e.preventDefault();
  showToast(`♥ You have ${state.wishlist.length} item(s) in your Wishlist.`);
}

function openAccountModal(e) {
  if (e) e.preventDefault();
  const userName = prompt('Enter your name to sign in or view your Lumière account:', 'Priya Sharma');
  if (userName) {
    showToast(`Welcome back, ${userName}! ✨`);
  }
}

function openStoreModal(e) {
  if (e) e.preventDefault();
  alert('🏛️ Lumière Flagship Boutiques:\n\n1. Jubilee Hills, Hyderabad\n2. MG Road, Bengaluru\n3. T. Nagar, Chennai\n4. Besant Road, Vijayawada\n\nDaily: 10:30 AM – 8:30 PM\nValet parking & VIP bridal lounge available.');
}

function openSearchModal() {
  const q = prompt('Search 22K gold, jhumkas, bridal harams, solitaires:');
  if (q && q.trim()) {
    showToast(`Searching designs for "${q.trim()}"...`);
  }
}

function handleSearchSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('mobileSearchInput');
  if (input && input.value.trim()) {
    showToast(`Searching for "${input.value.trim()}"...`);
    toggleMobileMenu();
  }
}

function filterCategory(category) {
  showToast(`Showing ${category} collection.`);
}

function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsEmail');
  if (input && input.value.trim()) {
    showToast('✨ Thank you for subscribing to Lumière updates!');
    input.value = '';
  }
}

// Toast popup notification
function showToast(message) {
  const toast = document.getElementById('toastPopup');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Carousel Scroll helper
function scrollCarousel(carouselId, offset) {
  const el = document.getElementById(carouselId);
  if (el) {
    el.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

// Active Bottom Navigation on Scroll
window.addEventListener('scroll', () => {
  const sections = [
    { id: 'hero', navId: 'botNavHome' },
    { id: 'categories', navId: 'botNavCategories' },
    { id: 'bestsellers', navId: 'botNavCategories' },
    { id: 'bridal', navId: 'botNavCategories' }
  ];

  const scrollY = window.scrollY;
  const header = document.getElementById('siteHeader');
  if (header) {
    if (scrollY > 20) {
      header.style.boxShadow = '0 4px 16px rgba(45, 40, 35, 0.08)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(45, 40, 35, 0.04)';
    }
  }
}, { passive: true });

/* ==========================================================================
   HERO BANNER CAROUSEL CONTROLLER
   Autoplay (4.5s), Pause on hover/interaction, Touch Swipe, Arrows, Dots
   ========================================================================== */
let currentHeroSlide = 0;
let heroAutoplayTimer = null;
let heroResumeTimer = null;
let isHeroPaused = false;
let touchStartX = 0;
let touchEndX = 0;

function initHeroCarousel() {
  const heroSection = document.getElementById('heroCarousel');
  if (!heroSection) return;

  const slides = heroSection.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  // Start Autoplay
  startHeroAutoplay();

  // Desktop Hover Pause
  heroSection.addEventListener('mouseenter', () => {
    isHeroPaused = true;
    stopHeroAutoplay();
  });

  heroSection.addEventListener('mouseleave', () => {
    isHeroPaused = false;
    startHeroAutoplay();
  });

  // Mobile Touch Swipe Handling
  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopHeroAutoplay();
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleHeroSwipe();
    resumeHeroAutoplayAfterDelay();
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      heroCarouselPrev();
    } else if (e.key === 'ArrowRight') {
      heroCarouselNext();
    }
  });
}

function handleHeroSwipe() {
  const swipeDist = touchStartX - touchEndX;
  if (swipeDist > 40) {
    heroCarouselNext();
  } else if (swipeDist < -40) {
    heroCarouselPrev();
  }
}

function goToHeroSlide(index) {
  const heroSection = document.getElementById('heroCarousel');
  if (!heroSection) return;
  const slides = heroSection.querySelectorAll('.hero-slide');
  const dots = heroSection.querySelectorAll('.hero-dot');
  const indicatorBars = document.querySelectorAll('.hero-indicators-bar');
  const total = slides.length;
  if (total === 0) return;

  let target = index;
  if (target < 0) target = total - 1;
  if (target >= total) target = 0;

  currentHeroSlide = target;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentHeroSlide);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentHeroSlide);
  });

  indicatorBars.forEach((bar) => {
    const indicators = bar.querySelectorAll('.hero-num-indicator');
    indicators.forEach((ind, idx) => {
      ind.classList.toggle('active', idx === currentHeroSlide);
    });
  });

  resumeHeroAutoplayAfterDelay();
}

function heroCarouselNext() {
  goToHeroSlide(currentHeroSlide + 1);
}

function heroCarouselPrev() {
  goToHeroSlide(currentHeroSlide - 1);
}

function startHeroAutoplay() {
  stopHeroAutoplay();
  heroAutoplayTimer = setInterval(() => {
    if (!isHeroPaused) {
      heroCarouselNext();
    }
  }, 4500);
}

function stopHeroAutoplay() {
  if (heroAutoplayTimer) {
    clearInterval(heroAutoplayTimer);
    heroAutoplayTimer = null;
  }
}

function resumeHeroAutoplayAfterDelay() {
  stopHeroAutoplay();
  if (heroResumeTimer) clearTimeout(heroResumeTimer);
  heroResumeTimer = setTimeout(() => {
    startHeroAutoplay();
  }, 5000);
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroCarousel);
} else {
  initHeroCarousel();
}
