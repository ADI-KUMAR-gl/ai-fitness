/**
 * =========================================================================
 * APEX AI FITNESS — ANIME.JS PHYSICS & TELEMETRY ENGINE
 * =========================================================================
 * Clinical Bio-Mechanics Animation Engine:
 * 1. Staggered Cascading Entrances for Dashboard Cards
 * 2. Smooth Anti-Gravity Floating Loop (Sequenced AFTER entrance completes)
 * 3. MVT Linear Regression SVG Path Tracing (stroke-dashoffset)
 * 4. Circular Progress Dials (CNS Readiness 92% & 7-Day Adherence 98.4%)
 * 5. Number Counting Telemetry Interpolations
 * 6. Spring Physics for Buttons, Modals, and Interactive Elements
 * 7. Dynamic Periodization Mesocycle Simulator
 * =========================================================================
 */

class AnimePhysicsEngine {
  constructor() {
    this.floatAnimation = null;
    this.init();
  }

  init() {
    if (typeof anime === 'undefined') {
      console.warn('Anime.js CDN pending. Retrying in 50ms...');
      setTimeout(() => this.init(), 50);
      return;
    }

    // Sequence animations properly to prevent transform race conditions
    this.initStaggeredEntrances();
    this.initMvtChartAnimation();
    this.initCircularDials();
    this.initNumberCounting();
    this.bindSpringPhysics();
    this.bindPeriodizationSimulator();
    this.bindMobileMenu();
  }

