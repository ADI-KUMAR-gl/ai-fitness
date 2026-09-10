/**
 * Apex AI Fitness - Main Application Interactions & UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPricingToggle();
  initScheduleFilter();
  initMuscleExplorer();
  initModals();
  initFaqAccordion();
});

/* =========================================================================
   1. Responsive Navbar & Mobile Drawer
   ========================================================================= */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
      document.body.style.overflow = 'hidden';
    });

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('translate-x-full');
        document.body.style.overflow = '';
      });
    });
  }

  // Header background on scroll
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('bg-black/90', 'backdrop-blur-lg', 'border-b', 'border-white/10');
      header?.classList.remove('bg-transparent');
    } else {
      header?.classList.remove('bg-black/90', 'backdrop-blur-lg', 'border-b', 'border-white/10');
      header?.classList.add('bg-transparent');
    }
  });
}

/* =========================================================================
   2. Pricing Tier Billing Toggle (Monthly vs Annual -20%)
   ========================================================================= */
function initPricingToggle() {
  const billingToggle = document.getElementById('billingToggle');
  if (!billingToggle) return;

  const basicPrice = document.getElementById('priceBasic');
  const proPrice = document.getElementById('pricePro');
  const elitePrice = document.getElementById('priceElite');
  const billingCycleLabels = document.querySelectorAll('.billing-cycle-label');

  billingToggle.addEventListener('change', (e) => {
    const isAnnual = e.target.checked;

    if (isAnnual) {
      if (basicPrice) basicPrice.textContent = '$24';
      if (proPrice) proPrice.textContent = '$49';
      if (elitePrice) elitePrice.textContent = '$79';
      billingCycleLabels.forEach(el => el.textContent = '/mo (billed annually)');
    } else {
      if (basicPrice) basicPrice.textContent = '$29';
      if (proPrice) proPrice.textContent = '$59';
      if (elitePrice) elitePrice.textContent = '$99';
      billingCycleLabels.forEach(el => el.textContent = '/mo (billed monthly)');
    }
  });
}

/* =========================================================================
   3. Class Schedule Filtering System
   ========================================================================= */
