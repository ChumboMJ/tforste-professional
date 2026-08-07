import React, { useState } from 'react';
import { Mail, Send, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.confirmationMessage });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.confirmationMessage || 'Failed to submit.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: `Error submitting: ${err.message}` });
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
        maxWidth: '540px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Mail color="var(--accent-cyan)" size={24} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Get In Touch</h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Direct message for engineering opportunities, technical advisory, or collaboration.
        </p>

        {status && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: status.type === 'success' ? 'rgba(0, 242, 180, 0.1)' : 'rgba(255, 85, 85, 0.1)',
            color: status.type === 'success' ? 'var(--accent-emerald)' : '#ff5555',
            border: `1px solid ${status.type === 'success' ? 'rgba(0, 242, 180, 0.3)' : 'rgba(255, 85, 85, 0.3)'}`
          }}>
            {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>YOUR NAME</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>YOUR EMAIL</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah@company.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>SUBJECT</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Senior Engineer Opportunity / Advisory"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>MESSAGE</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hello Alex, we would love to discuss a Staff Engineer role at our company..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            <Send size={16} /> {loading ? 'Sending Message...' : 'Send Direct Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
