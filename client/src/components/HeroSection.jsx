import React, { useEffect, useRef } from 'react';
import { Terminal, Bot, Mail, Cpu, Globe, Database, Cloud } from 'lucide-react';

export default function HeroSection({ profile, onOpenAiChat, onOpenTerminal, onOpenContact }) {
  const canvasRef = useRef(null);

  // Background particle mesh animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.strokeStyle = 'rgba(111, 76, 255, 0.08)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!profile) return null;

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
            {profile.availabilityStatus}
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
            {profile.bio}
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
                {profile.metrics?.yearsOfExperience}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Software Engineering</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-indigo)', marginBottom: '0.5rem' }}><Globe size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {profile.metrics?.fullyRemoteDelivery}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Remote Delivery (3 Time Zones)</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}><Database size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {profile.metrics?.sqlQuerySpeedLift}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SQL Query Speed Lift</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}><Cloud size={28} /></div>
              <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text">
                {profile.metrics?.distributedSystemsExperience}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Distributed Microservices</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
