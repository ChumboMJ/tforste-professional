import React from 'react';

export default function ArchitectureDiagramExact() {
  return (
    <div style={{
      background: '#18181b',
      borderRadius: '8px',
      padding: '1.5rem 1rem',
      color: '#f4f4f5',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
      border: '1px solid #27272a',
      maxWidth: '780px',
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      
      {/* ==================== 1. CLIENT LAYER (REACT) ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.75rem',
        background: '#18181b'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a1a1aa',
          marginBottom: '0.85rem'
        }}>
          Client Layer (React)
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem'
        }}>
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            CLI Terminal (ask command)
          </div>

          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            Interactive Portfolio UI
          </div>

          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            'Ask AI About My Career' Chat Widget
          </div>
        </div>
      </div>

      {/* ==================== CONNECTOR ARROWS & LABELS (TOP TO MIDDLE) ==================== */}
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '4px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            color: '#d4d4d8'
          }}>
            ask 'question'
          </span>

          <span style={{
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '4px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            color: '#d4d4d8'
          }}>
            User Queries
          </span>

          <span style={{
            background: '#27272a',
            border: '1px solid #3f3f46',
            borderRadius: '4px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.75rem',
            color: '#d4d4d8'
          }}>
            Chat Messages
          </span>
        </div>

        <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.2rem' }}>
          ↓
        </div>
      </div>

      {/* ==================== 2. BACKEND LAYER (.NET 10 WEB API) ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.75rem',
        background: '#18181b',
        maxWidth: '540px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a1a1aa',
          marginBottom: '0.85rem'
        }}>
          Backend Layer (.NET 10 Web API)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Node 1: ASP.NET Core 10 Web API */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5',
            maxWidth: '280px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            ASP.NET Core 10 Web API
          </div>

          <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1rem', margin: '-0.2rem 0' }}>
            ↓
          </div>

          {/* Node 2: GeminiAiService (.NET C#) */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5',
            maxWidth: '280px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            GeminiAiService (.NET C#)
          </div>

          <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1rem', margin: '-0.2rem 0' }}>
            ↓
          </div>

          {/* Node 3: Resume & Projects Knowledge Base */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#f4f4f5',
            maxWidth: '320px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Resume & Projects Knowledge Base
          </div>

        </div>
      </div>

      {/* ==================== CONNECTOR ARROW & LABEL (MIDDLE TO BOTTOM) ==================== */}
      <div style={{ margin: '1rem 0', textAlign: 'center' }}>
        <span style={{
          background: '#27272a',
          border: '1px solid #3f3f46',
          borderRadius: '4px',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          color: '#d4d4d8',
          display: 'inline-block',
          marginBottom: '0.35rem'
        }}>
          Grounded Prompt API
        </span>
        <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.2rem' }}>
          ↓
        </div>
      </div>

      {/* ==================== 3. GCP CLOUD & AI ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.75rem',
        background: '#18181b',
        maxWidth: '540px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a1a1aa',
          marginBottom: '0.85rem'
        }}>
          GCP Cloud & AI
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          
          {/* Node 1: GCP Vertex AI / Gemini 2.5 Flash */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5',
            maxWidth: '320px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            GCP Vertex AI / Gemini 2.5 Flash
          </div>

          <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1rem', margin: '-0.2rem 0' }}>
            ↓
          </div>

          {/* Node 2: Grounded System Knowledge & Few-Shot Context */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#f4f4f5',
            maxWidth: '360px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            Grounded System Knowledge & Few-Shot Context
          </div>

        </div>
      </div>

    </div>
  );
}
