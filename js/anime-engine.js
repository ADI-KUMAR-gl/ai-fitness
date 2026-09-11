/**
 * =========================================================================
 * APEX AI FITNESS — ANIME.JS PHYSICS & TELEMETRY ENGINE
 * =========================================================================
 * Orchestrates:
 * 1. Anti-Gravity Float (Subtle sine-wave card levitation)
 * 2. Staggered Cascading Dashboard Entrances
 * 3. Real-Time Number Counting Interpolations
 * 4. Spring Physics Interactive Tactile Feedback
 * 5. MVT Linear Regression Line Drawing (stroke-dashoffset)
 * 6. Biomechanical Circular Dials (CNS Readiness & Adherence)
 * =========================================================================
 */

class AnimePhysicsEngine {
  constructor() {
    this.hasInitializedNumbers = false;
    this.init();
  }

  init() {
    if (typeof anime === 'undefined') {
      console.warn('Anime.js not detected. Retrying in 100ms...');
      setTimeout(() => this.init(), 100);
      return;
    }

    this.initAntiGravityFloat();
    this.initStaggeredEntrances();
    this.initMvtChartAnimation();
    this.initCircularDials();
    this.initNumberCounting();
    this.bindSpringPhysics();
    this.bindPeriodizationSimulator();
  }

  /**
   * 1. Anti-Gravity Float
   * Subtle continuous floating loop with out-of-phase sine-wave easing
   */
  initAntiGravityFloat() {
    anime({
      targets: '.anti-gravity-card',
      translateY: (el, i) => {
        // Vary float amplitude slightly per card for organic depth
        return i % 2 === 0 ? [-5, 6] : [-7, 4];
      },
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: (el, i) => 3600 + (i * 500),
      delay: (el, i) => i * 250
    });

    // Secondary subtle float for floating badge icons
    anime({
      targets: '.anti-gravity-badge',
      translateY: [-3, 3],
      rotateZ: [-2, 2],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
      duration: 2800,
      delay: (el, i) => i * 300
    });
  }

  /**
   * 2. Staggered Entrances
   * Bottom-to-top cascading reveal of dashboard components
   */
  initStaggeredEntrances() {
    anime({
      targets: '.stagger-reveal',
      translateY: [35, 0],
      opacity: [0, 1],
      delay: anime.stagger(110, { start: 150 }),
      easing: 'easeOutCubic',
      duration: 850
    });
  }

