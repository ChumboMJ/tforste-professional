import React from 'react';

export default function PrintResumeView({ profile }) {
  if (!profile) return null;

  return (
    <div className="print-only-resume">
      <div style={{ borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>{profile.name}</h1>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#444' }}>{profile.title}</div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
          {profile.location} | Email: {profile.socialLinks?.email} | GitHub: {profile.socialLinks?.github} | LinkedIn: {profile.socialLinks?.linkedin}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>Executive Summary</h2>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{profile.bio}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>Core Technical Competencies</h2>
        <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          <strong>Languages & Frameworks:</strong> C# .NET 10, ASP.NET Core, React, TypeScript, Python, SQL<br />
          <strong>Cloud & DevOps:</strong> GCP (Cloud Run, Vertex AI, Pub/Sub, BigQuery), Docker, Kubernetes, CI/CD GitHub Actions<br />
          <strong>Databases & Storage:</strong> PostgreSQL, EF Core, Redis, Distributed Caching
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', paddingBottom: '0.25rem' }}>Professional Track Record</h2>
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ fontWeight: 'bold' }}>Senior / Staff Software Engineer — Apex Distributed Systems (2022 - Present)</div>
          <ul>
            <li>Led a team of 6 software engineers building cloud-native microservices on ASP.NET Core and GCP.</li>
            <li>Reduced annual cloud infrastructure costs by $120,000 via container & queue optimization.</li>
            <li>Maintained 99.99% SLA across 45 core production microservices.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
