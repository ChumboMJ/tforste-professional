import React, { useState, useEffect } from 'react';
import { Cpu, Server, Cloud, Database, Brain, Sparkles } from 'lucide-react';

export default function SkillsMatrix({ recruiterPerspective }) {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'All', label: 'All Tech Stack', icon: Cpu },
    { id: 'Backend & APIs', label: 'Backend & APIs', icon: Server },
    { id: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: Cloud },
    { id: 'Databases & Architecture', label: 'Databases', icon: Database },
    { id: 'AI & ML', label: 'AI & ML', icon: Brain },
  ];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.append('category', activeCategory);
    if (recruiterPerspective !== 'All') params.append('perspective', recruiterPerspective);

    fetch(`/api/skills?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory, recruiterPerspective]);

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Core Competencies
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Technical <span className="gradient-text">Skills Matrix</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Filterable breakdown of technical proficiencies & production experience
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={activeCategory === c.id ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <Icon size={16} /> {c.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading skills payload from ASP.NET Core API...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {skills.map((skill) => (
              <div key={skill.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{skill.name}</div>
                  <div style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {skill.proficiencyPercent}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '8px',
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${skill.proficiencyPercent}%`,
                    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo))',
                    borderRadius: '4px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Experience: {skill.yearsExperience} Years</span>
                  <span>Category: {skill.category}</span>
                </div>

                {skill.highlightedProjects && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {skill.highlightedProjects.map((proj, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '4px',
                        border: '1px solid var(--bg-card-border)'
                      }}>
                        📌 {proj}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
