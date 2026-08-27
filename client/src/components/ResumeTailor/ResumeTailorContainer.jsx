import React, { useState } from 'react';
import JobDescriptionInput from './JobDescriptionInput';
import SkillGapMatrixView from './SkillGapMatrixView';
import AtsResumePreview from './AtsResumePreview';
import { AlertCircle } from 'lucide-react';

export default function ResumeTailorContainer() {
  const [step, setStep] = useState(1); // 1: Input JD, 2: Skill Review, 3: ATS Resume
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [userSkillOverrides, setUserSkillOverrides] = useState([]);
  const [generatedResumeResult, setGeneratedResumeResult] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleAnalyzeJobDescription = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/resume-tailor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescriptionText
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed with status code ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setUserSkillOverrides([]);
      setStep(2);
    } catch (err) {
      console.error('Error analyzing skill gaps:', err);
      setErrorMsg('Failed to analyze job description. Please check your network connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAtsResume = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/resume-tailor/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescriptionText,
          userSkillOverrides
        })
      });

      if (!response.ok) {
        throw new Error(`Resume generation failed with status code ${response.status}`);
      }

      const data = await response.json();
      setGeneratedResumeResult(data);
      setStep(3);
    } catch (err) {
      console.error('Error generating ATS resume:', err);
      setErrorMsg('Failed to generate ATS resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnalysisResult(null);
    setUserSkillOverrides([]);
    setGeneratedResumeResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Wizard Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: step >= 1 ? 'var(--accent-cyan)' : 'var(--text-muted)',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: step >= 1 ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' : 'var(--bg-secondary)',
            color: step >= 1 ? '#0a0e17' : 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}>1</span>
          Input Job Description
        </div>

        <div style={{ width: '40px', height: '2px', background: step >= 2 ? 'var(--accent-cyan)' : 'var(--bg-card-border)' }}></div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: step >= 2 ? 'var(--accent-cyan)' : 'var(--text-muted)',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: step >= 2 ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' : 'var(--bg-secondary)',
            color: step >= 2 ? '#0a0e17' : 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}>2</span>
          Skill Gap & Keyword Review
        </div>

        <div style={{ width: '40px', height: '2px', background: step >= 3 ? 'var(--accent-cyan)' : 'var(--bg-card-border)' }}></div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: step >= 3 ? 'var(--accent-cyan)' : 'var(--text-muted)',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: step >= 3 ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' : 'var(--bg-secondary)',
            color: step >= 3 ? '#0a0e17' : 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}>3</span>
          ATS Resume & Export
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      {/* Wizard Steps */}
      {step === 1 && (
        <JobDescriptionInput
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          company={company}
          setCompany={setCompany}
          jobDescriptionText={jobDescriptionText}
          setJobDescriptionText={setJobDescriptionText}
          onAnalyze={handleAnalyzeJobDescription}
          isLoading={isLoading}
        />
      )}

      {step === 2 && (
        <SkillGapMatrixView
          analysisResult={analysisResult}
          userSkillOverrides={userSkillOverrides}
          setUserSkillOverrides={setUserSkillOverrides}
          onGenerateAtsResume={handleGenerateAtsResume}
          onBackToInput={() => setStep(1)}
          isLoading={isLoading}
        />
      )}

      {step === 3 && (
        <AtsResumePreview
          generatedResult={generatedResumeResult}
          onBackToMatrix={() => setStep(2)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
