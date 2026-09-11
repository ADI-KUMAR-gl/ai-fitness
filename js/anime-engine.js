/**
 * =========================================================================
 * APEX AI FITNESS — ANIME.JS PHYSICS & TELEMETRY ENGINE
 * =========================================================================
 * Luminous Opal & Prismatic Neon Animations:
 * 1. Staggered Cascading Entrances for Dashboard & Lab Cards
 * 2. Continuous Anti-Gravity Floating Loop
 * 3. Dynamic Number Interpolation for Telemetry Counters
 * 4. Spring Physics for Buttons & Interactive Controls
 * 5. Automatic Active Page Navigation Indicator
 * 6. Responsive Mobile Navigation Menu
 * =========================================================================
 */

class AnimePhysicsEngine {
  constructor() {
    this.floatAnimation = null;
    this.init();
  }

  init() {
    if (typeof anime === 'undefined') {
      console.warn('Anime.js pending. Retrying in 50ms...');
      setTimeout(() => this.init(), 50);
      return;
    }

    this.initStaggeredEntrances();
    this.initNumberCounting();
    this.bindSpringPhysics();
    this.bindActiveNavLinks();
    this.bindMobileMenu();
  }

  initStaggeredEntrances() {
    const cards = document.querySelectorAll('.dashboard-card');
    if (!cards.length) return;

    anime({
      targets: '.dashboard-card',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(90, { start: 60 }),
      easing: 'easeOutCubic',
      duration: 700,
      complete: () => {
        this.startAntiGravityFloat();
      }
    });
  }

  startAntiGravityFloat() {
    const floatCards = document.querySelectorAll('.anti-gravity-card');
    if (!floatCards.length) return;

    this.floatAnimation = anime({
      targets: '.anti-gravity-card',
      translateY: (el, i) => (i % 2 === 0 ? [-3, 4] : [-5, 3]),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: (el, i) => 3600 + (i * 400),
      delay: (el, i) => i * 180
    });
  }

  initNumberCounting() {
    const counters = document.querySelectorAll('[data-counter-target]');
    counters.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter-target'));
      const isDecimal = el.getAttribute('data-counter-decimal') === 'true';

      const obj = { val: 0 };
      anime({
        targets: obj,
        val: target,
        round: isDecimal ? 10 : 1,
        easing: 'easeOutQuart',
        duration: 1800,
        update: () => {
          el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
        }
      });
    });
  }

  bindSpringPhysics() {
    const buttons = document.querySelectorAll('button:not([disabled]), .spring-press');
    buttons.forEach(btn => {
      btn.addEventListener('mousedown', () => {
        anime({
          targets: btn,
          scale: 0.96,
          duration: 120,
          easing: 'easeOutQuad'
        });
      });

      const release = () => {
        anime({
          targets: btn,
          scale: 1,
          duration: 250,
          easing: 'easeOutElastic(1, .6)'
        });
      };

      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });
  }

  bindActiveNavLinks() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('[data-nav-link]');

    navLinks.forEach(link => {
      const href = link.getAttribute('href').toLowerCase();
      // Match file name or clean url
      if (
        (currentPath.endsWith(href) && href !== 'index.html') ||
        (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/') || currentPath.endsWith('index.html'))) ||
        (href.includes('dashboard') && currentPath.includes('dashboard')) ||
        (href.includes('wearables') && currentPath.includes('wearables')) ||
        (href.includes('analytics') && currentPath.includes('analytics')) ||
        (href.includes('periodization') && currentPath.includes('periodization'))
      ) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });
  }

  bindMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileNavDrawer');
    const closeBtn = document.getElementById('mobileNavClose');

    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        anime({
          targets: mobileMenu,
          opacity: [0, 1],
          translateX: [40, 0],
          easing: 'easeOutQuad',
          duration: 300
        });
      });
    }

    if (closeBtn && mobileMenu) {
      closeBtn.addEventListener('click', () => {
        anime({
          targets: mobileMenu,
          opacity: [1, 0],
          translateX: [0, 40],
          easing: 'easeInQuad',
          duration: 250,
          complete: () => mobileMenu.classList.add('hidden')
        });
      });
    }
  }
}

// Global initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.animePhysicsInstance = new AnimePhysicsEngine();
  });
} else {
  window.animePhysicsInstance = new AnimePhysicsEngine();
}
