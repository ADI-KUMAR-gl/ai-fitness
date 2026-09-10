/**
 * Apex AI Fitness - AI Workout & Nutrition Routine Generator
 * Generates personalized periodized splits and macro dietary plans
 */

class AIPlanner {
  constructor() {
    this.form = document.getElementById('aiPlannerForm');
    this.resultsContainer = document.getElementById('plannerResults');
    this.loadingIndicator = document.getElementById('plannerLoading');

    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.generateRoutine();
    });

    // Copy plan handler
    const copyBtn = document.getElementById('copyPlanBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    // Default auto-render a sample plan on load so the UI isn't empty
    this.generateRoutine(false);
  }

  async generateRoutine(showLoading = true) {
    const goal = document.getElementById('planGoal')?.value || 'hypertrophy';
    const level = document.getElementById('planLevel')?.value || 'intermediate';
    const days = parseInt(document.getElementById('planDays')?.value || '4', 10);
    const diet = document.getElementById('planDiet')?.value || 'high-protein';
    const weight = parseFloat(document.getElementById('planWeight')?.value || '75');

    if (showLoading && this.loadingIndicator) {
      this.loadingIndicator.classList.remove('hidden');
      if (this.resultsContainer) this.resultsContainer.classList.add('opacity-40');
      // Simulate high-tech AI calculation latency
      await new Promise(r => setTimeout(r, 650));
      this.loadingIndicator.classList.add('hidden');
      if (this.resultsContainer) this.resultsContainer.classList.remove('opacity-40');
    }

    const planData = this.computePlan(goal, level, days, diet, weight);
    this.renderPlan(planData);
  }

  computePlan(goal, level, days, diet, weight) {
    // Metabolic & Macro computation
    let baseCalories = weight * 32; // Standard active baseline
    let proteinMultiplier = 2.0; // g per kg
    let fatRatio = 0.25;

    let goalTitle = 'Hypertrophy & Lean Muscle Gain';
    let splitName = 'Upper / Lower Power & Hypertrophy';

    if (goal === 'fatloss') {
      baseCalories = Math.round(weight * 26);
      proteinMultiplier = 2.2;
      goalTitle = 'Rapid Fat Shred & Metabolic Conditioning';
    } else if (goal === 'hypertrophy') {
      baseCalories = Math.round(weight * 34);
      proteinMultiplier = 2.0;
      goalTitle = 'Hypertrophy & Muscle Volume Phase';
    } else if (goal === 'athletic') {
      baseCalories = Math.round(weight * 33);
      proteinMultiplier = 1.9;
      goalTitle = 'Athletic Power, Speed & Functional Strength';
    } else if (goal === 'mobility') {
      baseCalories = Math.round(weight * 28);
      proteinMultiplier = 1.8;
      goalTitle = 'Bodyweight Calisthenics & Core Control';
    }

    const proteinGrams = Math.round(weight * proteinMultiplier);
    const fatGrams = Math.round((baseCalories * fatRatio) / 9);
    const carbGrams = Math.round((baseCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);
    const waterLiters = (weight * 0.04).toFixed(1);

    // Dynamic workout days mapping
    let schedule = [];
    if (days === 3) {
      splitName = '3-Day Full Body High-Frequency Split';
      schedule = [
        {
          day: 'Day 1: Full Body (Squat & Push Focus)',
          exercises: [
            { name: 'Barbell Back Squat', sets: '4 sets x 6-8 reps', tempo: '3-0-1-0', rpe: 'RPE 8' },
            { name: 'Flat Dumbbell Bench Press', sets: '3 sets x 8-10 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Neutral Grip Lat Pulldown', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Dumbbell Romanian Deadlift', sets: '3 sets x 10 reps', tempo: '3-1-1-0', rpe: 'RPE 7.5' },
            { name: 'Cable Lateral Raise', sets: '3 sets x 15 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 2: Active Recovery & AI Mobility Zone',
          exercises: [
            { name: 'Thoracic & Hip Mobility Flow', sets: '15 mins continuous', tempo: 'Fluid', rpe: 'RPE 4' },
            { name: 'Zone 2 Incline Treadmill Walk', sets: '30 mins (125-135 BPM)', tempo: 'Steady', rpe: 'RPE 5' }
          ]
        },
        {
          day: 'Day 3: Full Body (Hinge & Pull Focus)',
          exercises: [
            { name: 'Conventional / Trap Bar Deadlift', sets: '3 sets x 5 reps', tempo: 'Reset each', rpe: 'RPE 8' },
            { name: 'Standing Overhead Press', sets: '4 sets x 6-8 reps', tempo: '2-0-1-0', rpe: 'RPE 8.5' },
            { name: 'Bulgarian Split Squats', sets: '3 sets x 10/leg', tempo: '3-0-1-0', rpe: 'RPE 8' },
            { name: 'Seated Cable Cable Row', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Incline Dumbbell Bicep Curls', sets: '3 sets x 12 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 4: Full Body (Metabolic Pump & Capacity)',
          exercises: [
            { name: 'Incline Barbell Press', sets: '4 sets x 8-10 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Leg Press (Close Stance)', sets: '3 sets x 12-15 reps', tempo: '3-0-1-0', rpe: 'RPE 8.5' },
            { name: 'Chest-Supported T-Bar Row', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Hanging Leg Raises', sets: '3 sets x 12-15 reps', tempo: 'Controlled', rpe: 'RPE 8.5' },
            { name: 'Rope Tricep Extensions', sets: '3 sets x 15 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        }
      ];
    } else if (days === 4) {
      splitName = '4-Day Upper / Lower Kinetic Split';
      schedule = [
        {
          day: 'Day 1: Upper Body Power & Tension',
          exercises: [
            { name: 'Barbell Bench Press', sets: '4 sets x 5-6 reps', tempo: '2-1-1-0', rpe: 'RPE 8.5' },
            { name: 'Pendlay Barbell Row', sets: '4 sets x 6-8 reps', tempo: 'Explosive', rpe: 'RPE 8' },
            { name: 'Standing Overhead Military Press', sets: '3 sets x 8 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Weighted Pull-Ups / Lat Pulldown', sets: '3 sets x 8-10 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Skull Crushers SS with Bicep Curls', sets: '3 sets x 12 reps', tempo: '2-0-1-0', rpe: 'RPE 8.5' }
          ]
        },
        {
          day: 'Day 2: Lower Body Quad & Core Dominance',
          exercises: [
            { name: 'Barbell Back Squat', sets: '4 sets x 6-8 reps', tempo: '3-0-1-0', rpe: 'RPE 8' },
            { name: 'Romanian Dumbbell Deadlift', sets: '3 sets x 8-10 reps', tempo: '3-1-1-0', rpe: 'RPE 7.5' },
            { name: 'Walking Dumbbell Lunges', sets: '3 sets x 12 steps/leg', tempo: 'Steady', rpe: 'RPE 8' },
            { name: 'Seated Leg Curl', sets: '3 sets x 12-15 reps', tempo: '3-0-1-1', rpe: 'RPE 9' },
            { name: 'Standing Calf Raises', sets: '4 sets x 15 reps', tempo: '2-2-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 3: Upper Body Hypertrophy & Density',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: '4 sets x 8-10 reps', tempo: '2-1-1-0', rpe: 'RPE 8.5' },
            { name: 'Chest-Supported Row', sets: '4 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Cable Flyes (High to Low)', sets: '3 sets x 12-15 reps', tempo: '2-1-1-1', rpe: 'RPE 8.5' },
            { name: 'Lateral Raise Drop-Set', sets: '3 sets x 12 + 8 reps', tempo: '2-0-1-1', rpe: 'RPE 9.5' },
            { name: 'Face Pulls with External Rotation', sets: '3 sets x 15 reps', tempo: '2-0-1-2', rpe: 'RPE 8' }
          ]
        },
        {
          day: 'Day 4: Lower Body Posterior Chain & Conditioning',
          exercises: [
            { name: 'Barbell Romanian Deadlift', sets: '4 sets x 6-8 reps', tempo: '3-1-1-0', rpe: 'RPE 8' },
            { name: 'Hack Squat / Front Squat', sets: '3 sets x 8-10 reps', tempo: '3-0-1-0', rpe: 'RPE 8.5' },
            { name: 'Leg Extension (Iso-Hold at top)', sets: '3 sets x 12 reps', tempo: '2-0-1-2', rpe: 'RPE 9' },
            { name: 'Hanging Knee/Leg Raises', sets: '3 sets x 15 reps', tempo: 'Controlled', rpe: 'RPE 8' },
            { name: 'HIIT Assault Bike Finisher', sets: '8 rounds x 20s ON / 40s OFF', tempo: 'Max Effort', rpe: 'RPE 9.5' }
          ]
        }
      ];
    } else {
      splitName = '5 to 6-Day Push / Pull / Legs (PPL) Volume Matrix';
      schedule = [
        {
          day: 'Day 1: Push (Chest, Front Delts, Triceps)',
          exercises: [
            { name: 'Barbell Bench Press', sets: '4 sets x 6-8 reps', tempo: '2-1-1-0', rpe: 'RPE 8.5' },
            { name: 'Incline Dumbbell Press', sets: '3 sets x 8-10 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Dips (Weighted or Assisted)', sets: '3 sets x 10-12 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Cable Lateral Raise', sets: '4 sets x 15 reps', tempo: '2-0-1-1', rpe: 'RPE 9' },
            { name: 'Overhead Cable Tricep Extension', sets: '3 sets x 12 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 2: Pull (Lats, Upper Back, Rear Delts, Biceps)',
          exercises: [
            { name: 'Barbell Deadlift / Rack Pull', sets: '3 sets x 5 reps', tempo: 'Explosive', rpe: 'RPE 8' },
            { name: 'Weighted Pull-Ups', sets: '4 sets x 6-8 reps', tempo: '2-0-1-1', rpe: 'RPE 8.5' },
            { name: 'Seated Cable Row', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Reverse Pec Deck / Rear Delt Flye', sets: '3 sets x 15 reps', tempo: '2-0-1-1', rpe: 'RPE 9' },
            { name: 'Incline Dumbbell Curl', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 3: Legs & Core (Quad & Glute Emphasis)',
          exercises: [
            { name: 'Barbell Back Squat', sets: '4 sets x 6-8 reps', tempo: '3-0-1-0', rpe: 'RPE 8' },
            { name: 'Leg Press', sets: '3 sets x 10-12 reps', tempo: '3-0-1-0', rpe: 'RPE 8.5' },
            { name: 'Walking Lunges', sets: '3 sets x 12 steps/leg', tempo: 'Continuous', rpe: 'RPE 8' },
            { name: 'Lying Hamstring Curl', sets: '3 sets x 12 reps', tempo: '2-0-1-1', rpe: 'RPE 9' },
            { name: 'Standing Calf Raises', sets: '4 sets x 15 reps', tempo: '2-2-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 4: Push (Upper Chest & Shoulder Focus)',
          exercises: [
            { name: 'Seated Dumbbell Shoulder Press', sets: '4 sets x 8-10 reps', tempo: '2-0-1-0', rpe: 'RPE 8.5' },
            { name: 'Flat Dumbbell Press', sets: '3 sets x 10-12 reps', tempo: '2-0-1-0', rpe: 'RPE 8' },
            { name: 'Cable Chest Flye', sets: '3 sets x 15 reps', tempo: '2-1-1-1', rpe: 'RPE 9' },
            { name: 'Dumbbell Lateral Raise', sets: '4 sets x 15 reps', tempo: '2-0-1-1', rpe: 'RPE 9.5' },
            { name: 'Rope Pushdown', sets: '3 sets x 12-15 reps', tempo: '2-0-1-1', rpe: 'RPE 9' }
          ]
        },
        {
          day: 'Day 5: Pull & Hamstrings (Posterior Power)',
          exercises: [
            { name: 'Romanian Deadlift (Barbell)', sets: '4 sets x 8 reps', tempo: '3-1-1-0', rpe: 'RPE 8' },
            { name: 'Close-Grip Lat Pulldown', sets: '3 sets x 10-12 reps', tempo: '2-0-1-1', rpe: 'RPE 8' },
            { name: 'Single-Arm Dumbbell Row', sets: '3 sets x 10 reps/side', tempo: '2-0-1-1', rpe: 'RPE 8.5' },
            { name: 'Preacher Bicep Curl', sets: '3 sets x 10 reps', tempo: '2-1-1-0', rpe: 'RPE 9' },
            { name: 'Cable Woodchoppers & Ab Rollout', sets: '3 sets x 15 reps', tempo: 'Controlled', rpe: 'RPE 8' }
          ]
        }
      ];
    }

    // Sample meals based on diet
    let mealPlan = [];
    if (diet === 'vegan') {
      mealPlan = [
        { time: 'Breakfast (08:00)', meal: 'Tofu Scramble with Spinach, Avocado & Whole Grain Sourdough + Hemp Protein Shake', protein: '38g' },
        { time: 'Lunch (13:00)', meal: 'Quinoa & Black Bean Power Bowl with Roasted Sweet Potatoes, Edamame & Tahini Dressing', protein: '42g' },
        { time: 'Pre-Workout (16:30)', meal: 'Oatmeal with Pea Protein Isolate, Chia Seeds, Banana & Almond Butter', protein: '28g' },
        { time: 'Dinner (20:00)', meal: 'Lentil & Tempeh Stir-Fry with Broccoli, Bell Peppers, Brown Rice & Sesame Seeds', protein: '45g' }
      ];
    } else if (diet === 'keto') {
      mealPlan = [
        { time: 'Breakfast (08:00)', meal: '3 Whole Eggs + 2 Egg Whites scrambled in Grass-fed Butter with Avocado & Smoked Salmon', protein: '40g' },
        { time: 'Lunch (13:00)', meal: 'Grilled Ribeye Steak Salad with Mixed Greens, Walnuts, Olive Oil & Shaved Parmesan', protein: '48g' },
        { time: 'Pre-Workout (16:30)', meal: 'MCT Oil Coffee + Handful of Macadamia Nuts & Whey Isolate', protein: '26g' },
        { time: 'Dinner (20:00)', meal: 'Baked Atlantic Salmon with Asparagus cooked in Ghee & Cauliflower Mash', protein: '46g' }
      ];
    } else {
      // Balanced high-protein
      mealPlan = [
        { time: 'Breakfast (08:00)', meal: '4 Egg Omelet (2 whole, 2 whites) with Spinach, Mushrooms, Oatmeal with Blueberries & Whey', protein: '45g' },
        { time: 'Lunch (13:00)', meal: 'Grilled Chicken Breast (200g) with Jasmine Rice, Roasted Broccoli & Olive Oil Drizzle', protein: '52g' },
        { time: 'Pre-Workout (16:30)', meal: 'Greek Yogurt (0% Fat) with Honey, Rice Cakes & Sliced Banana', protein: '28g' },
        { time: 'Dinner (20:00)', meal: 'Lean Grass-Fed Sirloin or Salmon Fillet with Baked Sweet Potato & Sautéed Green Beans', protein: '48g' }
      ];
    }

    return {
      goalTitle,
      splitName,
      calories: baseCalories,
      macros: { protein: proteinGrams, carbs: carbGrams, fats: fatGrams, water: waterLiters },
      schedule,
      mealPlan
    };
  }

  renderPlan(data) {
    if (!this.resultsContainer) return;

    const html = `
      <!-- Routine Summary Card -->
      <div class="glass-card rounded-2xl p-6 mb-8 border border-lime-400/30">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Generated AI Periodization Split
            </div>
            <h3 class="text-2xl font-bold text-white">${data.goalTitle}</h3>
            <p class="text-sm text-gray-400">${data.splitName}</p>
          </div>
          <div class="flex items-center gap-3">
            <button id="copyPlanBtn" class="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 transition">
              <i data-lucide="copy" class="w-4 h-4"></i> Copy Routine
            </button>
          </div>
        </div>

        <!-- Macro Dashboard -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
          <div class="text-center p-3 rounded-lg bg-gray-900/60">
            <p class="text-xs text-gray-400 font-medium">Daily Energy Target</p>
            <p class="text-2xl font-black text-lime-400 mt-1">${data.calories} <span class="text-xs text-gray-400 font-normal">kcal</span></p>
          </div>
          <div class="text-center p-3 rounded-lg bg-gray-900/60">
            <p class="text-xs text-gray-400 font-medium">Daily Protein</p>
            <p class="text-2xl font-black text-cyan-400 mt-1">${data.macros.protein}g</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-gray-900/60">
            <p class="text-xs text-gray-400 font-medium">Daily Carbs</p>
            <p class="text-2xl font-black text-yellow-400 mt-1">${data.macros.carbs}g</p>
          </div>
          <div class="text-center p-3 rounded-lg bg-gray-900/60">
            <p class="text-xs text-gray-400 font-medium">Healthy Fats</p>
            <p class="text-2xl font-black text-coral-400 text-red-400 mt-1">${data.macros.fats}g</p>
          </div>
        </div>
      </div>

      <!-- Plan Detail Tabs -->
      <div class="space-y-6">
        <h4 class="text-lg font-bold text-white flex items-center gap-2">
          <i data-lucide="calendar" class="w-5 h-5 text-lime-400"></i> Weekly Training Microcycle
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${data.schedule.map((item, idx) => `
            <div class="glass-card rounded-xl p-5 border border-white/5 hover:border-lime-400/20 transition">
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <h5 class="text-sm font-bold text-lime-400">${item.day}</h5>
                <span class="text-xs text-gray-500 font-mono">${item.exercises.length} Exercises</span>
              </div>
              <ul class="space-y-2.5">
                ${item.exercises.map(ex => `
                  <li class="text-xs flex items-start justify-between gap-2 p-2 rounded-lg bg-black/20">
                    <div>
                      <span class="font-semibold text-gray-200 block">${ex.name}</span>
                      <span class="text-gray-400 text-[11px] font-mono">Tempo: ${ex.tempo} | Target: ${ex.rpe}</span>
                    </div>
                    <span class="text-[11px] font-bold text-cyan-400 whitespace-nowrap bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/40">${ex.sets}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <!-- Sample Nutrition Timing -->
        <div class="mt-8 pt-6 border-t border-white/10">
          <h4 class="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <i data-lucide="utensils" class="w-5 h-5 text-cyan-400"></i> AI Optimized Meal Schedule & Timing
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${data.mealPlan.map(m => `
              <div class="glass-card rounded-xl p-4 border border-white/5">
                <div class="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-2">
                  <span>${m.time}</span>
                  <span class="text-gray-400">${m.protein} protein</span>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed">${m.meal}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.resultsContainer.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Rebind copy button
    const copyBtn = document.getElementById('copyPlanBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyToClipboard(data));
    }
  }

  copyToClipboard(data) {
    if (!data) return;
    const text = `
=== APEX AI FITNESS PLAN ===
Goal: ${data.goalTitle}
Split: ${data.splitName}
Daily Calories: ${data.calories} kcal
Macros: Protein ${data.macros.protein}g | Carbs ${data.macros.carbs}g | Fats ${data.macros.fats}g | Water ${data.macros.water}L

WEEKLY TRAINING SPLIT:
${data.schedule.map(d => `
[${d.day}]
${d.exercises.map(e => ` - ${e.name} (${e.sets}, Tempo: ${e.tempo})`).join('\n')}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert('Your customized AI workout and nutrition plan has been copied to your clipboard!');
    }).catch(() => {
      alert('Plan ready!');
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.aiPlannerInstance = new AIPlanner();
});
