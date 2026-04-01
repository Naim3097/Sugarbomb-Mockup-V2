/* ============================================================
   SUGARBOMB — Main JavaScript
   Nav, Scroll Animations, Tabs, Cart, Accordion, Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initNav();
  initNavHover();
  initTextReveal();
  initScrollAnimations();
  initParallax();
  initTilt();
  initMagnetic();
  initScrollFill();
  initMarqueeScroll();
  initTabs();
  initAccordion();
  initCart();
  initQtyControls();
  initGallery();
  initSalesCounter();
  initFilterPills();
  initSmoothAnchors();
  initButtonRipple();
  initImageReveal();
  initCountUp();
});

/* --- Page Load Transition --- */
function initPageLoad() {
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });
}

/* --- Navigation (smart hide/show + mobile) --- */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');
  const backdrop = document.querySelector('.nav__mobile-backdrop');

  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        nav.classList.toggle('scrolled', currentY > 60);

        // Hide nav on scroll down, show on scroll up (only after 300px)
        if (currentY > 300) {
          if (currentY > lastScrollY + 5) {
            nav.classList.add('nav--hidden');
          } else if (currentY < lastScrollY - 5) {
            nav.classList.remove('nav--hidden');
          }
        } else {
          nav.classList.remove('nav--hidden');
        }

        lastScrollY = currentY;
        ticking = false;
      });
      ticking = true;
    }
  }

  if (nav) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function openMobileNav() {
    mobileNav.classList.add('open');
    if (backdrop) backdrop.classList.add('visible');
    document.body.classList.add('nav-open');
    hamburger.classList.add('active');
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
    document.body.classList.remove('nav-open');
    hamburger.classList.remove('active');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
  }

  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', closeMobileNav);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileNav);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }
}

/* --- Scroll Animations (staggered + multi-type) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Parallax on Hero --- */
function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
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
  showToast('Added to cart');
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

/* --- Toast Notification --- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('visible'), 2400);
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

/* --- Product Gallery (crossfade) --- */
function initGallery() {
  document.querySelectorAll('.pdp__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImage = document.querySelector('.pdp__main-image img');
      const src = thumb.querySelector('img')?.dataset.full || thumb.querySelector('img')?.src;
      if (mainImage && src) {
        mainImage.style.opacity = '0';
        setTimeout(() => {
          mainImage.src = src;
          mainImage.style.opacity = '1';
        }, 200);
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

/* --- Filter Pills --- */
function initFilterPills() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* --- Smooth Anchor Scrolling --- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Button Ripple Effect --- */
function initButtonRipple() {
  document.querySelectorAll('.btn--primary, .btn--secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* --- Image Lazy Reveal --- */
function initImageReveal() {
  const images = document.querySelectorAll('.product-card__image img, .collection-card__image, .feature-card__image img, .visual-section img');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('img-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  images.forEach(img => observer.observe(img));
}

/* --- Nav Link Hover (text slide effect) --- */
function initNavHover() {
  document.querySelectorAll('.nav__link').forEach(link => {
    const text = link.textContent.trim();
    if (link.querySelector('span')) return;
    link.setAttribute('data-text', text);
    link.innerHTML = '<span>' + text + '</span>';
  });
}

/* --- Text Split & Reveal (word-by-word clip animation) --- */
function initTextReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.innerHTML = words.map((word, i) =>
      '<span class="word-wrap"><span class="word" style="transition-delay:' + (i * 0.045) + 's">' + word + '</span></span>'
    ).join(' ');
    el.classList.add('reveal-ready');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* --- 3D Tilt on Cards --- */
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * 10;
      const tiltY = (x - 0.5) * -10;
      card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale3d(1.02,1.02,1.02)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s var(--ease-spring)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* --- Magnetic Effect on Buttons --- */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.25) + 'px,' + (y * 0.25) + 'px)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s var(--ease-spring)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}

/* --- Scroll-Linked Progress Fill --- */
function initScrollFill() {
  const fills = document.querySelectorAll('.scroll-fill');
  if (!fills.length) return;

  let ticking = false;

  function update() {
    fills.forEach(fill => {
      const parent = fill.closest('section') || fill.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (rect.height + viewH * 0.3)));
      fill.style.setProperty('--fill', (progress * 100) + '%');
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update();
}

/* --- Marquee / Auto-Scroll --- */
function initMarqueeScroll() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    const inner = track.querySelector('.marquee-inner');
    if (!inner) return;
    // Clone children for infinite loop
    const clone = inner.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

/* --- Counter Animation --- */
function initCountUp() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (!isNaN(target)) animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el, target) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}
