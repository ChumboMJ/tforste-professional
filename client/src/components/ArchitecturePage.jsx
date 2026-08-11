import React, { useState } from 'react';
import { Cpu, Server, Cloud, ShieldCheck, Terminal, GitBranch, Cpu as Chip, Layers, CheckCircle2, Sparkles, Box, ArrowRight } from 'lucide-react';

export default function ArchitecturePage({ onOpenAiChat, onOpenTerminal }) {
  const [activeTab, setActiveTab] = useState('overview');

  const decisions = [
    {
      id: 'dotnet10',
      title: 'ASP.NET Core 10 Web API Backend',
      category: 'Backend Architecture',
      badge: 'C# 13 / .NET 10',
      why: 'Demonstrates enterprise-grade full-stack proficiency with strongly typed models, Minimal APIs, dependency injection, and high throughput.',
      highlights: [
        'Minimal API route handlers with OpenAPI documentation',
        'Structured CORS policy supporting local Vite dev and production origin constraints',
        'Built-in ASP.NET Core ILogger with environment-differentiated log levels (Trace/Debug in dev, Warning in prod)'
      ]
    },
    {
      id: 'gcp-gemini',
      title: 'GCP Gemini AI Grounded Persona (RAG)',
      category: 'AI / Machine Learning',
      badge: 'Gemini 2.5 / 1.5 Flash',
      why: 'Selected GCP Gemini Flash over expensive LLM fine-tuning to achieve zero-hallucination responses at near $0 hosting cost.',
      highlights: [
        '1,000,000+ token context window allowing full resume, case study, and matrix ingestion',
        'Grounded retrieval prompt engineering ensuring first-person ("I", "my") authentic responses',
        'Resilient local fallback engine ensuring 100% uptime even when offline or unauthenticated'
      ]
    },
    {
      id: 'coverage-gate',
      title: 'Automated 70% Code Coverage Quality Gate',
      category: 'DevOps & Code Quality',
      badge: 'Coverlet / Cobertura XML / Node.js Gate',
      why: 'Enforces strict code quality policies, ensuring all PRs and pushes to main maintain at least 70% line coverage before triggering production deployments.',
      highlights: [
        'Coverlet Cobertura XML report generation with compiler-generated code exclusions (coverlet.runsettings)',
        'Custom Node.js inspection script (.github/scripts/check-coverage.js) parsing line-rate metrics',
        'Blocks automated deployment to GCP Cloud Run if coverage drops below the required 70.00% threshold'
      ]
    },
    {
      id: 'discord-webhook',
      title: 'Discord Webhook Real-Time Push Notifications',
      category: 'Messaging & Notifications',
      badge: 'Discord API / Webhooks',
      why: 'Provides instant, zero-cost mobile push notifications for incoming recruiter contact form submissions, bypassing transactional email delay.',
      highlights: [
        'Fire-and-forget asynchronous Task dispatch preventing thread blocking on HTTP POST /api/contact',
        'Rich Discord Embed card formatting rendering Sender Name, Email, Company, Phone, Subject, and Message',
        'Securely injected via DISCORD_WEBHOOK_URL in ASP.NET Core IConfiguration and GitHub Secrets'
      ]
    },
    {
      id: 'docker',
      title: 'Multi-Stage Docker & Compose Profiles',
      category: 'Containerization',
      badge: 'Docker & Compose',
      why: 'Isolates heavy Node.js and .NET SDK build toolchains from the final 200MB production runtime container image.',
      highlights: [
        'Stage 1 (Node 20 Alpine) -> Stage 2 (.NET 10 SDK) -> Stage 3 (.NET 10 ASP.NET Runtime)',
        'Comprehensive .dockerignore excluding host node_modules to prevent cross-platform binary pollution',
        'Environment-differentiated Compose manifests: docker-compose.dev.yml (Debug logs) vs docker-compose.yml (Production)'
      ]
    },
    {
      id: 'cicd',
      title: 'GitHub Actions CI/CD & Automated Testing',
      category: 'DevOps Pipeline',
      badge: 'GitHub Actions',
      why: 'Guarantees production safety by executing parallel xUnit backend and Vitest frontend test suites on every commit.',
      highlights: [
        'xUnit .NET 10 test project verifying controller endpoints, recruiter filters, and CLI parser',
        'Vitest + React Testing Library component test runner',
        'Automated Docker build tagging: portfolio-app:dev on develop branch vs portfolio-app:prod on main branch'
      ]
    }
  ];

  return (
    <div style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge" style={{ marginBottom: '0.6rem', padding: '0.4rem 1rem' }}>
            <Layers size={14} /> Engineering Case Study
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800 }}>
            System Architecture & <span className="gradient-text">Design Rationale</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0.75rem auto 0 auto', fontSize: '1.05rem' }}>
            An in-depth breakdown of how this application was architected, containerized, and deployed using C# .NET 10, GCP Gemini AI Grounding, and React 19.
          </p>
        </div>

        {/* System Architecture Visual Flow */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent-cyan)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Chip color="var(--accent-cyan)" size={22} /> High-Level System Architecture Diagram
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
            position: 'relative'
          }}>
            {/* CI/CD & DevOps Layer */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                DEVOPS & PIPELINES (GITHUB ACTIONS)
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• Automated 70% Code Coverage Gate</li>
                <li>• GitHub CodeQL Static Security Scanning</li>
                <li>• GCP Gemini AI Automated PR Code Reviewer</li>
                <li>• Multi-Stage Docker Container Artifacts</li>
                <li>• GCP Cloud Run CD (Zero-Downtime Deployment)</li>
              </ul>
            </div>

            {/* Client Layer */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CLIENT LAYER (REACT 19)
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• Vite Single-Page App (SPA)</li>
                <li>• HSL CSS Theme System (Dark/Light)</li>
                <li>• Recruiter Perspective Filter State</li>
                <li>• Interactive CLI Terminal Component</li>
                <li>• Floating AI Persona Chat Drawer</li>
              </ul>
            </div>

            {/* Backend Layer */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                BACKEND API (.NET 10)
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• ASP.NET Core 10 Minimal APIs</li>
                <li>• Discord Webhook Real-Time Push Alerts</li>
                <li>• PortfolioService & Knowledge Base</li>
                <li>• CLI Terminal Parser Engine</li>
                <li>• Environment Loggers (Trace/Warning)</li>
                <li>• Static wwwroot Bundle Host</li>
              </ul>
            </div>

            {/* AI Layer */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                AI & CLOUD GROUNDING
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• GCP Gemini 2.5 / 1.5 Flash API</li>
                <li>• Grounded Resume System Context</li>
                <li>• First-Person Persona Instructions</li>
                <li>• Local Grounded Fallback Engine</li>
                <li>• Google Gemini CLI Integration</li>
              </ul>
            </div>

            {/* DevOps Layer */}
            <div style={{
              padding: '1.25rem',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-card-border)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                CONTAINERS & DEVOPS
              </div>
              <ul style={{ listStyle: 'none', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• Multi-Stage Alpine Dockerfile</li>
                <li>• docker-compose.dev.yml (Debug)</li>
                <li>• docker-compose.yml (Production)</li>
                <li>• GitHub Actions CI/CD Workflow</li>
                <li>• Parallel xUnit & Vitest Pipelines</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Architectural Decision Cards */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Architectural <span className="gradient-text">Design Rationales & Trade-Offs</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {decisions.map((d) => (
              <div key={d.id} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {d.category}
                    </span>
                    <span className="badge">{d.badge}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {d.title}
                  </h3>

                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 242, 254, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    color: 'var(--accent-cyan)',
                    marginBottom: '1rem',
                    borderLeft: '3px solid var(--accent-cyan)'
                  }}>
                    <strong>Why this choice:</strong> {d.why}
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    TECHNICAL IMPLEMENTATION DETAILS:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {d.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Interactivity Prompt */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(111, 76, 255, 0.15), rgba(0, 242, 254, 0.1))' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Want to test the architecture in action?
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Launch the interactive terminal or chat directly with Tim Forste's AI Persona grounded on GCP Gemini.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenAiChat} className="btn btn-primary">
              <Sparkles size={16} /> Ask AI Persona About Architecture
            </button>
            <button onClick={onOpenTerminal} className="btn btn-secondary">
              <Terminal size={16} /> Run CLI Commands
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
