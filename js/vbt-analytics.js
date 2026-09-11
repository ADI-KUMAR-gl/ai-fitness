/**
 * =========================================================================
 * APEX AI FITNESS — VELOCITY-BASED TRAINING (VBT) & MVT ANALYTICS ENGINE
 * =========================================================================
 * Clinical Bio-Mechanics Analytics:
 * - Linear Regression Modeling: v = m * Load + c
 * - Coefficient of Determination: R² goodness-of-fit
 * - Minimum Velocity Thresholds (MVT):
 *     • Barbell Back Squat: 0.18 m/s
 *     • Barbell Bench Press: 0.15 m/s
 *     • Conventional Deadlift: 0.12 m/s
 * - Submaximal Estimated 1RM (e1RM) Extrapolation
 * - Interactive SVG Load-Velocity Scatter & Regression Projection
 * - Intra-Set Velocity Loss & Neuromuscular Fatigue Index
 * =========================================================================
 */

class VBTAnalyticsEngine {
  constructor() {
    this.currentExercise = 'squat';

    // Exercise baseline datasets
    this.datasets = {
      squat: {
        name: 'Barbell Back Squat',
        mvt: 0.18,
        points: [
          { load: 80, velocity: 0.88 },
          { load: 100, velocity: 0.72 },
          { load: 120, velocity: 0.54 },
          { load: 135, velocity: 0.41 },
          { load: 145, velocity: 0.32 }
        ]
      },
      bench: {
        name: 'Barbell Bench Press',
        mvt: 0.15,
        points: [
          { load: 60, velocity: 0.85 },
          { load: 75, velocity: 0.68 },
          { load: 90, velocity: 0.51 },
          { load: 102, velocity: 0.38 },
          { load: 110, velocity: 0.28 }
        ]
      },
      deadlift: {
        name: 'Barbell Deadlift',
        mvt: 0.12,
        points: [
          { load: 100, velocity: 0.82 },
          { load: 130, velocity: 0.65 },
          { load: 155, velocity: 0.48 },
          { load: 175, velocity: 0.34 },
          { load: 190, velocity: 0.22 }
        ]
      }
    };

    this.svg = document.getElementById('vbtInteractiveSvg');
    this.init();
  }

  init() {
    this.bindEvents();
    this.calculateAndRender();
  }

