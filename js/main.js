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
  initRotatingWords();
  initBrandStoryStars();
  initBrandStoryOrbit();
  initPopularProductsSlider();
  initBrandsCounter();
  initVideoStatCounters();
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
    // Preserve inline child elements (like rotating-word spans)
    const hasInlineChildren = el.querySelector('[data-words]');
    if (hasInlineChildren) {
      // Walk through childNodes, wrap text nodes word-by-word, keep element nodes intact
      let wordIndex = 0;
      const frag = document.createDocumentFragment();
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach(part => {
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else if (part.length > 0) {
              const wrap = document.createElement('span');
              wrap.className = 'word-wrap';
              const inner = document.createElement('span');
              inner.className = 'word';
              inner.style.transitionDelay = (wordIndex * 0.045) + 's';
              inner.textContent = part;
              wrap.appendChild(inner);
              frag.appendChild(wrap);
              wordIndex++;
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const wrap = document.createElement('span');
          wrap.className = 'word-wrap';
          const inner = document.createElement('span');
          inner.className = 'word';
          inner.style.transitionDelay = (wordIndex * 0.045) + 's';
          inner.appendChild(node.cloneNode(true));
          wrap.appendChild(inner);
          frag.appendChild(wrap);
          wordIndex++;
        }
      });
      el.innerHTML = '';
      el.appendChild(frag);
    } else {
      const text = el.textContent.trim();
      const words = text.split(/\s+/);
      el.innerHTML = words.map((word, i) =>
        '<span class="word-wrap"><span class="word" style="transition-delay:' + (i * 0.045) + 's">' + word + '</span></span>'
      ).join(' ');
    }
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

/* --- Rotating Hero Words --- */
function initRotatingWords() {
  const el = document.querySelector('[data-words]');
  if (!el) return;

  const words = el.dataset.words.split(',');
  let index = 0;

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400);
  }, 3000);
}

