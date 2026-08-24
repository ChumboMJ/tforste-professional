import React from 'react';
import { Terminal, Bot, Mail, Cpu, Globe, Database, Cloud } from 'lucide-react';
import MicroserviceMeshCanvas from './MicroserviceMeshCanvas';

export default function HeroSection({ profile, onOpenAiChat, onOpenTerminal, onOpenContact }) {
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
      <MicroserviceMeshCanvas />

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
