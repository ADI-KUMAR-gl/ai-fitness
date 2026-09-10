/**
 * Apex AI Fitness - Live Interactive BMI & TDEE Metabolic Calculator
 * Uses Mifflin-St Jeor equation with real-time slider updates
 */

class FitnessCalculator {
  constructor() {
    this.gender = 'male';
    this.height = 178; // cm
    this.weight = 76; // kg
    this.age = 26; // years
    this.activity = 1.55; // moderate default

    this.init();
  }

  init() {
    // Inputs
    this.heightSlider = document.getElementById('calcHeight');
    this.weightSlider = document.getElementById('calcWeight');
    this.ageSlider = document.getElementById('calcAge');
    this.activitySelect = document.getElementById('calcActivity');

    // Values display labels
    this.heightVal = document.getElementById('calcHeightVal');
    this.weightVal = document.getElementById('calcWeightVal');
    this.ageVal = document.getElementById('calcAgeVal');

    // Output elements
    this.bmiScoreEl = document.getElementById('calcBmiScore');
    this.bmiStatusEl = document.getElementById('calcBmiStatus');
    this.bmrScoreEl = document.getElementById('calcBmrScore');
    this.tdeeScoreEl = document.getElementById('calcTdeeScore');
    this.cutScoreEl = document.getElementById('calcCutScore');
    this.bulkScoreEl = document.getElementById('calcBulkScore');
    this.bmiGaugeBar = document.getElementById('calcBmiGauge');

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    // Gender buttons
    const maleBtn = document.getElementById('calcGenderMale');
    const femaleBtn = document.getElementById('calcGenderFemale');

    if (maleBtn && femaleBtn) {
      maleBtn.addEventListener('click', () => {
        this.gender = 'male';
        maleBtn.classList.add('bg-lime-400', 'text-black');
        maleBtn.classList.remove('bg-gray-800', 'text-gray-300');
        femaleBtn.classList.remove('bg-lime-400', 'text-black');
        femaleBtn.classList.add('bg-gray-800', 'text-gray-300');
        this.calculate();
      });

      femaleBtn.addEventListener('click', () => {
        this.gender = 'female';
        femaleBtn.classList.add('bg-lime-400', 'text-black');
        femaleBtn.classList.remove('bg-gray-800', 'text-gray-300');
        maleBtn.classList.remove('bg-lime-400', 'text-black');
        maleBtn.classList.add('bg-gray-800', 'text-gray-300');
        this.calculate();
      });
    }

    // Sliders
    if (this.heightSlider) {
      this.heightSlider.addEventListener('input', (e) => {
        this.height = parseFloat(e.target.value);
        if (this.heightVal) this.heightVal.textContent = `${this.height} cm`;
        this.calculate();
      });
    }

    if (this.weightSlider) {
      this.weightSlider.addEventListener('input', (e) => {
        this.weight = parseFloat(e.target.value);
        if (this.weightVal) this.weightVal.textContent = `${this.weight} kg`;
        this.calculate();
      });
    }

    if (this.ageSlider) {
      this.ageSlider.addEventListener('input', (e) => {
        this.age = parseInt(e.target.value, 10);
        if (this.ageVal) this.ageVal.textContent = `${this.age} yrs`;
        this.calculate();
      });
    }

    if (this.activitySelect) {
      this.activitySelect.addEventListener('change', (e) => {
        this.activity = parseFloat(e.target.value);
        this.calculate();
      });
    }
  }

  calculate() {
    // 1. BMI Calculation
    const heightInMeters = this.height / 100;
    const bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));

    let status = 'Normal Weight';
    let statusColor = 'text-lime-400';
    let gaugePercent = Math.min(100, Math.max(5, ((bmi - 14) / (38 - 14)) * 100));

    if (bmi < 18.5) {
      status = 'Underweight';
      statusColor = 'text-cyan-400';
    } else if (bmi >= 18.5 && bmi < 25) {
      status = 'Optimal Athletic Range';
      statusColor = 'text-lime-400';
    } else if (bmi >= 25 && bmi < 30) {
      status = 'Overweight / Heavy Muscle';
      statusColor = 'text-yellow-400';
    } else {
      status = 'High Body Mass';
      statusColor = 'text-red-400';
    }

    // 2. BMR via Mifflin-St Jeor formula
    let bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age);
    if (this.gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    // 3. TDEE
    const tdee = Math.round(bmr * this.activity);
    const cutCal = Math.round(tdee - 450);
    const bulkCal = Math.round(tdee + 350);

    // Update DOM
    if (this.bmiScoreEl) this.bmiScoreEl.textContent = bmi;
    if (this.bmiStatusEl) {
      this.bmiStatusEl.textContent = status;
      this.bmiStatusEl.className = `text-sm font-semibold mt-1 ${statusColor}`;
    }
    if (this.bmrScoreEl) this.bmrScoreEl.textContent = `${bmr} kcal`;
    if (this.tdeeScoreEl) this.tdeeScoreEl.textContent = `${tdee} kcal`;
    if (this.cutScoreEl) this.cutScoreEl.textContent = `${cutCal} kcal`;
    if (this.bulkScoreEl) this.bulkScoreEl.textContent = `${bulkCal} kcal`;

    if (this.bmiGaugeBar) {
      this.bmiGaugeBar.style.left = `${gaugePercent}%`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.calculatorInstance = new FitnessCalculator();
});