  /**
   * 3. Number Counting Telemetry
   * Animate numeric values from 0.00 to precision endpoints
   */
  initNumberCounting() {
    // Current Bar Velocity (0.00 -> 0.38 m/s)
    const velocityCounter = { val: 0.00 };
    const velocityEl = document.getElementById('telemetryBarVelocity');
    if (velocityEl) {
      anime({
        targets: velocityCounter,
        val: 0.38,
        round: 100, // 2 decimal places
        easing: 'easeOutExpo',
        duration: 1800,
        update: () => {
          velocityEl.textContent = velocityCounter.val.toFixed(2);
        }
      });
    }

    // Dynamic RPE Dial (0.0 -> 8.2)
    const rpeCounter = { val: 0.0 };
    const rpeEl = document.getElementById('telemetryRpeVal');
    const rpeFill = document.getElementById('telemetryRpeBarFill');
    if (rpeEl) {
      anime({
        targets: rpeCounter,
        val: 8.2,
        round: 10,
        easing: 'easeOutQuart',
        duration: 2000,
        delay: 300,
        update: () => {
          rpeEl.textContent = rpeCounter.val.toFixed(1);
          if (rpeFill) {
            // Scale RPE 0-10 to percentage
            const pct = Math.min(100, (rpeCounter.val / 10) * 100);
            rpeFill.style.width = `${pct}%`;
          }
        }
      });
    }

    // CNS Fatigue Baseline (0% -> 92%)
    const cnsCounter = { val: 0 };
    const cnsEl = document.getElementById('telemetryCnsScore');
    if (cnsEl) {
      anime({
        targets: cnsCounter,
        val: 92,
        round: 1,
        easing: 'easeOutExpo',
        duration: 2200,
        delay: 400,
        update: () => {
          cnsEl.textContent = `${Math.round(cnsCounter.val)}%`;
        }
      });
    }

    // 7-Day Adherence (0% -> 98.4%)
    const adhCounter = { val: 0.0 };
    const adhEl = document.getElementById('telemetryAdherenceScore');
    if (adhEl) {
      anime({
        targets: adhCounter,
        val: 98.4,
        round: 10,
        easing: 'easeOutQuart',
        duration: 2400,
        delay: 500,
        update: () => {
          adhEl.textContent = `${adhCounter.val.toFixed(1)}%`;
        }
      });
    }

    // Minimum Velocity Threshold (MVT: 0.18 m/s)
    const mvtCounter = { val: 0.00 };
    const mvtEl = document.getElementById('telemetryMvtVal');
    if (mvtEl) {
      anime({
        targets: mvtCounter,
        val: 0.18,
        round: 100,
        easing: 'easeOutQuart',
        duration: 1900,
        delay: 600,
        update: () => {
          mvtEl.textContent = `${mvtCounter.val.toFixed(2)} m/s`;
        }
      });
    }

    // Velocity Loss % (0% -> 22.8%)
    const lossCounter = { val: 0.0 };
    const lossEl = document.getElementById('telemetryVelLoss');
    if (lossEl) {
      anime({
        targets: lossCounter,
        val: 22.8,
        round: 10,
        easing: 'easeOutQuart',
        duration: 1700,
        delay: 450,
        update: () => {
          lossEl.textContent = `${lossCounter.val.toFixed(1)}%`;
        }
      });
    }
  }

  /**
   * 4. MVT Linear Regression SVG Path Animation
   * Uses Anime.js strokeDashoffset to trace Load vs. Velocity regression line
   */
  initMvtChartAnimation() {
    const mvtLine = document.getElementById('mvtRegressionLine');
    if (!mvtLine) return;

    // SVG Line from (x1=70, y1=50) to (x2=450, y2=230)
    // Total geometric length = sqrt((450-70)^2 + (230-50)^2) = sqrt(380^2 + 180^2) = 420.47
    const lineLength = 430;
    mvtLine.style.strokeDasharray = lineLength;
    mvtLine.style.strokeDashoffset = lineLength;

    anime({
      targets: '#mvtRegressionLine',
      strokeDashoffset: [lineLength, 0],
      easing: 'easeInOutQuart',
      duration: 2000,
      delay: 500
    });

    // Animate data points along the regression
    anime({
      targets: '.mvt-point',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(150, { start: 900 }),
      easing: 'spring(1, 80, 12, 0)'
    });

    // Animate MVT cutoff dashed line
    anime({
      targets: '#mvtThresholdLine',
      opacity: [0, 0.85],
      duration: 1200,
      delay: 1700,
      easing: 'linear'
    });
  }

  /**
   * 5. Biomechanical Circular Dials
   * Animated stroke-dashoffset on circular SVG meters
   */
  initCircularDials() {
    // Circumference = 2 * PI * r (r = 44) => 2 * 3.14159 * 44 = 276.46
    const circumference = 276.46;

    // CNS Dial (92% => offset = 276.46 * (1 - 0.92) = 22.11)
    const cnsCircle = document.getElementById('cnsCircleProgress');
    if (cnsCircle) {
      cnsCircle.style.strokeDasharray = circumference;
      cnsCircle.style.strokeDashoffset = circumference;

      anime({
        targets: '#cnsCircleProgress',
        strokeDashoffset: [circumference, circumference * (1 - 0.92)],
        easing: 'easeInOutCubic',
        duration: 2200,
        delay: 400
      });
    }

    // Adherence Dial (98.4% => offset = 276.46 * (1 - 0.984) = 4.42)
    const adhCircle = document.getElementById('adherenceCircleProgress');
    if (adhCircle) {
      adhCircle.style.strokeDasharray = circumference;
      adhCircle.style.strokeDashoffset = circumference;

      anime({
        targets: '#adherenceCircleProgress',
        strokeDashoffset: [circumference, circumference * (1 - 0.984)],
        easing: 'easeInOutCubic',
        duration: 2400,
        delay: 600
      });
    }
  }

