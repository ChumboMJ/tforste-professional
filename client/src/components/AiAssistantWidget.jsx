import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

export default function AiAssistantWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Tim Forste\'s AI Persona powered by GCP Gemini & .NET Core. I answer directly on Tim\'s behalf in the first person about my 12+ years of software engineering experience, C# .NET Core microservices, Azure/GCP hybrid cloud architecture, and Google Gemini CLI integrations. Ask me anything!',
      suggestedFollowUps: [
        'What is your experience with .NET Core and Azure Service Bus?',
        'Tell me about your GCP NestJS project and Gemini CLI parsing',
        'What HR and finance integrations have you built?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: promptToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.answer,
          suggestedFollowUps: data.suggestedFollowUps,
          modelUsed: data.modelUsed,
          grounded: data.groundedInResume
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Error contacting GCP Gemini API: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '650px',
        height: '650px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        border: '1px solid var(--accent-indigo)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, rgba(111, 76, 255, 0.2), rgba(0, 242, 254, 0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--bg-card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0e17'
            }}>
              <Bot size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Tim Forste AI Assistant <Sparkles size={14} color="var(--accent-cyan)" />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Powered by GCP Gemini & .NET 10 (Zero-Hallucination Grounded Engine)
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          background: 'var(--bg-primary)'
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '85%',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                background: m.sender === 'user' 
                  ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))' 
                  : 'var(--bg-secondary)',
                color: m.sender === 'user' ? '#0a0e17' : 'var(--text-primary)',
                fontWeight: m.sender === 'user' ? 600 : 400,
                border: m.sender === 'ai' ? '1px solid var(--bg-card-border)' : 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                {m.text}
              </div>

              {m.sender === 'ai' && m.modelUsed && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={12} color="var(--accent-emerald)" /> Grounded Context • {m.modelUsed}
                </div>
              )}

              {/* Suggested Follow-Ups */}
              {m.sender === 'ai' && m.suggestedFollowUps && (
                <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {m.suggestedFollowUps.map((su, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(su)}
                      style={{
                        padding: '0.3rem 0.65rem',
                        fontSize: '0.78rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(111, 76, 255, 0.1)',
                        color: 'var(--accent-indigo)',
                        border: '1px solid rgba(111, 76, 255, 0.25)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      💡 {su}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
              <RefreshCw size={16} className="animate-spin" /> Querying GCP Gemini AI model...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--bg-card-border)'
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about experience, microservices, outages, GCP..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            <Send size={16} /> Ask
          </button>
        </form>
      </div>
    </div>
  );
}
