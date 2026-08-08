import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SkillsMatrix from './components/SkillsMatrix';
import ExperienceTimeline from './components/ExperienceTimeline';
import ProjectsShowcase from './components/ProjectsShowcase';
import TerminalWidget from './components/TerminalWidget';
import AiAssistantWidget from './components/AiAssistantWidget';
import ContactModal from './components/ContactModal';
import PrintResumeView from './components/PrintResumeView';
import { Terminal, Bot, Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [recruiterPerspective, setRecruiterPerspective] = useState('All');
  const [theme, setTheme] = useState('dark');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Error fetching profile:', err));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="app-root">
      <Header
        recruiterPerspective={recruiterPerspective}
        setRecruiterPerspective={setRecruiterPerspective}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      <main>
        <HeroSection
          profile={profile}
          onOpenAiChat={() => setIsAiChatOpen(true)}
          onOpenTerminal={() => setIsTerminalOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
        />

        <SkillsMatrix recruiterPerspective={recruiterPerspective} />
        
        <ExperienceTimeline recruiterPerspective={recruiterPerspective} />

        <ProjectsShowcase />
      </main>

      <footer style={{
        padding: '3rem 0',
        borderTop: '1px solid var(--bg-card-border)',
        marginTop: '4rem',
        background: 'var(--bg-secondary)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <button onClick={() => setIsTerminalOpen(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
              <Terminal size={14} /> Open CLI
            </button>
            <button onClick={() => setIsAiChatOpen(true)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
              <Bot size={14} /> Ask Gemini AI
            </button>
            <button onClick={() => setIsContactOpen(true)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
              <Mail size={14} /> Contact
            </button>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Built with ASP.NET Core 10, C# 13, GCP Gemini AI Grounding & React 19.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem' }}>
            © {new Date().getFullYear()} Tim Forste. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Dialog Modals */}
      <TerminalWidget isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <AiAssistantWidget isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Print PDF View */}
      <PrintResumeView profile={profile} />
    </div>
  );
}
