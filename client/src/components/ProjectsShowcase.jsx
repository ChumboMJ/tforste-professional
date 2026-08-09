import React, { useState, useEffect } from 'react';
import { Rocket, ExternalLink, Github, Layers, Activity, Sparkles } from 'lucide-react';

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Cloud Infrastructure', 'AI / Machine Learning', 'Full-Stack Apps'];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== 'All') params.append('category', activeCategory);

    fetch(`/api/projects?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge" style={{ marginBottom: '0.5rem' }}>
            <Rocket size={14} /> Production Portfolio
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Featured <span className="gradient-text">Engineering Projects</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            High-concurrency systems, cloud infrastructure & AI grounded applications
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading project showcases...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.75rem'
          }}>
            {projects.map((proj) => (
              <div key={proj.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                      {proj.category}
                    </div>
                    {proj.featured && (
                      <span className="badge" style={{ background: 'rgba(255, 170, 0, 0.1)', color: 'var(--accent-amber)', border: '1px solid rgba(255, 170, 0, 0.3)' }}>
                        <Sparkles size={12} /> Featured
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    {proj.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-indigo)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {proj.subtitle}
                  </p>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    {proj.description}
                  </p>

                  {/* Architecture Overview */}
                  <div style={{
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--bg-card-border)'
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Layers size={14} color="var(--accent-indigo)" /> Architecture Design:
                    </div>
                    {proj.architectureOverview}
                  </div>

                  {/* Metrics */}
                  {proj.keyMetrics && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {proj.keyMetrics.map((m, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.6rem',
                          background: 'rgba(0, 242, 254, 0.08)',
                          color: 'var(--accent-cyan)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Activity size={12} /> {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tech & Links */}
                <div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem', justifyContent: 'center' }}>
                        <Github size={14} /> Source Code
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem', justifyContent: 'center' }}>
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {!proj.githubUrl && !proj.demoUrl && (
                      <div style={{
                        width: '100%',
                        padding: '0.5rem 0.8rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--bg-card-border)',
                        textAlign: 'center'
                      }}>
                        🔒 Proprietary Enterprise System (Closed Source)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
