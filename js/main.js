/* ============================================================
   SUGARBOMB — Main JavaScript
   Nav, Scroll Animations, Tabs, Cart, Accordion
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initTabs();
  initAccordion();
  initCart();
  initQtyControls();
  initGallery();
  initSalesCounter();
});

/* --- Navigation --- */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* --- Tabs --- */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab');
    const parent = tabGroup.closest('.section') || tabGroup.parentElement;
    const contents = parent.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        contents.forEach(c => {
          c.classList.toggle('active', c.dataset.tabContent === target);
        });
      });
    });
  });
}

/* --- Accordion --- */
function initAccordion() {
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');

      // Close siblings
      item.parentElement.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('open'));

      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* --- Cart --- */
function initCart() {
  updateCartBadge();
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('sb_cart') || '[]');
  } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('sb_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === product.size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.nav__cart-count').forEach(badge => {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

function removeFromCart(id, size) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
  if (typeof renderCart === 'function') renderCart();
}

/* --- Quantity Controls --- */
function initQtyControls() {
  document.querySelectorAll('.qty-control').forEach(control => {
    const minusBtn = control.querySelector('.qty-minus');
    const plusBtn = control.querySelector('.qty-plus');
    const valueEl = control.querySelector('.qty-control__value');

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        let val = parseInt(valueEl.textContent);
        if (val > 1) {
          valueEl.textContent = val - 1;
          control.dispatchEvent(new CustomEvent('qtyChange', { detail: val - 1 }));
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        let val = parseInt(valueEl.textContent);
        valueEl.textContent = val + 1;
        control.dispatchEvent(new CustomEvent('qtyChange', { detail: val + 1 }));
      });
    }
  });
}

/* --- Product Gallery --- */
function initGallery() {
  document.querySelectorAll('.pdp__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImage = document.querySelector('.pdp__main-image img');
      const src = thumb.querySelector('img')?.dataset.full || thumb.querySelector('img')?.src;
      if (mainImage && src) {
        mainImage.src = src;
        document.querySelectorAll('.pdp__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });
}

/* --- Sales Counter --- */
function initSalesCounter() {
  const hoursEl = document.getElementById('counter-hours');
  const minutesEl = document.getElementById('counter-minutes');
  const secondsEl = document.getElementById('counter-seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  function updateCounter() {
    const now = new Date();
    hoursEl.textContent = String(now.getHours()).padStart(2, '0');
    minutesEl.textContent = String(now.getMinutes()).padStart(2, '0');
    secondsEl.textContent = String(now.getSeconds()).padStart(2, '0');
  }

  updateCounter();
  setInterval(updateCounter, 1000);
}
