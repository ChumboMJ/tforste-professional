import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, Sparkles, CheckSquare, PlusCircle } from 'lucide-react';

export default function SkillGapMatrixView({
  analysisResult,
  userSkillOverrides,
  setUserSkillOverrides,
  onGenerateAtsResume,
  onBackToInput,
  isLoading
}) {
  if (!analysisResult) return null;

  const { jobTitle, company, matchPercentage, matchedSkills, missingSkills, summary, modelUsed } = analysisResult;

  const handleToggleSkill = (skillName, checked) => {
    setUserSkillOverrides((prev) => {
      const existingIndex = prev.findIndex((item) => item.skillName === skillName);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          userPossessesSkill: checked
        };
        return updated;
      } else {
        return [
          ...prev,
          { skillName, userPossessesSkill: checked, userNotes: '' }
        ];
      }
    });
  };

  const handleNotesChange = (skillName, notes) => {
    setUserSkillOverrides((prev) => {
      const existingIndex = prev.findIndex((item) => item.skillName === skillName);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          userNotes: notes
        };
        return updated;
      } else {
        return [
          ...prev,
          { skillName, userPossessesSkill: true, userNotes: notes }
        ];
      }
    });
  };

  const isSkillChecked = (skillName) => {
    const override = userSkillOverrides.find((item) => item.skillName === skillName);
    return override ? override.userPossessesSkill : false;
  };

  const getSkillNotes = (skillName) => {
    const override = userSkillOverrides.find((item) => item.skillName === skillName);
    return override ? override.userNotes || '' : '';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'linear-gradient(135deg, #10b981, #059669)';
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    return 'linear-gradient(135deg, #ef4444, #dc2626)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Summary Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skill Gap Analysis Results • {modelUsed}
          </div>
          <h2 style={{ margin: '0.25rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
            {jobTitle || 'Target Role'} {company ? `@ ${company}` : ''}
          </h2>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '650px' }}>
            {summary}
          </p>
        </div>

        {/* Match Percentage Badge */}
        <div style={{
          background: getScoreColor(matchPercentage),
          padding: '1rem 1.75rem',
          borderRadius: '16px',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>
            {matchPercentage}%
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.9, marginTop: '0.2rem' }}>
            ATS Match Score
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Matched Skills Column */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              Matched Skills ({matchedSkills?.length || 0})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {matchedSkills && matchedSkills.length > 0 ? (
              matchedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {skill.skillName}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 600 }}>
                      {skill.proficiencyLevel}% Match
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {skill.evidenceFromResume}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No direct skill matches identified in base resume.
              </div>
            )}
          </div>
        </div>

        {/* Missing Skills / Override Review Column */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              Skill Gaps & Review Checklist ({missingSkills?.length || 0})
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Check off any skills below that you actually possess or have comparable experience for prior to resume generation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {missingSkills && missingSkills.length > 0 ? (
              missingSkills.map((gap, idx) => {
                const checked = isSkillChecked(gap.skillName);
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      background: checked ? 'rgba(0, 242, 254, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                      border: checked ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid rgba(245, 158, 11, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <input
                        type="checkbox"
                        id={`skill-gap-${idx}`}
                        checked={checked}
                        onChange={(e) => handleToggleSkill(gap.skillName, e.target.checked)}
                        style={{ marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
                      />
                      <label htmlFor={`skill-gap-${idx}`} style={{ cursor: 'pointer', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {gap.skillName}
                          </span>
                          <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                            {gap.importanceCategory || 'Requirement'}
                          </span>
                        </div>
                        {gap.suggestedComparableSkills && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            💡 Comparable: {gap.suggestedComparableSkills}
                          </div>
                        )}
                      </label>
                    </div>

                    {/* User Override Notes Input */}
                    {checked && (
                      <div style={{ marginTop: '0.6rem', paddingLeft: '2.1rem' }}>
                        <input
                          type="text"
                          placeholder="Optional context (e.g. Used Docker in side project or comparable to Azure Service Bus)..."
                          value={getSkillNotes(gap.skillName)}
                          onChange={(e) => handleNotesChange(gap.skillName, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--bg-card-border)',
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No significant skill gaps found! Your resume is highly aligned with this posting.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <button
          onClick={onBackToInput}
          className="btn btn-secondary"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> Edit Job Description
        </button>

        <button
          onClick={onGenerateAtsResume}
          disabled={isLoading}
          className="btn btn-primary"
          style={{
            padding: '0.75rem 1.75rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
              Generating Tailored ATS Resume with Gemini...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Generate Tailored ATS Resume <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