  /**
   * 6. Spring Physics on Buttons & Modal
   */
  bindSpringPhysics() {
    // Spring physics on button hover / click
    const springBtns = document.querySelectorAll('.spring-btn');
    springBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          scale: 1.045,
          duration: 300,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          scale: 1.0,
          duration: 300,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
      btn.addEventListener('mousedown', () => {
        anime({
          targets: btn,
          scale: 0.96,
          duration: 150,
          easing: 'easeOutQuad'
        });
      });
      btn.addEventListener('mouseup', () => {
        anime({
          targets: btn,
          scale: 1.045,
          duration: 250,
          easing: 'spring(1, 90, 12, 0)'
        });
      });
    });

    // Initialize Baseline Modal with Spring Physics
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

          // Animate card with spring pop
          anime({
            targets: modalCard,
            scale: [0.82, 1],
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'spring(1, 80, 10, 0)'
          });
        });
      });

      const closeModal = () => {
        anime({
          targets: modalCard,
          scale: [1, 0.85],
          opacity: [1, 0],
          duration: 220,
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
    }
  }

  /**
   * 7. Periodization Timeline Interactive Simulator
   * Allows user to simulate velocity fatigue and see future mesocycle adapt in real-time
   */
  bindPeriodizationSimulator() {
    const fatigueSelector = document.getElementById('periodizationFatigueSelect');
    const adaptedDays = document.querySelectorAll('.day-pill-future-adapted');
    const adaptationNotice = document.getElementById('periodizationNotice');

    if (fatigueSelector) {
      fatigueSelector.addEventListener('change', (e) => {
        const mode = e.target.value;

        // Animate day pills with bounce
        anime({
          targets: adaptedDays,
          scale: [0.92, 1],
          opacity: [0.5, 1],
          delay: anime.stagger(60),
          easing: 'spring(1, 85, 12, 0)'
        });

        if (mode === 'high_fatigue') {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-hyper-amber font-bold">⚡ VELOCITY FATIGUE DETECTED (>20% loss):</span>
              Mesocycle auto-deloading Thursday volume by -25% and shifting Friday to CNS Neural Recovery.
            `;
            adaptationNotice.className = 'mt-4 p-3 rounded-xl bg-hyper-amber/10 border border-hyper-amber/30 text-xs text-amber-200 leading-relaxed';
          }
        } else if (mode === 'super_comp') {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-bio-green font-bold">🚀 CNS PEAK READINESS DETECTED:</span>
              Bar speed exceeding velocity curve by +0.08 m/s. Mesocycle advancing Friday loading target by +2.5kg.
            `;
            adaptationNotice.className = 'mt-4 p-3 rounded-xl bg-bio-green/10 border border-bio-green/30 text-xs text-emerald-200 leading-relaxed';
          }
        } else {
          if (adaptationNotice) {
            adaptationNotice.innerHTML = `
              <span class="text-laser-blue font-bold">🎯 TARGET VELOCITY MAINTAINED:</span>
              Periodization microcycle progressing normally along planned linear load increments.
            `;
            adaptationNotice.className = 'mt-4 p-3 rounded-xl bg-laser-blue/10 border border-laser-blue/30 text-xs text-cyan-200 leading-relaxed';
          }
        }
      });
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.animePhysicsInstance = new AnimePhysicsEngine();
});
