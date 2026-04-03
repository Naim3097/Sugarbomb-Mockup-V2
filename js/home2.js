/* ============================================================
   HOME 2 — Scroll Reveal & Interactions
   ============================================================ */
(function() {
  'use strict';

  // Scroll reveal for .h2-fade elements
  function initH2ScrollReveal() {
    var els = document.querySelectorAll('.h2-fade');
    if (!els.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(function(el) { observer.observe(el); });
  }

  // Parallax on hero video (subtle)
  function initH2HeroParallax() {
    var video = document.querySelector('.h2-hero__video');
    if (!video) return;

    window.addEventListener('scroll', function() {
      var scrollY = window.pageYOffset;
      if (scrollY < window.innerHeight) {
        video.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.3) + 'px)';
      }
    }, { passive: true });
  }

  // Product track drag scroll on desktop
  function initH2ProductScroll() {
    var track = document.getElementById('h2ProductTrack');
    if (!track) return;

    var isDown = false;
    var startX;
    var scrollLeft;

    track.addEventListener('mousedown', function(e) {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', function() {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mouseup', function() {
      isDown = false;
      track.style.cursor = '';
    });

    track.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 2;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // Nav background on scroll
  function initH2NavScroll() {
    var nav = document.querySelector('.nav--h2');
    if (!nav) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 80) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }, { passive: true });
  }

  // Init all on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    initH2ScrollReveal();
    initH2HeroParallax();
    initH2ProductScroll();
    initH2NavScroll();
  });
})();