function initScheduleFilter() {
  const dayButtons = document.querySelectorAll('[data-schedule-day]');
  const scheduleCards = document.querySelectorAll('[data-class-day]');

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedDay = btn.getAttribute('data-schedule-day');

      // Update active button state
      dayButtons.forEach(b => {
        b.classList.remove('bg-lime-400', 'text-black', 'font-bold');
        b.classList.add('bg-gray-900', 'text-gray-400');
      });
      btn.classList.add('bg-lime-400', 'text-black', 'font-bold');
      btn.classList.remove('bg-gray-900', 'text-gray-400');

      // Filter classes
      scheduleCards.forEach(card => {
        const classDays = card.getAttribute('data-class-day').split(' ');
        if (selectedDay === 'all' || classDays.includes(selectedDay)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* =========================================================================
   4. Interactive Muscle Target Explorer
   ========================================================================= */
const muscleData = {
  chest: {
    title: 'Pectoralis Major & Minor (Chest)',
    description: 'Targeted horizontal pushing mechanics to build upper chest shelf density and overall pectoralis thickness.',
    compounds: ['Incline Barbell Bench Press', 'Weighted Chest Dips', 'Flat Dumbbell Press'],
    isolation: ['Low-to-High Cable Flyes', 'Pec Deck Flye'],
    hypertrophyZone: '8 - 12 Reps @ RPE 8-9 (3-0-1-0 tempo)',
    aiCue: 'Maintain slight scapular retraction and press in a slight inward arc to maximize peak pectoral contraction.'
  },
  back: {
    title: 'Latissimus Dorsi, Rhomboids & Traps',
    description: 'V-taper lat width combined with mid-back density for posture and supreme pulling power.',
    compounds: ['Deadlifts / Trap Bar Pulls', 'Weighted Pull-Ups', 'Pendlay Barbell Rows'],
    isolation: ['Single-Arm Lat Pulldown', 'Chest-Supported Kelso Shrugs', 'Straight-Arm Cable Pullover'],
    hypertrophyZone: '6 - 12 Reps @ RPE 8-9 (2-1-1-1 tempo)',
    aiCue: 'Lead the movement with your elbows and initiate with scapular depression before elbow flexion.'
  },
  legs: {
    title: 'Quadriceps, Hamstrings & Glutes',
    description: 'The foundation of human athletic power, vertical leap, and full-body metabolic output.',
    compounds: ['Barbell Back Squat', 'Romanian Deadlift (RDL)', 'Walking Lunges', 'Hack Squat'],
    isolation: ['Lying Leg Curls', 'Seated Leg Extensions', 'Tibialis Raises', 'Standing Calf Raise'],
    hypertrophyZone: '6 - 15 Reps @ RPE 8-9.5 (3-1-1-0 tempo)',
    aiCue: 'Achieve deep knee flexion with pelvis stabilized; avoid knee valgus (knees caving inward).'
  },
  shoulders: {
    title: 'Anterior, Lateral & Posterior Deltoids',
    description: 'Creates wide, capped shoulder aesthetics and protects the rotator cuff for pressing strength.',
    compounds: ['Seated Dumbbell Overhead Press', 'Standing Military Press', 'Arnold Press'],
    isolation: ['Cable Lateral Raises (behind body)', 'Face Pulls with External Rotation', 'Reverse Pec Deck'],
    hypertrophyZone: '10 - 20 Reps @ RPE 9-10 (2-0-1-1 tempo)',
    aiCue: 'For lateral delts, lead with the elbow and pull hands out wide rather than straight up.'
  },
  arms: {
    title: 'Biceps Brachii, Brachialis & Triceps',
    description: 'Balanced arm hypertrophy targeting all three tricep heads and both bicep heads for sleeve-filling power.',
    compounds: ['Close-Grip Bench Press', 'Weighted Neutral-Grip Chin-Ups', 'Tricep Parallel Bar Dips'],
    isolation: ['Incline Dumbbell Curl', 'Overhead Cable Tricep Extension', 'Preacher Curl', 'Rope Pushdown'],
    hypertrophyZone: '8 - 15 Reps @ RPE 8.5-9.5 (2-1-1-1 tempo)',
    aiCue: 'Lock upper arm in space to eliminate shoulder momentum and keep tension strictly on the target muscle.'
  },
  core: {
    title: 'Rectus Abdominis, Obliques & Transverse Core',
    description: '360-degree core bracing strength for heavy lifting injury resilience and chiselled abdominal definition.',
    compounds: ['Heavy Front Squats', 'Overhead Farmer Carries', 'Ab Wheel Rollouts'],
    isolation: ['Hanging Leg Raises', 'Cable Woodchoppers', 'Pallof Press'],
    hypertrophyZone: '12 - 20 Reps or 45s timed sets (Strict control)',
    aiCue: 'Focus on posterior pelvic tilt and active abdominal compression during the contracted peak.'
  }
};

function initMuscleExplorer() {
  const muscleBtns = document.querySelectorAll('[data-muscle]');
  const titleEl = document.getElementById('muscleDetailTitle');
  const descEl = document.getElementById('muscleDetailDesc');
  const compoundsEl = document.getElementById('muscleCompounds');
  const isolationEl = document.getElementById('muscleIsolation');
  const zoneEl = document.getElementById('muscleZone');
  const cueEl = document.getElementById('muscleAiCue');

  if (!muscleBtns.length) return;

  function setMuscle(key) {
    const data = muscleData[key];
    if (!data) return;

    muscleBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-muscle') === key;
      if (isSelected) {
        btn.classList.add('border-lime-400', 'bg-lime-400/10', 'text-lime-400');
        btn.classList.remove('border-white/10', 'bg-black/40', 'text-gray-400');
      } else {
        btn.classList.remove('border-lime-400', 'bg-lime-400/10', 'text-lime-400');
        btn.classList.add('border-white/10', 'bg-black/40', 'text-gray-400');
      }
    });

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (zoneEl) zoneEl.textContent = data.hypertrophyZone;
    if (cueEl) cueEl.textContent = data.aiCue;

    if (compoundsEl) {
      compoundsEl.innerHTML = data.compounds.map(c => `<span class="px-2.5 py-1 rounded-md bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs">${c}</span>`).join('');
    }
    if (isolationEl) {
      isolationEl.innerHTML = data.isolation.map(i => `<span class="px-2.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs">${i}</span>`).join('');
    }
  }

  muscleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setMuscle(btn.getAttribute('data-muscle'));
    });
  });

  // Default select chest
  setMuscle('chest');
}

