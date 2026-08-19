import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, X, CornerDownLeft, Sparkles, Trash2 } from 'lucide-react';

export default function TerminalWidget({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', output: 'Welcome to Tim Forste\'s Interactive CLI Terminal!\nType "help" or click a quick command pill below to execute.' }
  ]);
  const [loading, setLoading] = useState(false);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleRunCommand = async (cmdToRun) => {
    const targetCmd = cmdToRun || input;
    if (!targetCmd.trim() || loading) return;

    const userEntry = { type: 'user', output: targetCmd };
    setHistory((prev) => [...prev, userEntry]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/terminal/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: targetCmd }),
      });

      const data = await res.json();

      if (data.type === 'clear') {
        setHistory([]);
      } else {
        setHistory((prev) => [...prev, { type: data.type || 'text', output: data.output }]);
      }
    } catch (err) {
      setHistory((prev) => [...prev, { type: 'error', output: `Error connecting to backend API: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    'help',
    'skills',
    'projects',
    'exp',
    'ask What is your experience with C# .NET Core & Azure/GCP?',
    'cat resume.json',
    'clear'
  ];

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
        maxWidth: '850px',
        height: '600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        border: '1px solid var(--accent-cyan)'
      }}>
        {/* Terminal Header Bar */}
        <div style={{
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--bg-card-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>tim-forste@portfolio:~ (.NET Core CLI)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setHistory([])}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Clear terminal output"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Command Pills */}
        <div style={{
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          borderBottom: '1px solid var(--bg-card-border)'
        }}>
          {quickCommands.map((c) => (
            <button
              key={c}
              onClick={() => handleRunCommand(c)}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                background: 'rgba(0, 242, 254, 0.08)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Terminal Output Area */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(10, 14, 23, 0.95)'
        }}>
          {history.map((h, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {h.type === 'user' ? (
                <div style={{ color: 'var(--accent-cyan)' }}>
                  <span style={{ color: 'var(--accent-emerald)' }}>tim-forste@portfolio:~$</span> {h.output}
                </div>
              ) : h.type === 'error' ? (
                <div style={{ color: '#ff5555' }}>{h.output}</div>
              ) : (
                <div style={{ color: 'var(--text-primary)', opacity: 0.95 }}>
                  {h.output?.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx} style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={14} className="animate-spin" /> Processing C# backend command...
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Command Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleRunCommand(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--bg-card-border)'
          }}
        >
          <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginRight: '0.5rem', fontWeight: 600 }}>
            $
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or any command (e.g. ask What is your cloud architecture?)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem' }}
          >
            <Send size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