  bindEvents() {
    // Exercise selector buttons
    const exerciseBtns = document.querySelectorAll('[data-vbt-exercise]');
    exerciseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ex = e.currentTarget.getAttribute('data-vbt-exercise');
        this.setExercise(ex);
      });
    });

    // Add point form
    const addPointBtn = document.getElementById('vbtAddPointBtn');
    if (addPointBtn) {
      addPointBtn.addEventListener('click', () => this.handleAddPoint());
    }

    // Reset default dataset
    const resetBtn = document.getElementById('vbtResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCurrentDataset());
    }

    // Window resize handler for SVG responsiveness
    window.addEventListener('resize', () => this.renderChart());
  }

  setExercise(exerciseKey) {
    if (!this.datasets[exerciseKey]) return;
    this.currentExercise = exerciseKey;

    // Update active tab buttons
    document.querySelectorAll('[data-vbt-exercise]').forEach(btn => {
      const isSelected = btn.getAttribute('data-vbt-exercise') === exerciseKey;
      if (isSelected) {
        btn.className = 'px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-sm shadow-sm flex items-center gap-2';
      } else {
        btn.className = 'px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-sm flex items-center gap-2';
      }
    });

    this.calculateAndRender();
  }

  handleAddPoint() {
    const loadInput = document.getElementById('vbtInputLoad');
    const velInput = document.getElementById('vbtInputVel');

    if (!loadInput || !velInput) return;
    const load = parseFloat(loadInput.value);
    const vel = parseFloat(velInput.value);

    if (isNaN(load) || isNaN(vel) || load <= 0 || vel <= 0 || vel > 2.0) {
      alert('Please enter a valid load (> 0 kg) and concentric velocity between 0.10 and 2.00 m/s.');
      return;
    }

    this.datasets[this.currentExercise].points.push({ load, velocity: vel });
    this.datasets[this.currentExercise].points.sort((a, b) => a.load - b.load);

    loadInput.value = '';
    velInput.value = '';

    this.calculateAndRender();
  }

  resetCurrentDataset() {
    if (this.currentExercise === 'squat') {
      this.datasets.squat.points = [
        { load: 80, velocity: 0.88 },
        { load: 100, velocity: 0.72 },
        { load: 120, velocity: 0.54 },
        { load: 135, velocity: 0.41 },
        { load: 145, velocity: 0.32 }
      ];
    } else if (this.currentExercise === 'bench') {
      this.datasets.bench.points = [
        { load: 60, velocity: 0.85 },
        { load: 75, velocity: 0.68 },
        { load: 90, velocity: 0.51 },
        { load: 102, velocity: 0.38 },
        { load: 110, velocity: 0.28 }
      ];
    } else {
      this.datasets.deadlift.points = [
        { load: 100, velocity: 0.82 },
        { load: 130, velocity: 0.65 },
        { load: 155, velocity: 0.48 },
        { load: 175, velocity: 0.34 },
        { load: 190, velocity: 0.22 }
      ];
    }
    this.calculateAndRender();
  }

  removePoint(index) {
    const pts = this.datasets[this.currentExercise].points;
    if (pts.length <= 2) {
      alert('At least 2 points are mathematically required to compute linear regression.');
      return;
    }
    pts.splice(index, 1);
    this.calculateAndRender();
  }

  // =========================================================================
  // MATHEMATICAL REGRESSION COMPUTATIONS
  // =========================================================================

  calculateRegression() {
    const data = this.datasets[this.currentExercise];
    const pts = data.points;
    const N = pts.length;

    if (N < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;

    pts.forEach(p => {
      sumX += p.load;
      sumY += p.velocity;
      sumXY += (p.load * p.velocity);
      sumXX += (p.load * p.load);
      sumYY += (p.velocity * p.velocity);
    });

    const meanX = sumX / N;
    const meanY = sumY / N;

    // Slope m: (N*sumXY - sumX*sumY) / (N*sumXX - sumX^2)
    const denom = (N * sumXX) - (sumX * sumX);
    if (Math.abs(denom) < 0.000001) return null;

    const slope = ((N * sumXY) - (sumX * sumY)) / denom;
    const intercept = meanY - (slope * meanX);

    // Coefficient of determination R²
    let ssTot = 0;
    let ssRes = 0;
    pts.forEach(p => {
      const predY = (slope * p.load) + intercept;
      ssTot += Math.pow(p.velocity - meanY, 2);
      ssRes += Math.pow(p.velocity - predY, 2);
    });

    const rSquared = ssTot > 0 ? Math.max(0, 1 - (ssRes / ssTot)) : 1.0;

    // Calculate e1RM: At velocity = MVT => Load = (MVT - intercept) / slope
    let e1RM = 0;
    if (Math.abs(slope) > 0.00001) {
      e1RM = (data.mvt - intercept) / slope;
    }

    return {
      slope,
      intercept,
      rSquared: Math.min(0.999, rSquared),
      e1RM: Math.round(e1RM * 10) / 10,
      mvt: data.mvt,
      exerciseName: data.name
    };
  }

  calculateAndRender() {
    const reg = this.calculateRegression();
    this.updateStatsUI(reg);
    this.renderPointsTable();
    this.renderChart(reg);
  }

  updateStatsUI(reg) {
    if (!reg) return;

    // 1. Predicted 1RM
    const e1rmEl = document.getElementById('vbtPredicted1RM');
    if (e1rmEl) e1rmEl.textContent = `${reg.e1RM.toFixed(1)} kg`;

    // 2. R² Fit
    const r2El = document.getElementById('vbtRSquared');
    if (r2El) r2El.textContent = reg.rSquared.toFixed(3);

    // 3. Formula: v = m * L + c
    const formulaEl = document.getElementById('vbtFormula');
    if (formulaEl) {
      const sign = reg.intercept >= 0 ? '+' : '-';
      formulaEl.textContent = `v = ${reg.slope.toFixed(4)} · L ${sign} ${Math.abs(reg.intercept).toFixed(2)}`;
    }

    // 4. MVT Cutoff
    const mvtEl = document.getElementById('vbtMvtValue');
    if (mvtEl) mvtEl.textContent = `${reg.mvt.toFixed(2)} m/s`;

    // 5. Exercise Title
    const titleEl = document.getElementById('vbtExerciseTitle');
    if (titleEl) titleEl.textContent = reg.exerciseName;
  }

  renderPointsTable() {
    const tableBody = document.getElementById('vbtPointsTableBody');
    if (!tableBody) return;

    const pts = this.datasets[this.currentExercise].points;
    tableBody.innerHTML = '';

    pts.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-mono';
      tr.innerHTML = `
        <td class="py-2.5 px-3 text-slate-500 font-semibold">Set #${idx + 1}</td>
        <td class="py-2.5 px-3 text-slate-800 font-bold">${p.load} kg</td>
        <td class="py-2.5 px-3 text-sky-600 font-bold">${p.velocity.toFixed(2)} m/s</td>
        <td class="py-2.5 px-3 text-right">
          <button class="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition" onclick="window.vbtAnalyticsInstance.removePoint(${idx})">
            <svg class="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // SVG CHART RENDERER
  // =========================================================================

  renderChart(reg) {
    if (!this.svg) {
      this.svg = document.getElementById('vbtInteractiveSvg');
    }
    if (!this.svg) return;

    if (!reg) reg = this.calculateRegression();
    if (!reg) return;

    const pts = this.datasets[this.currentExercise].points;

    // ViewBox dimensions: 640 x 360
    const W = 640;
    const H = 340;
    const padL = 65;
    const padR = 40;
    const padT = 30;
    const padB = 45;

    const maxLoad = Math.max(reg.e1RM * 1.12, 160);
    const minLoad = 0;
    const minVel = 0;
    const maxVel = 1.20;

    const scaleX = (val) => padL + ((val - minLoad) / (maxLoad - minLoad)) * (W - padL - padR);
    const scaleY = (val) => (H - padB) - ((val - minVel) / (maxVel - minVel)) * (H - padT - padB);

    // Grid lines & labels
    let gridSvg = '';

    // Horizontal velocity grid
    for (let v = 0.2; v <= 1.2; v += 0.2) {
      const y = scaleY(v);
      gridSvg += `
        <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="4,4" stroke-width="1" />
        <text x="${padL - 10}" y="${y + 4}" fill="#64748b" font-size="10" font-family="JetBrains Mono" text-anchor="end">${v.toFixed(1)}</text>
      `;
    }

    // Vertical load grid
    const loadStep = maxLoad > 200 ? 50 : 25;
    for (let l = loadStep; l < maxLoad; l += loadStep) {
      const x = scaleX(l);
      gridSvg += `
        <line x1="${x}" y1="${padT}" x2="${x}" y2="${H - padB}" stroke="#e2e8f0" stroke-dasharray="4,4" stroke-width="1" />
        <text x="${x}" y="${H - padB + 18}" fill="#64748b" font-size="10" font-family="JetBrains Mono" text-anchor="middle">${l}kg</text>
      `;
    }

    // Axes
    const axesSvg = `
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#94a3b8" stroke-width="1.5" />
      <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#94a3b8" stroke-width="1.5" />
      <text x="${W / 2}" y="${H - 10}" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Barbell Load (kg)</text>
      <text transform="rotate(-90)" x="${-(H / 2)}" y="20" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Velocity (m/s)</text>
    `;

    // MVT Cutoff dashed horizontal line
    const mvtY = scaleY(reg.mvt);
    const mvtLineSvg = `
      <line x1="${padL}" y1="${mvtY}" x2="${W - padR}" y2="${mvtY}" stroke="#f59e0b" stroke-dasharray="6,4" stroke-width="2" />
      <text x="${W - padR + 6}" y="${mvtY + 4}" fill="#d97706" font-size="10" font-family="JetBrains Mono" font-weight="bold">MVT (${reg.mvt.toFixed(2)})</text>
    `;

    // Linear Regression Line
    const x1 = minLoad;
    const y1 = Math.min(maxVel, Math.max(minVel, (reg.slope * x1) + reg.intercept));
    const x2 = reg.e1RM;
    const y2 = reg.mvt;

    const lineSvg = `
      <line x1="${scaleX(x1)}" y1="${scaleY(y1)}" x2="${scaleX(x2)}" y2="${scaleY(y2)}" stroke="#0284c7" stroke-width="3" stroke-linecap="round" />
    `;

    // e1RM Intercept Point Marker
    const e1rmX = scaleX(reg.e1RM);
    const e1rmY = scaleY(reg.mvt);
    const interceptSvg = `
      <g>
        <circle cx="${e1rmX}" cy="${e1rmY}" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="2" />
        <line x1="${e1rmX}" y1="${e1rmY}" x2="${e1rmX}" y2="${H - padB}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1.5" />
        <rect x="${e1rmX - 42}" y="${e1rmY - 32}" width="84" height="22" rx="4" fill="#0f172a" />
        <text x="${e1rmX}" y="${e1rmY - 17}" fill="#ffffff" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">1RM: ${reg.e1RM}kg</text>
      </g>
    `;

    // Data Points
    let pointsSvg = '';
    pts.forEach(p => {
      const cx = scaleX(p.load);
      const cy = scaleY(p.velocity);
      pointsSvg += `
        <g class="cursor-pointer group">
          <circle cx="${cx}" cy="${cy}" r="6" fill="#0284c7" stroke="#ffffff" stroke-width="2" class="transition-transform group-hover:scale-125" />
          <circle cx="${cx}" cy="${cy}" r="12" fill="rgba(2, 132, 199, 0.15)" />
        </g>
      `;
    });

    this.svg.innerHTML = `
      ${gridSvg}
      ${axesSvg}
      ${mvtLineSvg}
      ${lineSvg}
      ${interceptSvg}
      ${pointsSvg}
    `;
  }
}

// Global initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.vbtAnalyticsInstance = new VBTAnalyticsEngine();
  });
} else {
  window.vbtAnalyticsInstance = new VBTAnalyticsEngine();
}
