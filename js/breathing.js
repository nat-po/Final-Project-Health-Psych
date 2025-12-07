// breathing.js - Enhanced with better controls and smoother animations
AFRAME.registerComponent('breathing-animation', {
  schema: {
    inhaleDuration: { type: 'number', default: 4000 },  // 4 seconds inhale
    exhaleDuration: { type: 'number', default: 4000 },  // 4 seconds exhale
    pauseDuration: { type: 'number', default: 1000 },   // 1 second pause
    paused: { type: 'boolean', default: false }
  },

  init: function () {
    const el = this.el;
    const data = this.data;
    
    // Scale ranges - more subtle and natural
    this.startScale = new THREE.Vector3(0.2, 0.2, 0.2);
    this.targetScale = new THREE.Vector3(0.28, 0.28, 0.28);  // 40% larger, more natural
    this.pauseScale = new THREE.Vector3(0.27, 0.27, 0.27);   // Hold at peak
    
    this.isAnimating = true;
    
    // Start breathing cycle
    this.startBreathingCycle();
  },

  startBreathingCycle: function() {
    if (this.data.paused || !this.isAnimating) return;
    
    const el = this.el;
    const data = this.data;
    
    // 1. INHALE - smooth expansion
    el.setAttribute('animation__inhale', {
      property: 'scale',
      to: this.targetScale,
      dur: data.inhaleDuration,
      easing: 'easeInOutCubic',
      events: {
        'animationcomplete__inhale': this.onInhaleComplete.bind(this)
      }
    });
  },

  onInhaleComplete: function() {
    if (this.data.paused || !this.isAnimating) return;
    
    const el = this.el;
    const data = this.data;
    
    // Play inhale sound if audio is available
    const audioElement = document.getElementById('breathingAudio');
    if (audioElement && audioElement.parentElement && audioElement._audioEnabled) {
      // Start audio from beginning of inhale
      audioElement.currentTime = 0;
      audioElement.play().catch(e => {});
    }
    
    // 2. HOLD at peak for 1 second
    setTimeout(() => {
      if (this.data.paused || !this.isAnimating) return;
      this.startExhale();
    }, data.pauseDuration);
  },

  startExhale: function() {
    if (this.data.paused || !this.isAnimating) return;
    
    const el = this.el;
    const data = this.data;
    
    // 3. EXHALE - smooth contraction
    el.setAttribute('animation__exhale', {
      property: 'scale',
      to: this.startScale,
      dur: data.exhaleDuration,
      easing: 'easeInOutCubic',
      events: {
        'animationcomplete__exhale': this.onExhaleComplete.bind(this)
      }
    });
  },

  onExhaleComplete: function() {
    if (this.data.paused || !this.isAnimating) return;
    
    // Wait before next cycle
    setTimeout(() => {
      if (this.data.paused || !this.isAnimating) return;
      this.startBreathingCycle();
    }, this.data.pauseDuration);
  },

  pause: function() {
    this.data.paused = true;
    // Stop animations but keep current state
    const el = this.el;
    el.removeAttribute('animation__inhale');
    el.removeAttribute('animation__exhale');
  },

  resume: function() {
    this.data.paused = false;
    this.startBreathingCycle();
  },

  setSpeed: function(speedMultiplier) {
    // speedMultiplier: 1.0 = normal, 0.5 = half speed, 2.0 = double speed
    const baseInhale = 4000;
    const baseExhale = 4000;
    
    this.data.inhaleDuration = baseInhale / speedMultiplier;
    this.data.exhaleDuration = baseExhale / speedMultiplier;
    
    // Restart with new speed
    if (!this.data.paused) {
      this.pause();
      this.resume();
    }
  },

  update: function(oldData) {
    // If paused state changes
    if (oldData.paused !== undefined && oldData.paused !== this.data.paused) {
      if (this.data.paused) {
        this.pause();
      } else {
        this.resume();
      }
    }
  },

  remove: function() {
    this.isAnimating = false;
  }
});
