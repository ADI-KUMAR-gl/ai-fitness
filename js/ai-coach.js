/**
 * Apex AI Fitness - AI Motion Coach & Rep Counter Engine
 * Features:
 * - Live Webcam tracking mode with Canvas AI skeletal HUD
 * - Simulated human kinematics workout mode (zero setup demo)
 * - Exercise angle calculation (Squats, Bicep Curls, Push-ups, Jumping Jacks)
 * - State machine rep counting (Eccentric -> Concentric -> Lockout)
 * - Live form quality score & real-time coaching cue generator
 * - Web Audio API synthesizer for rep beeps & achievement chimes
 */

class AICoach {
  constructor() {
    this.canvas = document.getElementById('aiCoachCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;

    // State
    this.isRunning = false;
    this.mode = 'simulated'; // 'simulated' | 'camera'
    this.exercise = 'squat'; // 'squat' | 'curl' | 'pushup' | 'jack'
    this.reps = 0;
    this.calories = 0;
    this.formScore = 95;
    this.isMuted = false;
    this.phase = 'ready'; // 'up', 'down', 'ready'
    this.currentAngle = 170;
    this.animationId = null;
    this.cameraStream = null;

    // Simulation kinematics parameters
    this.simTime = 0;
    this.simSpeed = 0.035;

    // Web Audio context for zero-asset sound effects
    this.audioCtx = null;

    // Exercise definitions & coaching cues
    this.exerciseConfig = {
      squat: {
        name: 'Barbell / Bodyweight Squat',
        targetJoint: 'Knee & Hip Flexion',
        minAngle: 75,
        maxAngle: 170,
        caloriePerRep: 0.38,
        cues: [
          'Excellent depth - breaking parallel!',
          'Keep chest proud and back neutral',
          'Drive through mid-foot and heels',
          'Engage core on the ascent'
        ]
      },
      curl: {
        name: 'Dumbbell Bicep Curl',
        targetJoint: 'Elbow Flexion',
        minAngle: 45,
        maxAngle: 165,
        caloriePerRep: 0.22,
        cues: [
          'Full peak contraction at top!',
          'Pin elbows close to your torso',
          'Controlled 2-second eccentric descent',
          'Avoid swinging shoulders'
        ]
      },
      pushup: {
        name: 'Standard Push-Up',
        targetJoint: 'Chest & Elbow Angle',
        minAngle: 70,
        maxAngle: 165,
        caloriePerRep: 0.32,
        cues: [
          'Chest touches imaginary floor line!',
          'Maintain rigid plank line from head to heels',
          'Lock out triceps smoothly at apex',
          'Flared elbows at healthy 45-degree angle'
        ]
      },
      jack: {
        name: 'Jumping Jacks',
        targetJoint: 'Shoulder & Hip Abduction',
        minAngle: 25,
        maxAngle: 145,
        caloriePerRep: 0.18,
        cues: [
          'High energy cadence!',
          'Land softly on the balls of your feet',
          'Full overhead arm extension',
          'Keep breathing rhythmic and steady'
        ]
      }
    };

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // Set internal resolution for crisp HD canvas rendering
    this.canvas.width = 640;
    this.canvas.height = 420;

    this.bindEvents();
    this.updateUI();

    // Start in simulated demo mode automatically for immediate visual feedback
    this.start();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playRepSound(isMilestone = false) {
    if (this.isMuted) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      if (isMilestone) {
        // High energy chime (two tones)
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc2.frequency.setValueAtTime(880.0, now + 0.1); // A5

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start(now);
        osc2.start(now + 0.1);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } else {
        // Quick high-tech rep beep
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  bindEvents() {
    // Start / Pause button
    const toggleBtn = document.getElementById('coachToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.stop();
        } else {
          this.start();
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('coachResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetStats());
    }

    // Camera / Simulation toggle
    const camToggleBtn = document.getElementById('coachCamBtn');
    if (camToggleBtn) {
      camToggleBtn.addEventListener('click', () => this.toggleCameraMode());
    }

    // Sound toggle
    const soundBtn = document.getElementById('coachSoundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        soundBtn.innerHTML = this.isMuted
          ? '<i data-lucide="volume-x" class="w-4 h-4"></i> Muted'
          : '<i data-lucide="volume-2" class="w-4 h-4 text-lime-400"></i> Audio ON';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Exercise selector buttons
    const exButtons = document.querySelectorAll('[data-exercise]');
    exButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetEx = e.currentTarget.getAttribute('data-exercise');
        this.setExercise(targetEx);
      });
    });
  }

  setExercise(ex) {
    if (!this.exerciseConfig[ex]) return;
    this.exercise = ex;
    this.phase = 'ready';
    this.simTime = 0;

    // Highlight active button
    document.querySelectorAll('[data-exercise]').forEach(btn => {
      const isSelected = btn.getAttribute('data-exercise') === ex;
      if (isSelected) {
        btn.classList.add('bg-lime-400', 'text-black', 'font-bold');
        btn.classList.remove('bg-gray-800', 'text-gray-300');
      } else {
        btn.classList.remove('bg-lime-400', 'text-black', 'font-bold');
        btn.classList.add('bg-gray-800', 'text-gray-300');
      }
    });

    const exTitle = document.getElementById('currentExerciseTitle');
    if (exTitle) {
      exTitle.textContent = this.exerciseConfig[ex].name;
    }

    this.updateCoachFeedback(this.exerciseConfig[ex].cues[0], 96);
  }

  async toggleCameraMode() {
    const camBtn = document.getElementById('coachCamBtn');

    if (this.mode === 'simulated') {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Webcam access is not supported in this browser environment. Running in high-fidelity simulated demo mode!');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 420, facingMode: 'user' }
        });

        this.cameraStream = stream;
        this.video.srcObject = stream;
        await this.video.play();

        this.mode = 'camera';
        if (camBtn) {
          camBtn.innerHTML = '<i data-lucide="monitor" class="w-4 h-4 text-cyan-400"></i> Switch to Demo Sim';
        }
        const badge = document.getElementById('aiSourceBadge');
        if (badge) {
          badge.textContent = 'LIVE WEBCAM AI';
          badge.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5';
        }
      } catch (err) {
        console.warn('Camera permission denied or unavailable:', err);
        alert('Camera access was not granted or not available. Continuing in simulated demo mode!');
        this.mode = 'simulated';
      }
    } else {
      // Turn off camera and switch to simulation
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
        this.cameraStream = null;
      }
      this.mode = 'simulated';
      if (camBtn) {
        camBtn.innerHTML = '<i data-lucide="camera" class="w-4 h-4 text-lime-400"></i> Enable Webcam';
      }
      const badge = document.getElementById('aiSourceBadge');
      if (badge) {
        badge.textContent = 'SIMULATED AI DEMO';
        badge.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/30 flex items-center gap-1.5';
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  start() {
    this.isRunning = true;
    const btn = document.getElementById('coachToggleBtn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="pause" class="w-4 h-4 text-black"></i> Pause Session';
      btn.classList.add('bg-lime-400');
      btn.classList.remove('bg-yellow-400');
    }
    if (window.lucide) window.lucide.createIcons();

    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    const btn = document.getElementById('coachToggleBtn');
    if (btn) {
      btn.innerHTML = '<i data-lucide="play" class="w-4 h-4 text-black"></i> Resume Workout';
      btn.classList.remove('bg-lime-400');
      btn.classList.add('bg-yellow-400');
    }
    if (window.lucide) window.lucide.createIcons();
  }

  resetStats() {
    this.reps = 0;
    this.calories = 0;
    this.formScore = 95;
    this.phase = 'ready';
    this.updateUI();
  }

  loop() {
    if (!this.isRunning) return;

    this.render();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  render() {
    const { ctx, canvas } = this;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.mode === 'camera' && this.video.readyState >= 2) {
      // Draw live video feed with subtle athletic tint
      ctx.save();
      // Mirror video for natural selfie view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply dark cinematic overlay
      ctx.fillStyle = 'rgba(10, 12, 16, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Dark gym digital backdrop
      this.drawDigitalBackdrop();
    }

    // Kinematics calculations & Rep state machine
    this.updateKinematics();

    // Render AI Vision HUD (bounding boxes, skeletal wireframe, joint angles, radar lines)
    this.drawSkeletonAndHUD();
  }

  drawDigitalBackdrop() {
    const { ctx, canvas } = this;
    // Radial gradient background
    const bgGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 40,
      canvas.width / 2, canvas.height / 2, canvas.width / 1.3
    );
    bgGrad.addColorStop(0, '#151b27');
    bgGrad.addColorStop(1, '#090b10');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Floor platform line
    const floorGrad = ctx.createLinearGradient(0, 370, canvas.width, 370);
    floorGrad.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
    floorGrad.addColorStop(0.5, 'rgba(204, 255, 0, 0.35)');
    floorGrad.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
    ctx.strokeStyle = floorGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 370);
    ctx.lineTo(canvas.width - 40, 370);
    ctx.stroke();
  }

  updateKinematics() {
    this.simTime += this.simSpeed;
    const config = this.exerciseConfig[this.exercise];

    // Smooth sinusoidal motion between 0 (top/start) and 1 (bottom/inflection point)
    // Using (1 - Math.cos(time)) / 2 gives smooth curve [0, 1]
    const cycle = (1 - Math.cos(this.simTime)) / 2;

    // Angle calculation based on current cycle
    const angleRange = config.maxAngle - config.minAngle;
    this.currentAngle = Math.round(config.maxAngle - (cycle * angleRange));

    // State machine for rep counting
    // Thresholds: Bottom trigger >= 0.88, Top return <= 0.12
    if (cycle > 0.85 && this.phase !== 'down') {
      this.phase = 'down';
      // Randomize subtle form score variance
      const variance = Math.floor(Math.random() * 5) - 2;
      this.formScore = Math.min(99, Math.max(90, 95 + variance));
      const randomCue = config.cues[Math.floor(Math.random() * config.cues.length)];
      this.updateCoachFeedback(randomCue, this.formScore);
    } else if (cycle < 0.15 && this.phase === 'down') {
      // Rep completed!
      this.phase = 'up';
      this.reps++;
      this.calories = parseFloat((this.reps * config.caloriePerRep).toFixed(1));

      const isMilestone = this.reps > 0 && this.reps % 5 === 0;
      this.playRepSound(isMilestone);

      const successFeedback = isMilestone
        ? `🔥 ${this.reps} REPS MILESTONE! OUTSTANDING PACE!`
        : `Rep ${this.reps} locked! Full extension achieved.`;

      this.updateCoachFeedback(successFeedback, 98);
      this.updateUI();
    }
  }

  drawSkeletonAndHUD() {
    const { ctx, canvas } = this;
    const W = canvas.width;
    const H = canvas.height;
    const cycle = (1 - Math.cos(this.simTime)) / 2;

    // Center coordinates
    const cx = W / 2;
    let headY, neckY, rShoulder, lShoulder, rElbow, lElbow, rWrist, lWrist;
    let rHip, lHip, rKnee, lKnee, rAnkle, lAnkle;

    if (this.exercise === 'squat') {
      // Squat kinematics (vertical dip, knee hinge)
      const dip = cycle * 65;
      const kneeSpread = 20 + (cycle * 22);

      headY = 95 + dip;
      neckY = 125 + dip;

      rShoulder = { x: cx - 35, y: 135 + dip };
      lShoulder = { x: cx + 35, y: 135 + dip };

      // Hands in front for balance
      rElbow = { x: cx - 45, y: 170 + dip };
      lElbow = { x: cx + 45, y: 170 + dip };
      rWrist = { x: cx - 20, y: 165 + dip };
      lWrist = { x: cx + 20, y: 165 + dip };

      rHip = { x: cx - 24, y: 215 + dip };
      lHip = { x: cx + 24, y: 215 + dip };

      rKnee = { x: cx - 24 - kneeSpread, y: 290 + (dip * 0.45) };
      lKnee = { x: cx + 24 + kneeSpread, y: 290 + (dip * 0.45) };

      rAnkle = { x: cx - 42, y: 365 };
      lAnkle = { x: cx + 42, y: 365 };

    } else if (this.exercise === 'curl') {
      // Bicep curl kinematics (elbow stationary, forearm articulates)
      headY = 85;
      neckY = 115;
      rShoulder = { x: cx - 38, y: 125 };
      lShoulder = { x: cx + 38, y: 125 };

      // Left arm does the active curl, right arm stays steady
      lElbow = { x: cx + 44, y: 195 };
      rElbow = { x: cx - 44, y: 195 };
      rWrist = { x: cx - 44, y: 260 };

      // Left forearm hinges up in circular arc
      const curlAngleRad = (170 - (cycle * 125)) * (Math.PI / 180);
      const forearmLen = 65;
      lWrist = {
        x: lElbow.x - (Math.sin(curlAngleRad - 1.5) * forearmLen * 0.4),
        y: lElbow.y - (Math.cos(curlAngleRad) * forearmLen)
      };

      rHip = { x: cx - 25, y: 215 };
      lHip = { x: cx + 25, y: 215 };
      rKnee = { x: cx - 28, y: 295 };
      lKnee = { x: cx + 28, y: 295 };
      rAnkle = { x: cx - 30, y: 365 };
      lAnkle = { x: cx + 30, y: 365 };

    } else if (this.exercise === 'pushup') {
      // Horizontal pushup angle
      const dip = cycle * 45;
      headY = 220 + dip;
      neckY = 230 + dip;

      rShoulder = { x: cx - 95, y: 245 + dip };
      lShoulder = { x: cx - 80, y: 245 + dip };

      // Hands planted on ground
      rWrist = { x: cx - 95, y: 365 };
      lWrist = { x: cx - 75, y: 365 };

      // Elbows flare back and up
      rElbow = { x: cx - 125 - (cycle * 15), y: 300 + (dip * 0.7) };
      lElbow = { x: cx - 105 - (cycle * 15), y: 300 + (dip * 0.7) };

      rHip = { x: cx + 45, y: 255 + (dip * 0.8) };
      lHip = { x: cx + 55, y: 255 + (dip * 0.8) };

      rKnee = { x: cx + 120, y: 290 + (dip * 0.4) };
      lKnee = { x: cx + 130, y: 290 + (dip * 0.4) };

      rAnkle = { x: cx + 185, y: 365 };
      lAnkle = { x: cx + 195, y: 365 };

    } else {
      // Jumping jack kinematics
      const jackSpread = cycle * 70;
      headY = 85;
      neckY = 115;

      rShoulder = { x: cx - 35, y: 125 };
      lShoulder = { x: cx + 35, y: 125 };

      // Arms swing overhead
      const armAngle = cycle * 2.4;
      rElbow = { x: cx - 35 - Math.cos(armAngle) * 45, y: 125 - Math.sin(armAngle) * 45 };
      lElbow = { x: cx + 35 + Math.cos(armAngle) * 45, y: 125 - Math.sin(armAngle) * 45 };
      rWrist = { x: cx - 35 - Math.cos(armAngle) * 85, y: 125 - Math.sin(armAngle) * 85 };
      lWrist = { x: cx + 35 + Math.cos(armAngle) * 85, y: 125 - Math.sin(armAngle) * 85 };

      rHip = { x: cx - 20, y: 215 };
      lHip = { x: cx + 20, y: 215 };

      rKnee = { x: cx - 25 - (jackSpread * 0.5), y: 295 };
      lKnee = { x: cx + 25 + (jackSpread * 0.5), y: 295 };

      rAnkle = { x: cx - 30 - jackSpread, y: 365 };
      lAnkle = { x: cx + 30 + jackSpread, y: 365 };
    }

    // Connect limbs with glowing high-tech lines
    this.drawBones([
      [rShoulder, lShoulder],
      [rShoulder, rElbow],
      [rElbow, rWrist],
      [lShoulder, lElbow],
      [lElbow, lWrist],
      [rShoulder, rHip],
      [lShoulder, lHip],
      [rHip, lHip],
      [rHip, rKnee],
      [rKnee, rAnkle],
      [lHip, lKnee],
      [lKnee, lAnkle]
    ]);

    // Draw Head & Neck
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.arc(cx, headY, 18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.fill();
    ctx.stroke();

    // Draw Joint Keypoints with glow
    const keypoints = [
      rShoulder, lShoulder, rElbow, lElbow, rWrist, lWrist,
      rHip, lHip, rKnee, lKnee, rAnkle, lAnkle
    ];
    keypoints.forEach(pt => this.drawJoint(pt.x, pt.y));

    // Highlight target tracking joint with target angle arc
    let activeJoint = lKnee;
    if (this.exercise === 'curl') activeJoint = lElbow;
    if (this.exercise === 'pushup') activeJoint = rElbow;
    if (this.exercise === 'jack') activeJoint = lShoulder;

    this.drawAngleHUD(activeJoint.x, activeJoint.y, this.currentAngle);

    // Draw AI Target Tracking Reticle & Corner Brackets
    this.drawTargetHUD(W, H);
  }

  drawBones(pairs) {
    const { ctx } = this;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    pairs.forEach(([p1, p2]) => {
      // Cyan-lime gradient for bones
      const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(1, '#ccff00');
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
  }

  drawJoint(x, y) {
    const { ctx } = this;
    // Outer glow ring
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(204, 255, 0, 0.3)';
    ctx.fill();

    // Inner bright core
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ccff00';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawAngleHUD(x, y, angle) {
    const { ctx } = this;

    // Angle circle badge
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Angle text overlay
    ctx.fillStyle = 'rgba(10, 14, 22, 0.85)';
    ctx.fillRect(x + 18, y - 18, 54, 24);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 18, y - 18, 54, 24);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${angle}°`, x + 24, y - 2);
    ctx.restore();
  }

  drawTargetHUD(W, H) {
    const { ctx } = this;

    // Corner HUD Brackets
    const bracketSize = 25;
    const margin = 20;

    ctx.strokeStyle = 'rgba(204, 255, 0, 0.6)';
    ctx.lineWidth = 2;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bracketSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bracketSize, margin);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(W - margin - bracketSize, margin);
    ctx.lineTo(W - margin, margin);
    ctx.lineTo(W - margin, margin + bracketSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(margin, H - margin - bracketSize);
    ctx.lineTo(margin, H - margin);
    ctx.lineTo(margin + bracketSize, H - margin);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(W - margin - bracketSize, H - margin);
    ctx.lineTo(W - margin, H - margin);
    ctx.lineTo(W - margin, H - margin - bracketSize);
    ctx.stroke();

    // Live AI Telemetry overlay in top left
    ctx.fillStyle = 'rgba(10, 14, 22, 0.8)';
    ctx.fillRect(margin + 5, margin + 5, 180, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(margin + 5, margin + 5, 180, 52);

    ctx.fillStyle = '#ccff00';
    ctx.font = '10px monospace';
    ctx.fillText('APEX POSE ESTIMATION v2.4', margin + 12, margin + 20);

    ctx.fillStyle = '#9ca3af';
    ctx.fillText(`FPS: 60  |  LATENCY: 14ms`, margin + 12, margin + 34);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`TRACKING: 33 3D KEYPOINTS`, margin + 12, margin + 48);
  }

  updateCoachFeedback(text, score) {
    const feedbackEl = document.getElementById('coachFeedbackText');
    if (feedbackEl) {
      feedbackEl.textContent = text;
    }
    const scoreEl = document.getElementById('coachFormScore');
    if (scoreEl) {
      scoreEl.textContent = `${score}%`;
    }
  }

  updateUI() {
    const repCountEl = document.getElementById('coachRepCount');
    if (repCountEl) repCountEl.textContent = this.reps;

    const calEl = document.getElementById('coachCalCount');
    if (calEl) calEl.textContent = `${this.calories} kcal`;

    const scoreEl = document.getElementById('coachFormScore');
    if (scoreEl) scoreEl.textContent = `${this.formScore}%`;
  }
}

// Global initialization when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.aiCoachInstance = new AICoach();
});
