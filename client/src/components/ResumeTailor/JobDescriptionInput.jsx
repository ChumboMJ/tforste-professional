import React from 'react';
import { Sparkles, FileText, Building2, Briefcase } from 'lucide-react';

export default function JobDescriptionInput({
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  jobDescriptionText,
  setJobDescriptionText,
  onAnalyze,
  isLoading
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobDescriptionText.trim()) return;
    onAnalyze();
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
          padding: '0.6rem',
          borderRadius: '12px',
          color: '#0a0e17',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>ATS Resume Tailor & Skill Gap Analyzer</h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Paste a job posting below. GCP Gemini will extract key skills, compare them against Tim's Base Resume, and highlight skill gaps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              <Briefcase size={14} /> Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior .NET / Cloud Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--bg-card-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              <Building2 size={14} /> Company Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Health Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--bg-card-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
            <FileText size={14} /> Job Description Text *
          </label>
          <textarea
            required
            rows={10}
            placeholder="Paste the full job posting, responsibilities, and key requirements here..."
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--bg-card-border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={isLoading || !jobDescriptionText.trim()}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: (isLoading || !jobDescriptionText.trim()) ? 0.6 : 1,
              cursor: (isLoading || !jobDescriptionText.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                Analyzing Skill Gaps with Gemini...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Analyze Skill Gaps & Keywords
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
