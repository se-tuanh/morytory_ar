export const registerCustomEffects = () => {
  if (typeof AFRAME === 'undefined') return;
  if (AFRAME.components['custom-particles']) return;

  const getPetalSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 C70 30, 90 70, 50 100 C10 70, 30 30, 50 0 Z" fill="${color}" opacity="0.8"/></svg>`)}`;
  const getLeafSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 Q90 40 50 100 Q10 40 50 0 Z" fill="${color}" opacity="0.9"/><path d="M50 0 L50 100" stroke="rgba(0,0,0,0.1)" stroke-width="2"/></svg>`)}`;
  const getSparkleSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 0 Q50 50 100 50 Q50 50 50 100 Q50 50 0 50 Q50 50 50 0 Z" fill="${color}"/></svg>`)}`;
  const getSnowSvg = () => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="white" filter="blur(4px)" opacity="0.9"/></svg>`)}`;

  AFRAME.registerComponent('custom-particles', {
    schema: {
      type: { type: 'string', default: 'snow' },
      count: { type: 'number', default: 50 },
      size: { type: 'number', default: 0.1 },
      color: { type: 'string', default: '#ffffff' }
    },
    
    init: function () {
      this.particles = [];
      const typeStr = this.data.type;
      let actualCount = this.data.count;

      if (typeStr === 'butterflies') {
        actualCount = 8; // Fewer butterflies so it's not chaotic
      } else if (typeStr === 'fireflies') {
        actualCount = 30; // 30 fireflies
      }

      // Pre-add God Rays for fireflies
      if (typeStr === 'fireflies') {
        for (let i = 0; i < 3; i++) {
          const ray = document.createElement('a-cylinder');
          ray.setAttribute('color', '#fbbf24');
          ray.setAttribute('radius', '0.1');
          ray.setAttribute('height', '3');
          ray.setAttribute('material', 'transparent: true; opacity: 0.15; side: double; blending: additive');
          const rx = -30 + Math.random() * 20;
          const ry = 20 + Math.random() * 40;
          const rz = -10 + Math.random() * 20;
          ray.setAttribute('rotation', `${rx} ${ry} ${rz}`);
          ray.setAttribute('position', `${-1 + Math.random() * 2} 1 0`);
          this.el.appendChild(ray);
        }
      }

      for (let i = 0; i < actualCount; i++) {
        let particle;
        
        if (typeStr === 'butterflies') {
          particle = document.createElement('a-entity');
          const wingColor = ['#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'][Math.floor(Math.random() * 4)];
          
          const leftWing = document.createElement('a-plane');
          leftWing.setAttribute('color', wingColor);
          leftWing.setAttribute('width', this.data.size);
          leftWing.setAttribute('height', this.data.size * 1.5);
          leftWing.setAttribute('material', 'transparent: true; side: double; opacity: 0.9');
          leftWing.setAttribute('position', `-${this.data.size / 2} 0 0`);
          const leftPivot = document.createElement('a-entity');
          leftPivot.appendChild(leftWing);
          leftPivot.setAttribute('animation__flap', `property: rotation; from: 0 0 0; to: 0 -60 0; dur: 150; dir: alternate; loop: true; easing: easeInOutSine`);

          const rightWing = document.createElement('a-plane');
          rightWing.setAttribute('color', wingColor);
          rightWing.setAttribute('width', this.data.size);
          rightWing.setAttribute('height', this.data.size * 1.5);
          rightWing.setAttribute('material', 'transparent: true; side: double; opacity: 0.9');
          rightWing.setAttribute('position', `${this.data.size / 2} 0 0`);
          const rightPivot = document.createElement('a-entity');
          rightPivot.appendChild(rightWing);
          rightPivot.setAttribute('animation__flap', `property: rotation; from: 0 0 0; to: 0 60 0; dur: 150; dir: alternate; loop: true; easing: easeInOutSine`);

          const butterflyBody = document.createElement('a-cylinder');
          butterflyBody.setAttribute('color', '#333');
          butterflyBody.setAttribute('radius', this.data.size * 0.1);
          butterflyBody.setAttribute('height', this.data.size * 1.5);

          particle.appendChild(leftPivot);
          particle.appendChild(rightPivot);
          particle.appendChild(butterflyBody);
        } else if (typeStr === 'fireflies') {
          particle = document.createElement('a-sphere');
          particle.setAttribute('radius', this.data.size);
          particle.setAttribute('color', '#fbbf24');
          particle.setAttribute('material', 'emissive: #fbbf24; emissiveIntensity: 2; transparent: true; opacity: 0.8; blending: additive');
        } else {
          particle = document.createElement('a-image');
          if (typeStr === 'snow') {
            particle.setAttribute('src', getSnowSvg());
            particle.setAttribute('width', this.data.size);
            particle.setAttribute('height', this.data.size);
          } else if (typeStr === 'leaves' || typeStr === 'petals') {
            const colors = typeStr === 'petals' ? ['#ff99cc', '#ffccdd', '#ffb3c6', '#ff80ab'] : ['#8bc34a', '#ff9800', '#ffeb3b', '#4caf50'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.setAttribute('src', typeStr === 'petals' ? getPetalSvg(color) : getLeafSvg(color));
            particle.setAttribute('width', this.data.size);
            particle.setAttribute('height', this.data.size * 1.2);
            particle.setAttribute('material', 'transparent: true; side: double');
          } else if (typeStr === 'sparkle' || typeStr === 'fireworks') {
            const colors = ['#ffd700', '#ffeb3b', '#ffc107', '#ff9800', '#ffffff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.setAttribute('src', getSparkleSvg(color));
            particle.setAttribute('width', this.data.size);
            particle.setAttribute('height', this.data.size);
            particle.setAttribute('material', 'transparent: true; side: double');
          }
        }

        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2 + 1;
        const z = (Math.random() - 0.5) * 1;
        particle.setAttribute('position', `${x} ${y} ${z}`);
        
        const rx = Math.random() * 360;
        const ry = Math.random() * 360;
        const rz = Math.random() * 360;
        particle.setAttribute('rotation', `${rx} ${ry} ${rz}`);

        let dur = 3000 + Math.random() * 4000;
        let delay = Math.random() * 3000;

        if (typeStr === 'butterflies') {
          // Complex random flight path
          const bx = (Math.random() - 0.5) * 3;
          const by = (Math.random() - 0.5) * 3 + 1;
          const bz = 0.5 + Math.random();
          particle.setAttribute('animation__pos', `property: position; to: ${bx} ${by} ${bz}; dur: ${dur*1.5}; dir: alternate; loop: true; easing: easeInOutQuad`);
          particle.setAttribute('animation__rot', `property: rotation; to: ${rx+30} ${ry+180} ${rz+30}; dur: ${dur*2}; dir: alternate; loop: true; easing: easeInOutSine`);
        } else if (typeStr === 'fireflies') {
          const fx = x + (Math.random() - 0.5) * 1;
          const fy = y + (Math.random() - 0.5) * 1;
          const fz = z + (Math.random() - 0.5) * 0.5;
          particle.setAttribute('animation__pos', `property: position; to: ${fx} ${fy} ${fz}; dur: ${dur}; dir: alternate; loop: true; easing: easeInOutSine`);
          particle.setAttribute('animation__opacity', `property: material.opacity; from: 0.2; to: 1; dur: ${800 + Math.random()*1000}; dir: alternate; loop: true`);
        } else if (typeStr === 'snow') {
          const swayX = x + (Math.random() - 0.5) * 0.8;
          particle.setAttribute('animation__pos', `property: position; to: ${swayX} -1.5 ${z}; dur: ${dur}; loop: true; delay: ${delay}; easing: linear`);
          particle.setAttribute('animation__rot', `property: rotation; to: ${rx} ${ry+180} ${rz+180}; dur: ${dur}; loop: true; easing: linear`);
        } else if (typeStr === 'petals' || typeStr === 'leaves') {
          const swayX = x + (Math.random() - 0.5) * 1.5;
          particle.setAttribute('animation__pos', `property: position; to: ${swayX} -1.5 ${z}; dur: ${dur}; loop: true; delay: ${delay}; easing: linear`);
          particle.setAttribute('animation__rot', `property: rotation; to: ${rx+360} ${ry+720} ${rz+360}; dur: ${dur*0.6}; loop: true; easing: linear`);
        } else if (typeStr === 'sparkle' || typeStr === 'fireworks') {
          particle.setAttribute('position', '0 0.5 0');
          const tx = (Math.random() - 0.5) * 3;
          const ty = (Math.random() - 0.5) * 3 + 0.5;
          const tz = (Math.random() - 0.5) * 2;
          particle.setAttribute('animation__pos', `property: position; to: ${tx} ${ty} ${tz}; dur: ${dur*0.4}; loop: true; delay: ${delay}; easing: easeOutExpo`);
          particle.setAttribute('animation__scale', `property: scale; from: 1 1 1; to: 0 0 0; dur: ${dur*0.4}; loop: true; delay: ${delay}`);
        }

        this.el.appendChild(particle);
        this.particles.push(particle);
      }
    }
  });
};
