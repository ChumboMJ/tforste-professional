import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';

export default function ExperienceTimeline({ recruiterPerspective }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (recruiterPerspective !== 'All') params.append('perspective', recruiterPerspective);

    fetch(`/api/experience?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [recruiterPerspective]);

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(0, 0, 0, 0.2)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge" style={{ marginBottom: '0.5rem' }}>
            <Briefcase size={14} /> Career History
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            Engineering <span className="gradient-text">Experience</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Track record of leadership, SLA delivery, and systems architecture
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Fetching experience records...
          </div>
        ) : (
          <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {experiences.map((exp) => (
              <div key={exp.id} className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {exp.roleTitle}
                    </h3>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {exp.company}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> {exp.period}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} /> {exp.location}
                    </span>
                  </div>
                </div>

                {/* Impact Badges */}
                {exp.impactHighlights && (
                  <div style={{
                    marginBottom: '1.25rem',
                    padding: '0.85rem',
                    background: 'rgba(0, 242, 254, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-cyan)'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Award size={14} /> QUANTIFIABLE IMPACT & RESULTS:
                    </div>
                    {exp.impactHighlights.map((imp, idx) => (
                      <div key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        • {imp}
                      </div>
                    ))}
                  </div>
                )}

                {/* Key Responsibilities */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    KEY RESPONSIBILITIES & CONTRIBUTIONS:
                  </div>
                  {exp.responsibilities.map((resp, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Tags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {exp.technologiesUsed.map((tech, idx) => (
                    <span key={idx} className="badge" style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--bg-card-border)', color: 'var(--text-secondary)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
