import React, { useState } from 'react';
import { Copy, Check, Printer, ArrowLeft, Tag, Sparkles, Download } from 'lucide-react';

export default function AtsResumePreview({
  generatedResult,
  onBackToMatrix,
  onReset
}) {
  const [copied, setCopied] = useState(false);

  if (!generatedResult) return null;

  const { jobTitle, company, atsResumeMarkdown, keywordsTargeted, estimatedAtsScore, modelUsed } = generatedResult;

  const handleCopyText = () => {
    navigator.clipboard.writeText(atsResumeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tailored ATS Resume • {modelUsed}
          </div>
          <h2 style={{ margin: '0.25rem 0', fontSize: '1.4rem', fontWeight: 800 }}>
            {jobTitle} {company ? `@ ${company}` : ''}
          </h2>
          {keywordsTargeted && keywordsTargeted.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <Tag size={13} /> Keywords Targeted:
              </span>
              {keywordsTargeted.map((kw, i) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions & Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            color: '#0a0e17',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>
              {estimatedAtsScore || 92}%
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Est. ATS Score
            </div>
          </div>

          <button
            onClick={handleCopyText}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Plain Text'}
          </button>

          <button
            onClick={handlePrintPdf}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Resume Render Card */}
      <div
        className="glass-panel ats-resume-container"
        style={{
          padding: '2.5rem',
          borderRadius: '16px',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          fontSize: '0.92rem',
          lineHeight: '1.65',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {atsResumeMarkdown}
        </div>
      </div>

      {/* Footer Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBackToMatrix}
          className="btn btn-secondary"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Back to Skill Review
        </button>

        <button
          onClick={onReset}
          className="btn btn-secondary"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Sparkles size={16} /> Start New Job Analysis
        </button>
      </div>
    </div>
  );
}
