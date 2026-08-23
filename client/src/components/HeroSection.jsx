import React, { useEffect, useRef } from 'react';
import { Terminal, Bot, Mail, Cpu, Globe, Database, Cloud } from 'lucide-react';

export default function HeroSection({ profile, onOpenAiChat, onOpenTerminal, onOpenContact }) {
  const canvasRef = useRef(null);

  // Dynamic Cloud Microservices Mesh Animation with interactive mouse tracking & tech nodes
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
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

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

    // Data pulses traveling along connections
    const pulses = [];

    const render = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Randomly spawn pulses between nearby nodes
      if (Math.random() < 0.08 && pulses.length < 12) {
        const n1 = nodes[Math.floor(Math.random() * nodes.length)];
        const n2 = nodes[Math.floor(Math.random() * nodes.length)];
        const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (n1 !== n2 && dist < 140) {
          pulses.push({ from: n1, to: n2, progress: 0, speed: 0.015 + Math.random() * 0.02, color: n1.color });
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
            const alpha = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
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
        ctx.shadowBlur = 8;
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

        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = n.label ? 10 : 4;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render tech badge label for key nodes
        if (n.label) {
          ctx.font = '600 11px system-ui, sans-serif';
          ctx.fillStyle = 'rgba(240, 246, 252, 0.75)';
          ctx.fillText(n.label, n.x + 8, n.y + 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const p = profile || {
    availabilityStatus: "⚡ Available for Senior Roles",
    bio: "Senior Software Engineer & Hybrid-Cloud Architect with 12+ years of experience specializing in C#, .NET 10, GCP, Azure, event-driven microservices, and AI integrations.",
    metrics: {
      yearsOfExperience: "12+ Years",
      fullyRemoteDelivery: "5+ Years",
      sqlQuerySpeedLift: "50%+",
      distributedSystemsExperience: "7 Years"
    }
  };

  return (
    <section style={{ position: 'relative', padding: '3.5rem 0 2rem 0', overflow: 'hidden' }}>
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

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Status Badge */}
          <div className="badge" style={{ marginBottom: '1.25rem', padding: '0.4rem 1.1rem', fontSize: '0.85rem' }}>
            {p.availabilityStatus}
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem'
          }}>
            Architecting <span className="gradient-text">Resilient Systems</span> & AI Cloud Solutions
          </h1>

          {/* Bio */}
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '720px',
            margin: '0 auto 2rem auto'
          }}>
            {p.bio}
          </p>

          {/* Call to Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button onClick={onOpenAiChat} className="btn btn-primary">
              <Bot size={18} /> Ask Resume AI Assistant
            </button>
            <button onClick={onOpenTerminal} className="btn btn-secondary">
              <Terminal size={18} /> Launch CLI Terminal
            </button>
            <button onClick={onOpenContact} className="btn btn-secondary">
              <Mail size={18} /> Get In Touch
            </button>
          </div>

          {/* Core Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '2rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}><Cpu size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {p.metrics?.yearsOfExperience}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Software Engineering</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}><Globe size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {p.metrics?.fullyRemoteDelivery}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remote Delivery (3 Time Zones)</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}><Database size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {p.metrics?.sqlQuerySpeedLift}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SQL Query Speed Lift</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}><Cloud size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {p.metrics?.distributedSystemsExperience}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distributed Microservices</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
