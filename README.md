# ⚡ APEX AI FITNESS — Next-Gen AI Gym Demo

A high-performance, dark-mode athletic gym website demo featuring real-time AI motion tracking, kinematics visualization, personalized workout generation, and metabolic biometrics.

Built for the **[ai-fitness](https://github.com/ADI-KUMAR-gl/ai-fitness)** repository.

---

## 🚀 Live Demo & Quick Start

Because this project is engineered with zero runtime build dependencies (Pure HTML5 + Tailwind CSS + Vanilla ES6 JS + Web Audio API + HTML5 Canvas), you can launch it instantly:

### Option 1: Open Locally in Any Browser
Simply double-click `index.html` or open it with your browser:
```powershell
Start-Process index.html
```

### Option 2: Deploy Free on GitHub Pages
1. Push this repository to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to your repository on GitHub: `https://github.com/ADI-KUMAR-gl/ai-fitness`
3. Navigate to **Settings** > **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose branch `main` and folder `/ (root)`, then click **Save**
6. Your live demo website will be active worldwide at:
   `https://adi-kumar-gl.github.io/ai-fitness/`

---

## 🌟 Key Features

### 1. 🤖 Live AI Motion Coach & Rep Counter
- **Webcam Mode**: Connects directly to your device camera with zero data transmitted to servers.
- **Simulated Kinematics Demo**: Instant zero-setup demonstration with a 3D joint-angle human skeletal avatar performing exercises.
- **Supported Movements**:
  - Barbell / Bodyweight Squats (Knee & Hip Flexion analysis)
  - Dumbbell Bicep Curls (Elbow angle tracking)
  - Standard Push-Ups (Chest-to-floor depth validation)
  - Jumping Jacks (Full-body cadence tracking)
- **Real-Time Feedback**: Joint angle degrees, rep counting state machine, calorie burn estimation, and form accuracy scoring.
- **Audio Synthesizer**: Web Audio API sound effects for rep validation beeps and 5-rep milestone chimes.

### 2. 🧠 Neural AI Workout & Nutrition Routine Generator
- Input your **Goal** (Hypertrophy, Fat Shred, Athletic Power, Mobility), **Experience**, **Weekly Days**, and **Dietary Framework** (High Protein, Keto, Vegan).
- Generates:
  - 7-day periodization microcycles with exercise names, sets, reps, and movement tempo (e.g. 3-0-1-0).
  - Daily metabolic target (kcal) and precision macro breakdown (Protein, Carbs, Fats, Water).
  - Structured 4-meal daily timing schedule.
  - One-click "Copy Routine" button.

### 3. 🎯 Interactive Muscle Group Explorer
- Anatomical selector for **Chest**, **Back & Lats**, **Legs & Glutes**, **Shoulders**, **Arms**, and **Core**.
- Reveals compound movements, isolation exercises, hypertrophy repetition ranges, and biomechanical cues.

### 4. 📊 Live BMI & TDEE Metabolic Calculator
- Real-time responsive sliders for Height, Weight, Age, Activity Multiplier, and Biological Sex.
- Dynamic color-coded BMI gauge with categories (Underweight, Optimal, Overweight).
- Mifflin-St Jeor Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
- Tailored caloric deficit (Fat Loss) and surplus (Muscle Gain) targets.

### 5. 📅 Filterable Weekly Class Timetable
- Filter classes by day (Monday - Sunday).
- Class cards displaying intensity, coach, calorie burn, remaining spots, and "Reserve Spot" confirmation.

### 6. 💳 Flexible Membership Tiers & Annual Discount
- Toggle between **Monthly** and **Annual (Save 20%)** pricing.
- Starter Pass ($29/mo), Pro AI Athlete ($59/mo), and Elite Black Card ($99/mo).

### 7. 🎟️ VIP Free Day Pass Modal & Toast Notifications
- High-converting interactive 1-Day Pass reservation modal.
- In-app glassmorphism toast notification system.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: Semantic HTML5, Vanilla ES6+ Object-Oriented JavaScript.
- **Styling**: Tailwind CSS CDN, CSS Custom Properties, Glassmorphism backdrop filters, Neon glow effects.
- **Computer Vision & HUD**: HTML5 Canvas 2D Context, dynamic kinematic trigonometry, trigonometric sinusoidal curves.
- **Audio**: Web Audio API (real-time synthesized frequency oscillators).
- **Icons**: Lucide Icons.
- **Typography**: Google Fonts (`Outfit`, `Bebas Neue`).

---

## 📂 Project Structure

```
ai-fitness/
├── index.html          # Main landing page & application shell
├── css/
│   └── styles.css      # Dark theme, neon accents, scanlines, animations
├── js/
│   ├── ai-coach.js     # AI motion coach, canvas skeleton renderer, rep counter
│   ├── ai-planner.js   # Dynamic workout & macro routine generator
│   ├── calculator.js   # Live BMI, BMR, and TDEE calculator
│   └── app.js          # Navigation, schedule filter, pricing toggle, modals
└── README.md           # Documentation & deployment guide
```

---

## 📜 License
Licensed under the [MIT License](LICENSE). Built for athletic excellence.