/* --- Brand Story Glittery Stars --- */
function initBrandStoryStars() {
  const canvas = document.querySelector('.brand-story__stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 60;

  function resize() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.008 + 0.003,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      const pulse = Math.sin(time * star.pulseSpeed + star.pulseOffset);
      const alpha = star.opacity + pulse * 0.25;
      const s = star.size + pulse * 0.4;

      ctx.save();
      ctx.globalAlpha = Math.max(0.05, Math.min(alpha, 0.85));
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = s * 4;

      ctx.beginPath();
      ctx.arc(star.x, star.y, s, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

/* --- Brand Story Orbiting Text --- */
function initBrandStoryOrbit() {
  const canvas = document.querySelector('.brand-story__orbit');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const SIZE = 520;
  canvas.width = SIZE;
  canvas.height = SIZE;

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const radius = 210;

  // Two orbiting words
  const words = [
    { text: 'Sugar', angle: 0, speed: 0.012, baseSpeed: 0.012, jitter: 0, distort: 0, trail: [] },
    { text: 'Bomb', angle: Math.PI, speed: 0.009, baseSpeed: 0.009, jitter: 0, distort: 0, trail: [] }
  ];

  const TRAIL_LENGTH = 12;
  let time = 0;

  function draw() {
    time++;
    ctx.clearRect(0, 0, SIZE, SIZE);

    words.forEach(function(w) {
      // Random speed variation (subtle surges)
      if (Math.random() < 0.02) {
        w.speed = w.baseSpeed + (Math.random() - 0.3) * 0.008;
      }
      w.speed += (w.baseSpeed - w.speed) * 0.01;

      // Jitter offset
      w.jitter = Math.sin(time * 0.07 + w.angle) * 3;
      // Text distortion (skew factor)
      w.distort = Math.sin(time * 0.04 + w.angle * 2) * 0.15;

      w.angle += w.speed;

      var x = cx + Math.cos(w.angle) * radius + w.jitter;
      var y = cy + Math.sin(w.angle) * radius + w.jitter * 0.6;

      // Store trail
      w.trail.push({ x: x, y: y, age: 0 });
      if (w.trail.length > TRAIL_LENGTH) w.trail.shift();

      // Draw jitter trail
      w.trail.forEach(function(t, i) {
        t.age++;
        var alpha = (1 - i / TRAIL_LENGTH) * 0.2;
        var jX = t.x + (Math.random() - 0.5) * 4;
        var jY = t.y + (Math.random() - 0.5) * 4;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = '700 ' + (18 - i * 0.5) + 'px Satoshi, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(w.text, jX, jY);
        ctx.restore();
      });

      // Draw main text with distortion
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, w.distort, w.distort * 0.5, 1, 0, 0);

      // Outer glow layers
      ctx.font = '800 22px Satoshi, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.9;
      ctx.fillText(w.text, 0, 0);

      // Second glow pass
      ctx.shadowColor = 'rgba(162, 29, 36, 0.5)';
      ctx.shadowBlur = 30;
      ctx.globalAlpha = 1;
      ctx.fillText(w.text, 0, 0);

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* --- Popular Products Slider --- */
function initPopularProductsSlider() {
  const section = document.querySelector('.popular-products');
  if (!section) return;

  const textSlides = section.querySelectorAll('.pp__slide-text');
  const imgSlides = section.querySelectorAll('.pp__img');
  const prevBtn = section.querySelector('.pp__arrow--prev');
  const nextBtn = section.querySelector('.pp__arrow--next');
  const progressBar = section.querySelector('.pp__progress-bar');
  const total = textSlides.length;
  let current = 0;
  let autoplayTimer;

  function goTo(index) {
    textSlides[current].classList.remove('pp__slide-text--active');
    imgSlides[current].classList.remove('pp__img--active');

    current = (index + total) % total;

    textSlides[current].classList.add('pp__slide-text--active');
    imgSlides[current].classList.add('pp__img--active');

    progressBar.style.width = ((current + 1) / total * 100) + '%';
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  startAutoplay();
}

/* --- Brands 1000+ Counter Animation --- */
function initBrandsCounter() {
  const el = document.querySelector('.brands-counter');
  if (!el) return;

  const target = parseInt(el.dataset.target, 10);
  const duration = 2500;
  let started = false;

  function pad(n) {
    var s = String(n);
    while (s.length < 4) s = '0' + s;
    return s;
  }

  function run() {
    if (started) return;
    started = true;

    const startTime = performance.now();
    const startScale = 1;
    const growScale = 1.08;

    function update(now) {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease-in (slow to fast): cubic
      const progress = rawProgress * rawProgress * rawProgress;

      const current = Math.floor(progress * target);
      el.textContent = pad(current);

      // Subtle scale growth during count
      const scale = startScale + (growScale - startScale) * rawProgress;
      el.style.transform = 'scale(' + scale + ')';

      if (rawProgress < 1) {
        requestAnimationFrame(update);
      } else {
        // Final state: show "1,000+" with pop effect
        el.textContent = '1,000+';
        el.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'scale(1.18)';

        setTimeout(function() {
          el.style.transform = 'scale(1)';
        }, 400);
      }
    }

    requestAnimationFrame(update);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        run();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(el);
}

/* --- Video Section Stat Counters --- */
function initVideoStatCounters() {
  var counters = document.querySelectorAll('.video-stat-counter');
  if (!counters.length) return;

  counters.forEach(function(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 2000;
    var started = false;

    function pad(n) {
      var s = String(n);
      while (s.length < 3) s = '0' + s;
      return s;
    }

    function run() {
      if (started) return;
      started = true;

      var startTime = performance.now();

      function update(now) {
        var elapsed = now - startTime;
        var rawProgress = Math.min(elapsed / duration, 1);
        var progress = rawProgress * rawProgress * rawProgress;

        var current = Math.floor(progress * target);
        el.textContent = pad(current);

        var scale = 1 + 0.08 * rawProgress;
        el.style.transform = 'scale(' + scale + ')';

        if (rawProgress < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerHTML = '100<span style="color:#a21d24">+</span>';
          el.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.style.transform = 'scale(1.18)';

          setTimeout(function() {
            el.style.transform = 'scale(1)';
          }, 400);
        }
      }

      requestAnimationFrame(update);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          run();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}