/* =========================================================================
   5. Modals & Booking Dialogs
   ========================================================================= */
function initModals() {
  const vipPassModal = document.getElementById('vipPassModal');
  const openPassBtns = document.querySelectorAll('.open-pass-modal');
  const closePassBtn = document.getElementById('closePassModalBtn');
  const passForm = document.getElementById('vipPassForm');

  // Open VIP Pass
  openPassBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (vipPassModal) {
        vipPassModal.classList.remove('hidden');
        vipPassModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close VIP Pass
  if (closePassBtn && vipPassModal) {
    closePassBtn.addEventListener('click', () => {
      vipPassModal.classList.add('hidden');
      vipPassModal.classList.remove('flex');
      document.body.style.overflow = '';
    });
  }

  // Backdrop click to close
  if (vipPassModal) {
    vipPassModal.addEventListener('click', (e) => {
      if (e.target === vipPassModal) {
        vipPassModal.classList.add('hidden');
        vipPassModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // VIP Pass Form Submission
  if (passForm) {
    passForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('passName')?.value || 'Athlete';
      vipPassModal.classList.add('hidden');
      vipPassModal.classList.remove('flex');
      document.body.style.overflow = '';
      passForm.reset();

      showToast(`Welcome ${name}!`, 'Your 1-Day VIP Pass with full AI Motion Coach access has been confirmed. Check your email for your digital entry pass code!', 'success');
    });
  }

  // Book Class Spot buttons
  const bookClassBtns = document.querySelectorAll('.book-class-btn');
  bookClassBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const className = e.target.closest('[data-class-title]')?.getAttribute('data-class-title') || 'AI High-Performance Class';
      showToast('Spot Reserved!', `You are booked for ${className}. Arrive 10 minutes early with workout gear!`, 'success');
    });
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('Subscribed!', 'You are on the list for weekly AI workout breakdowns, scientific nutrition guides, and member discounts.', 'success');
    });
  }
}

/* =========================================================================
   6. FAQ Accordion
   ========================================================================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('[data-faq-item]');
  faqItems.forEach(item => {
    const trigger = item.querySelector('[data-faq-trigger]');
    const content = item.querySelector('[data-faq-content]');
    const icon = item.querySelector('[data-faq-icon]');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all other faqs
        faqItems.forEach(other => {
          other.querySelector('[data-faq-content]')?.classList.add('hidden');
          const otherIcon = other.querySelector('[data-faq-icon]');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

/* =========================================================================
   7. Toast Notification Utility
   ========================================================================= */
function showToast(title, message, type = 'success') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto glass-card border border-lime-400/40 rounded-xl p-4 shadow-2xl flex items-start gap-3 transform translate-y-10 opacity-0 transition-all duration-300';
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0">
      <i data-lucide="check-circle" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <h5 class="text-sm font-bold text-white">${title}</h5>
      <p class="text-xs text-gray-300 mt-0.5 leading-relaxed">${message}</p>
    </div>
    <button class="text-gray-400 hover:text-white transition" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  // Slide in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  // Auto dismiss after 5s
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
