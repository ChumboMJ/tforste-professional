import React from 'react';

export default function ArchitectureDiagramExact() {
  return (
    <div style={{
      background: '#18181b',
      borderRadius: '8px',
      padding: '2rem 1.5rem',
      color: '#f4f4f5',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
      border: '1px solid #27272a',
      maxWidth: '780px',
      margin: '0 auto'
    }}>
      
      {/* ==================== 1. CLIENT LAYER (REACT) ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.6rem 0.8rem 1rem 0.8rem',
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem'
        }}>
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            CLI Terminal (ask command)
          </div>

          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            Interactive Portfolio UI
          </div>

          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5'
          }}>
            'Ask AI About My Career' Chat Widget
          </div>
        </div>
      </div>

      {/* ==================== CONNECTOR ARROWS & LABELS (TOP TO MIDDLE) ==================== */}
      <div style={{ position: 'relative', height: '90px' }}>
        <svg style={{ width: '100%', height: '100%', display: 'block' }}>
          <defs>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-gray" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
            </marker>
          </defs>

          {/* Left Line */}
          <path d="M 130 0 L 130 20 L 260 20 L 260 90" fill="none" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

          {/* Center Line */}
          <path d="M 390 0 L 390 90" fill="none" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />

          {/* Right Line */}
          <path d="M 650 0 L 650 20 L 520 20 L 520 90" fill="none" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
        </svg>

        {/* Edge Labels overlay */}
        <div style={{
          position: 'absolute',
          top: '25px',
          left: 0,
          right: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          pointerEvents: 'none'
        }}>
          <div style={{ textAlign: 'center' }}>
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
          </div>

          <div style={{ textAlign: 'center' }}>
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
          </div>

          <div style={{ textAlign: 'center' }}>
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
        </div>
      </div>

      {/* ==================== 2. BACKEND LAYER (.NET 10 WEB API) ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.6rem 0.8rem 1.25rem 0.8rem',
        background: '#18181b',
        maxWidth: '540px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a1a1aa',
          marginBottom: '0.85rem'
        }}>
          Backend Layer (.NET 10 Web API)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Node 1: ASP.NET Core 10 Web API */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f4f4f5',
            width: '260px'
          }}>
            ASP.NET Core 10 Web API
          </div>

          {/* Arrow 1 -> 2 */}
          <svg style={{ width: '20px', height: '30px' }}>
            <line x1="10" y1="0" x2="10" y2="30" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
          </svg>

          {/* Node 2: GeminiAiService (.NET C#) */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f4f4f5',
            width: '260px'
          }}>
            GeminiAiService (.NET C#)
          </div>

          {/* Branch to Resume Knowledge Base */}
          <div style={{ width: '100%', position: 'relative', height: '65px', marginTop: '0.25rem' }}>
            <svg style={{ width: '100%', height: '100%' }}>
              <path d="M 230 0 L 230 25 L 350 25 L 350 65" fill="none" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
            </svg>

            <div style={{
              position: 'absolute',
              right: '20px',
              bottom: 0,
              background: '#27272a',
              border: '1px solid #52525b',
              borderRadius: '4px',
              padding: '0.85rem 1rem',
              textAlign: 'center',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#f4f4f5',
              width: '280px'
            }}>
              Resume & Projects Knowledge Base
            </div>
          </div>

        </div>
      </div>

      {/* ==================== CONNECTOR ARROW & LABEL (MIDDLE TO BOTTOM) ==================== */}
      <div style={{ position: 'relative', height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <svg style={{ width: '20px', height: '70px', position: 'absolute' }}>
          <line x1="10" y1="0" x2="10" y2="70" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
        </svg>

        <span style={{
          position: 'relative',
          zIndex: 2,
          background: '#27272a',
          border: '1px solid #3f3f46',
          borderRadius: '4px',
          padding: '0.25rem 0.6rem',
          fontSize: '0.75rem',
          color: '#d4d4d8'
        }}>
          Grounded Prompt API
        </span>
      </div>

      {/* ==================== 3. GCP CLOUD & AI ==================== */}
      <div style={{
        border: '1px solid #3f3f46',
        borderRadius: '4px',
        padding: '0.6rem 0.8rem 1.25rem 0.8rem',
        background: '#18181b',
        maxWidth: '540px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#a1a1aa',
          marginBottom: '0.85rem'
        }}>
          GCP Cloud & AI
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          
          {/* Node 1: GCP Vertex AI / Gemini 2.5 Flash */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f4f4f5',
            width: '320px'
          }}>
            GCP Vertex AI / Gemini 2.5 Flash
          </div>

          {/* Arrow 1 -> 2 */}
          <svg style={{ width: '20px', height: '35px' }}>
            <line x1="10" y1="0" x2="10" y2="35" stroke="#52525b" strokeWidth="1.5" markerEnd="url(#arrow-blue)" />
          </svg>

          {/* Node 2: Grounded System Knowledge & Few-Shot Context */}
          <div style={{
            background: '#27272a',
            border: '1px solid #52525b',
            borderRadius: '4px',
            padding: '0.85rem 1.25rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#f4f4f5',
            width: '380px'
          }}>
            Grounded System Knowledge & Few-Shot Context
          </div>

        </div>
      </div>

    </div>
  );
}
