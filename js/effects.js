/* ==========================================================================
   C-VERSE: APPLE-GRADE MOTION, PARTICLE PHYSICS & PROCEDURAL AUDIO ENGINE
   ========================================================================== */

class CVerseEffects {
  constructor() {
    this.soundEnabled = true;
    this.audioCtx = null;
    this.particles = [];
    this.animFrame = null;
    this.canvas = null;
    this.ctx = null;
    this.observer = null;
  }

  init() {
    this.setupConfettiCanvas();
    this.setupMagneticAndSpotlight();
    this.setupScrollStorytelling();
  }

  /* ------------------------------------------------------------------------
     1. WEB AUDIO API PROCEDURAL SOUND SYNTHESIZER
     ------------------------------------------------------------------------ */
  ensureAudio() {
    if (!this.soundEnabled) return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.06, delay = 0) {
    const ctx = this.ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (_) {}
  }

  playClick() {
    this.playTone(880, 'sine', 0.04, 0.03, 0);
  }

  playToggle() {
    this.playTone(587.33, 'sine', 0.06, 0.04, 0);
    this.playTone(880, 'sine', 0.08, 0.04, 0.04);
  }

  playCompileSuccess() {
    // Crisp futuristic emerald triad
    this.playTone(523.25, 'triangle', 0.14, 0.06, 0);     // C5
    this.playTone(659.25, 'triangle', 0.16, 0.06, 0.06);  // E5
    this.playTone(783.99, 'triangle', 0.22, 0.07, 0.12);  // G5
    this.playTone(1046.50, 'sine', 0.35, 0.08, 0.18);     // C6
  }

  playError() {
    this.playTone(196.00, 'sawtooth', 0.14, 0.05, 0);
    this.playTone(155.56, 'sawtooth', 0.22, 0.05, 0.09);
  }

  playUnlock() {
    // Rich celebratory arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((n, idx) => {
      this.playTone(n, 'triangle', 0.28, 0.07, idx * 0.055);
    });
  }

  playPointerPulse() {
    this.playTone(698.46, 'sine', 0.09, 0.045, 0);
    this.playTone(1046.50, 'sine', 0.12, 0.04, 0.04);
  }

  /* ------------------------------------------------------------------------
     2. PHYSICS-BASED PARTICLE CONFETTI ENGINE
     ------------------------------------------------------------------------ */
  setupConfettiCanvas() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  triggerConfetti(originX = window.innerWidth / 2, originY = window.innerHeight * 0.35, count = 95) {
    if (!this.canvas || !this.ctx) return;
    const palette = ['#10b981', '#34d399', '#06b6d4', '#22d3ee', '#a855f7', '#fde047', '#f43f5e', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 14;
      this.particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (3 + Math.random() * 6),
        size: 5 + Math.random() * 6,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        gravity: 0.28 + Math.random() * 0.12,
        drag: 0.982,
        alpha: 1,
        decay: 0.008 + Math.random() * 0.007,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }

    if (!this.animFrame) {
      this.animateParticles();
    }
  }

  animateParticles() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animFrame = requestAnimationFrame(() => this.animateParticles());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animFrame = null;
    }
  }

  /* ------------------------------------------------------------------------
     3. MAGNETIC MICRO-INTERACTIONS & SPOTLIGHT CURSOR GLOW
     ------------------------------------------------------------------------ */
  setupMagneticAndSpotlight() {
    document.addEventListener('mousemove', (e) => {
      // Update spotlight cards
      const cards = document.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (
          e.clientX >= rect.left - 120 &&
          e.clientX <= rect.right + 120 &&
          e.clientY >= rect.top - 120 &&
          e.clientY <= rect.bottom + 120
        ) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      });

      // Subtle ambient orb parallax
      const orb1 = document.getElementById('ambient-orb-1');
      const orb2 = document.getElementById('ambient-orb-2');
      if (orb1 && orb2) {
        const nx = (e.clientX / window.innerWidth - 0.5) * 35;
        const ny = (e.clientY / window.innerHeight - 0.5) * 35;
        orb1.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
        orb2.style.transform = `translate3d(${-nx * 0.8}px, ${-ny * 0.8}px, 0)`;
      }
    });

    this.bindMagneticButtons();
  }

  bindMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    buttons.forEach((btn) => {
      if (btn.dataset.magneticBound === 'true') return;
      btn.dataset.magneticBound = 'true';

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate3d(${relX * 0.18}px, ${relY * 0.22}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0px, 0px, 0)';
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. INTERSECTION OBSERVER SCROLL-DRIVEN STORYTELLING
     ------------------------------------------------------------------------ */
  setupScrollStorytelling() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    this.observeReveals();

    // Scroll progress bar & scrollytelling hardware die rotation
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      const bar = document.getElementById('scroll-progress-bar');
      if (bar) {
        bar.style.width = `${pct}%`;
      }
    }, { passive: true });
  }

  observeReveals() {
    if (!this.observer) return;
    const targets = document.querySelectorAll('.reveal-up, .reveal-scale');
    targets.forEach((el) => {
      this.observer.observe(el);
    });
    this.bindMagneticButtons();
  }
}

window.cverseEffects = new CVerseEffects();
