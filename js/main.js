/* ═══════════════════════════════════════════════
   Leanne Frank — Portfolio
   main.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ── Nav: sticky background on scroll ─────────── */
(function initNav() {
  const nav    = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile drawer toggle
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    // Close drawer when a link is clicked
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ── Project filter ────────────────────────────── */
(function initFilter() {
  window.filter = function (cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.card').forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);
    });
  };
})();

/* ── Scroll reveal ─────────────────────────────── */
(function initReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings for grid-like reveals
          const delay = entry.target.dataset.delay
            ? parseInt(entry.target.dataset.delay)
            : i * 60;
          setTimeout(() => entry.target.classList.add('in'), delay);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 60;
    obs.observe(el);
  });
})();

/* ── Animated counter for hero stats ──────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1200;
    const start    = performance.now();

    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => obs.observe(el));
})();

/* ── Keyboard accessibility: skip link ────────── */
(function initSkipLink() {
  const skip = document.querySelector('.skip-link');
  if (!skip) return;
  skip.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(skip.getAttribute('href'));
    if (target) {
      target.focus({ preventScroll: false });
    }
  });
})();