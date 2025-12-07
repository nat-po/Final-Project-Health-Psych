// particles.js - Breathing particle effect component
AFRAME.registerComponent('breathing-particles', {
  schema: {
    particleCount: { type: 'number', default: 8 },
    color: { type: 'color', default: '#00ff88' }
  },

  init: function() {
    const el = this.el;
    const data = this.data;
    
    // Create particle container
    const particleContainer = document.createElement('a-entity');
    particleContainer.id = 'particle-container';
    el.appendChild(particleContainer);
    
    // Create particles
    this.particles = [];
    for (let i = 0; i < data.particleCount; i++) {
      const particle = document.createElement('a-sphere');
      const angle = (i / data.particleCount) * Math.PI * 2;
      const radius = 0.15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      particle.setAttribute('radius', '0.02');
      particle.setAttribute('position', `${x} 0.1 ${z}`);
      particle.setAttribute('color', data.color);
      particle.setAttribute('opacity', '0.6');
      particle.setAttribute('material', 'emissive: ' + data.color);
      
      particleContainer.appendChild(particle);
      this.particles.push({
        element: particle,
        startPos: { x, y: 0.1, z },
        angle: angle
      });
    }
    
    this.startParticleAnimation();
  },

  startParticleAnimation: function() {
    const particles = this.particles;
    const animate = () => {
      const now = Date.now();
      const breatheCycle = ((now / 4000) % 2); // 4 second cycle
      const progress = breatheCycle < 1 ? breatheCycle : (2 - breatheCycle);
      
      particles.forEach(p => {
        const expandFactor = 0.15 + (progress * 0.25);
        const x = Math.cos(p.angle) * expandFactor;
        const z = Math.sin(p.angle) * expandFactor;
        const newOpacity = 0.4 + (progress * 0.4);
        
        p.element.setAttribute('position', `${x} 0.1 ${z}`);
        p.element.setAttribute('opacity', newOpacity);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
});
