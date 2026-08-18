import React from 'react';
import { Terminal, Bot, Printer, Sun, Moon, Filter, Sparkles } from 'lucide-react';
import profilePic from '../assets/profile.png';

export default function Header({ 
  activeView,
  setActiveView,
  recruiterPerspective, 
  setRecruiterPerspective, 
  theme, 
  toggleTheme, 
  onOpenAiChat, 
  onOpenTerminal 
}) {
  const perspectives = [
    { id: 'All', label: 'All Profiles' },
    { id: 'FullStack', label: 'Full Stack' },
    { id: 'Backend', label: 'Backend & APIs' },
    { id: 'DevOps', label: 'Cloud & DevOps' },
    { id: 'AI', label: 'AI & Data' }
  ];

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      margin: '1rem auto',
      width: 'calc(100% - 2rem)',
      maxWidth: '1240px',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src={profilePic} 
          alt="Tim Forste" 
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--accent-cyan)',
            boxShadow: '0 0 12px rgba(0, 242, 254, 0.35)'
          }} 
        />
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Tim Forste <span className="gradient-text">.NET Core</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Senior Software Engineer & Hybrid-Cloud Architect
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        background: 'var(--bg-secondary)',
        padding: '0.35rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--bg-card-border)',
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveView('resume')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            background: activeView === 'resume' 
              ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' 
              : 'transparent',
            color: activeView === 'resume' ? '#0a0e17' : 'var(--text-secondary)'
          }}
        >
          📄 Interactive Resume
        </button>
        <button
          onClick={() => setActiveView('architecture')}
          style={{
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            background: activeView === 'architecture' 
              ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' 
              : 'transparent',
            color: activeView === 'architecture' ? '#0a0e17' : 'var(--text-secondary)'
          }}
        >
          ⚙️ System Architecture
        </button>
      </div>

      {/* Recruiter Perspective Filter Pills (Only visible on Interactive Resume view) */}
      {activeView === 'resume' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'var(--bg-secondary)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--bg-card-border)',
          maxWidth: '100%',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            <Filter size={14} /> Recruiter View:
          </div>
          {perspectives.map((p) => (
            <button
              key={p.id}
              onClick={() => setRecruiterPerspective(p.id)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                background: recruiterPerspective === p.id 
                  ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' 
                  : 'transparent',
                color: recruiterPerspective === p.id ? '#0a0e17' : 'var(--text-secondary)'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button 
          onClick={onOpenTerminal}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
          title="Open Interactive CLI Terminal"
        >
          <Terminal size={16} /> <span className="hide-mobile">CLI</span>
        </button>

        <button 
          onClick={onOpenAiChat}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          title="Ask GCP Gemini AI trained on my Resume"
        >
          <Bot size={16} /> <Sparkles size={14} /> Ask AI
        </button>

        <button 
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.75rem' }}
          title="Export / Print PDF Resume"
        >
          <Printer size={16} />
        </button>

        <button 
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.75rem' }}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