  /**
   * 1. Staggered Entrance Animation
   * Animates cards from bottom with staggered delays.
   * Once complete, kicks off the continuous Anti-Gravity Float!
   */
  initStaggeredEntrances() {
    const cards = document.querySelectorAll('.dashboard-card');
    if (!cards.length) return;

    anime({
      targets: '.dashboard-card',
      translateY: [28, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 80 }),
      easing: 'easeOutCubic',
      duration: 750,
      complete: () => {
        // Safe to start continuous anti-gravity floating now that entrance finished
        this.startAntiGravityFloat();
      }
    });
  }

  /**
   * 2. Anti-Gravity Float Loop
   * Gentle continuous floating with out-of-phase sine-wave easing
   */
  startAntiGravityFloat() {
    this.floatAnimation = anime({
      targets: '.anti-gravity-card',
      translateY: (el, i) => (i % 2 === 0 ? [-4, 5] : [-6, 3]),
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: (el, i) => 3800 + (i * 450),
      delay: (el, i) => i * 200
    });
  }

  /**
   * 3. MVT Linear Regression SVG Path Animation
   * Traces the linear regression line and pops data keypoints
   */
  initMvtChartAnimation() {
    const mvtLine = document.getElementById('mvtRegressionLine');
    if (!mvtLine) return;

    // Total geometric length of line (70, 50) to (450, 230) ~ 420px
    const lineLength = 430;
    mvtLine.style.strokeDasharray = lineLength;
    mvtLine.style.strokeDashoffset = lineLength;

    anime({
      targets: '#mvtRegressionLine',
      strokeDashoffset: [lineLength, 0],
      easing: 'easeInOutQuart',
      duration: 1800,
      delay: 350
    });

    // MVT Cutoff dashed line reveal
    anime({
      targets: '#mvtThresholdLine',
      opacity: [0, 0.85],
      duration: 800,
      delay: 1100,
      easing: 'linear'
    });

    // Data points along regression line
    anime({
      targets: '.mvt-point',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(140, { start: 800 }),
      easing: 'spring(1, 80, 12, 0)'
    });
  }

  /**
   * 4. Biomechanical Circular Dials (CNS & Adherence)
   * Stroke-dashoffset animation on circular SVG meters
   */
  initCircularDials() {
    // Circumference for r=44: 2 * PI * 44 = 276.46
    const circumference = 276.46;

    // CNS Dial (92% => strokeDashoffset = 276.46 * (1 - 0.92) = 22.11)
    const cnsCircle = document.getElementById('cnsCircleProgress');
    if (cnsCircle) {
      cnsCircle.style.strokeDasharray = circumference;
      cnsCircle.style.strokeDashoffset = circumference;

      anime({
        targets: '#cnsCircleProgress',
        strokeDashoffset: [circumference, circumference * 0.08],
        easing: 'easeInOutCubic',
        duration: 2000,
        delay: 450
      });
    }

    // Adherence Dial (98.4% => strokeDashoffset = 276.46 * (1 - 0.984) = 4.42)
    const adhCircle = document.getElementById('adherenceCircleProgress');
    if (adhCircle) {
      adhCircle.style.strokeDasharray = circumference;
      adhCircle.style.strokeDashoffset = circumference;

      anime({
        targets: '#adherenceCircleProgress',
        strokeDashoffset: [circumference, circumference * 0.016],
        easing: 'easeInOutCubic',
        duration: 2200,
        delay: 600
      });
    }
  }

  /**
   * 5. Number Counting Telemetry
   * Interpolates static dashboard telemetry indicators
   */
  initNumberCounting() {
    // Minimum Velocity Threshold (0.00 -> 0.18 m/s)
    const mvtEl = document.getElementById('telemetryMvtVal');
    if (mvtEl) {
      const obj = { val: 0.0 };
      anime({
        targets: obj,
        val: 0.18,
        round: 100,
        easing: 'easeOutQuart',
        duration: 1600,
        delay: 500,
        update: () => {
          mvtEl.textContent = `${obj.val.toFixed(2)} m/s`;
        }
      });
    }

    // CNS Fatigue Baseline % (0 -> 92%)
    const cnsEl = document.getElementById('telemetryCnsScore');
    if (cnsEl) {
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: 92,
        round: 1,
        easing: 'easeOutExpo',
        duration: 1900,
        delay: 400,
        update: () => {
          cnsEl.textContent = `${Math.round(obj.val)}%`;
        }
      });
    }

    // 7-Day Adherence % (0 -> 98.4%)
    const adhEl = document.getElementById('telemetryAdherenceScore');
    if (adhEl) {
      const obj = { val: 0.0 };
      anime({
        targets: obj,
        val: 98.4,
        round: 10,
        easing: 'easeOutQuart',
        duration: 2000,
        delay: 550,
        update: () => {
          adhEl.textContent = `${obj.val.toFixed(1)}%`;
        }
      });
    }
  }

  /**
   * 6. Spring Physics on Buttons & Modal
   */
  bindSpringPhysics() {
    // Spring hover/click on interactive buttons
    const springBtns = document.querySelectorAll('.spring-btn');
    springBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          scale: 1.04,
          duration: 250,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          scale: 1.0,
          duration: 250,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
      btn.addEventListener('mousedown', () => {
        anime({
          targets: btn,
          scale: 0.96,
          duration: 120,
          easing: 'easeOutQuad'
        });
      });
      btn.addEventListener('mouseup', () => {
        anime({
          targets: btn,
          scale: 1.04,
          duration: 200,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
    });

    // Baseline Modal Spring Physics
    const baselineModal = document.getElementById('baselineModal');
    const openBaselineBtns = document.querySelectorAll('.open-baseline-btn');
    const closeBaselineBtn = document.getElementById('closeBaselineModalBtn');
    const modalCard = document.getElementById('baselineModalCard');

    if (baselineModal && modalCard) {
      openBaselineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          baselineModal.classList.remove('hidden');
          baselineModal.classList.add('flex');
          document.body.style.overflow = 'hidden';

          anime({
            targets: modalCard,
            scale: [0.84, 1],
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 550,
            easing: 'spring(1, 80, 10, 0)'
          });
        });
      });

      const closeModal = () => {
        anime({
          targets: modalCard,
          scale: [1, 0.86],
          opacity: [1, 0],
          duration: 200,
          easing: 'easeInQuad',
          complete: () => {
            baselineModal.classList.add('hidden');
            baselineModal.classList.remove('flex');
            document.body.style.overflow = '';
          }
        });
      };

      if (closeBaselineBtn) closeBaselineBtn.addEventListener('click', closeModal);
      baselineModal.addEventListener('click', (e) => {
        if (e.target === baselineModal) closeModal();
      });

      // Form submission
      const form = document.getElementById('baselineInitForm');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          closeModal();
          this.showToast(
            'Baseline Initialized',
            'Optical camera tracking calibrated at 60 FPS. Minimum Velocity Threshold (MVT) calculated at 0.18 m/s.',
            'laser'
          );
        });
      }
    }
  }

  /**
   * 7. Periodization Timeline Interactive Simulator
   */
  bindPeriodizationSimulator() {
    const fatigueSelector = document.getElementById('periodizationFatigueSelect');
    const adaptedDays = document.querySelectorAll('.day-pill-future-adapted');
    const adaptationNotice = document.getElementById('periodizationNotice');

    if (fatigueSelector) {
      fatigueSelector.addEventListener('change', (e) => {
        const mode = e.target.value;

        anime({
          targets: adaptedDays,
          scale: [0.94, 1],
          opacity: [0.6, 1],
          delay: anime.stagger(50),
          easing: 'spring(1, 85, 12, 0)'
        });

        if (mode === 'high_fatigue') {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-hyper-amber font-bold">⚡ VELOCITY FATIGUE DETECTED (>20% loss):</span>
              Mesocycle auto-deloading Thursday volume by -25% and shifting Friday to CNS Neural Recovery.
            `;
            adaptationNotice.className = 'mt-4 p-3.5 rounded-xl bg-hyper-amber/10 border border-hyper-amber/30 text-xs text-amber-200 leading-relaxed font-mono';
          }
        } else if (mode === 'super_comp') {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-bio-green font-bold">🚀 CNS PEAK READINESS DETECTED:</span>
              Bar speed exceeding velocity curve by +0.08 m/s. Mesocycle advancing Friday loading target by +2.5kg.
            `;
            adaptationNotice.className = 'mt-4 p-3.5 rounded-xl bg-bio-green/10 border border-bio-green/30 text-xs text-emerald-200 leading-relaxed font-mono';
          }
        } else {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-laser-blue font-bold">🎯 TARGET VELOCITY MAINTAINED:</span>
              Periodization microcycle progressing normally along planned linear load increments.
            `;
            adaptationNotice.className = 'mt-4 p-3.5 rounded-xl bg-laser-blue/10 border border-laser-blue/30 text-xs text-cyan-200 leading-relaxed font-mono';
          }
        }
      });
    }
  }

  /**
   * 8. Mobile Navigation Drawer
   */
  bindMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileDrawerMenu');
    const closeBtn = document.getElementById('closeMobileDrawer');

    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        document.body.style.overflow = 'hidden';

        anime({
          targets: '#mobileDrawerContent',
          translateX: ['100%', '0%'],
          duration: 350,
          easing: 'easeOutCubic'
        });
      });

      const closeDrawer = () => {
        anime({
          targets: '#mobileDrawerContent',
          translateX: ['0%', '100%'],
          duration: 250,
          easing: 'easeInQuad',
          complete: () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.style.overflow = '';
          }
        });
      };

      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeDrawer();
      });

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });
    }
  }

  /**
   * High-Tech Toast Notification Utility
   */
  showToast(title, message, theme = 'laser') {
    let container = document.getElementById('toastNotificationContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastNotificationContainer';
      container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderColor = theme === 'bio' ? 'border-bio-green/40' : 'border-laser-blue/40';
    const iconColor = theme === 'bio' ? 'text-bio-green' : 'text-laser-blue';

    toast.className = `pointer-events-auto twilight-glass-card ${borderColor} rounded-2xl p-4 shadow-2xl flex items-start gap-3 transform translate-y-8 opacity-0 border`;
    toast.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-white/10 ${iconColor} flex items-center justify-center shrink-0">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <h5 class="text-xs font-mono font-bold text-white uppercase tracking-wider">${title}</h5>
        <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white transition" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    anime({
      targets: toast,
      translateY: [25, 0],
      opacity: [0, 1],
      duration: 400,
      easing: 'spring(1, 80, 12, 0)'
    });

    setTimeout(() => {
      anime({
        targets: toast,
        translateY: [0, 20],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => toast.remove()
      });
    }, 5000);
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
