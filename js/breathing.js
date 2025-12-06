// breathing.js
AFRAME.registerComponent('breathing-animation', {
  init: function () {
    const el = this.el;
    const inhaleDuration = 5000; // 5 seconds inhale
    const exhaleDuration = 5000; // 5 seconds exhale
    const startScale = new THREE.Vector3(0.2, 0.2, 0.2); 
    const targetScale = new THREE.Vector3(0.4, 0.4, 0.4); // Grows 2x its original size

    // Start the breathing cycle immediately
    this.startCycle();

    // Function to handle the animation cycle
    this.startCycle = function() {
      // 1. INHALE (5s)
      el.setAttribute('animation__inhale', {
        property: 'scale',
        to: targetScale,
        dur: inhaleDuration,
        easing: 'easeInOutSine',
        // When inhale finishes, start exhale
        events: {
          'animationcomplete__inhale': this.startExhale
        }
      });
    };

    // Function to handle the exhale and restart the cycle
    this.startExhale = function() {
      // 2. EXHALE (5s)
      el.setAttribute('animation__exhale', {
        property: 'scale',
        to: startScale,
        dur: exhaleDuration,
        easing: 'easeInOutSine',
        // When exhale finishes, restart the cycle
        events: {
          'animationcomplete__exhale': this.startCycle
        }
      });
      // Optionally play audio here: document.getElementById('breathingAudio').play();
    };

    // Begin the first cycle
    this.startCycle();
  }
});
