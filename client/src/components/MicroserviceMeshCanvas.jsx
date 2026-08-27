import React, { useEffect, useRef } from 'react';

export default function MicroserviceMeshCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : 500;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const techLabels = ['.NET 10', 'C#', 'GCP', 'Azure', 'Gemini AI', 'Kubernetes', 'Docker', 'CI/CD', 'Automated Testing', 'React'];
    
    const nodes = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * (parent ? parent.clientWidth : window.innerWidth),
      y: Math.random() * (parent ? parent.clientHeight : 500),
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      baseRadius: i < techLabels.length ? 4 : 2.5,
      radius: i < techLabels.length ? 4 : 2.5,
      label: techLabels[i] || null,
      color: i % 3 === 0 ? '#00f2fe' : i % 3 === 1 ? '#6f4cff' : '#10b981'
    }));

    const pulses = [];

    const render = () => {
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : 500;

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const labelColor = isLight ? 'rgba(15, 23, 42, 0.88)' : 'rgba(240, 246, 252, 0.85)';
      const strokeColor = isLight ? 'rgba(79, 70, 229, 0.22)' : 'rgba(0, 242, 254, 0.15)';

      ctx.clearRect(0, 0, width, height);

      // Randomly spawn pulses between nearby nodes
      if (Math.random() < 0.08 && pulses.length < 12) {
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const n2 = nodes[Math.floor(Math.random() * nodes.length)];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (n1 !== n2 && dist < 140) {
          pulses.push({ from: n1, to: n2, progress: 0, speed: 0.015 + Math.random() * 0.02, color: isLight ? '#4f46e5' : n1.color });
        }
      }

      // Draw connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * (isLight ? 0.25 : 0.15);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Update & draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const px = p.from.x + (p.to.x - p.from.x) * p.progress;
        const py = p.from.y + (p.to.y - p.from.y) * p.progress;

        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update & draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse attraction/repulsion
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        if (mdist < mouse.radius) {
          const force = (mouse.radius - mdist) / mouse.radius;
          n.x -= (mdx / mdist) * force * 2;
          n.y -= (mdy / mdist) * force * 2;
          n.radius = n.baseRadius + force * 2;
        } else {
          n.radius = n.baseRadius;
        }

        const nodeColor = isLight 
          ? (n.color === '#00f2fe' ? '#0284c7' : n.color === '#6f4cff' ? '#4f46e5' : '#059669')
          : n.color;

        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = n.label ? 8 : 3;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render tech badge label for key nodes with dynamic contrast
        if (n.label) {
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillStyle = labelColor;
          ctx.fillText(n.label, n.x + 8, n.y + 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
