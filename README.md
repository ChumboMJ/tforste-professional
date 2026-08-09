# Interactive Software Engineer Resume & Portfolio (.NET 10 + React + GCP Gemini AI)

A full-stack, enterprise-grade interactive software engineer portfolio and resume application built with **ASP.NET Core 10 Web API** (`net10.0`), **GCP Gemini AI Grounding**, and **React 19 (Vite)**.

[![CI/CD Pipeline](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml)
[![CodeQL Security Scan](https://github.com/ChumboMJ/tforste-professional/actions/workflows/codeql.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/codeql.yml)
[![AI Code Review](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ai-code-review.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ai-code-review.yml)

---

## Key Features

- **ASP.NET Core 10 Web API**: RESTful endpoints for profile data, skills matrix, career experience, terminal execution, and contact inquiries.
- **GCP Gemini AI Grounded Persona**: Interactive career assistant powered by GCP Gemini (`Gemini 2.5 Flash`) grounded on your exact resume and project case studies with a zero-downtime local fallback engine.
- **Recruiter Perspective Filter**: Toggle between *Full Stack*, *Backend & APIs*, *Cloud & DevOps*, and *AI & Data* views to dynamically filter skills, projects, and career highlights.
- **Interactive CLI Terminal**: Terminal drawer component with quick autocomplete pills (`help`, `skills`, `projects`, `exp`, `ask`, `clear`, `cat resume.json`).
- **Glassmorphism HSL Design System**: Dark cyber & light slate theme toggle with `@media print` single-click PDF export layout.
- **Automated Testing Suite**: 100% passing backend .NET 10 xUnit tests and frontend React Vitest tests.

---

## Running the Application Locally

### Option 1: Live Development Server (Hot-Reloading)
```powershell
# Terminal 1: Run ASP.NET Core 10 API
dotnet run --project PortfolioApi

# Terminal 2: Run React Vite Dev Server
cd client
npm run dev

# Open browser at http://localhost:5173
```

### Option 2: Production Bundle via .NET 10 Web API
```powershell
dotnet run --project PortfolioApi
# Open browser at http://localhost:5200
```

---

## Docker Compose Environments (Develop vs Production)

The project includes environment-differentiated Docker Compose manifests to separate development logging from production builds.

### 🛠️ Running Development Mode (`develop` branch)
Runs image `portfolio-app:dev` with verbose `Debug` and `Trace` logging enabled:
```powershell
docker compose -f docker-compose.dev.yml up --build
```
> **What to expect**: Terminal output will display detailed ASP.NET Core `[DEBUG]` and `[TRACE]` logs for incoming API requests, CLI commands, and AI queries.

### 🚀 Running Production Mode (`main` branch)
Runs image `portfolio-app:prod` with `ASPNETCORE_ENVIRONMENT=Production` (concise `Warning` / `Error` logging level):
```powershell
docker compose up --build
```
> **What to expect**: The application runs at `http://localhost:8080` with production security settings and optimized performance.

---

## Automated Code Review & Security Pipeline

This repository leverages 100% free automated code review tools to enforce senior engineering standards on every Pull Request:

1. **🤖 GCP Gemini AI Automated Code Reviewer (`.github/workflows/ai-code-review.yml`)**:
   - Triggers on PRs to `main`. Passes the PR git diff to GCP Gemini, generating line-by-line code review feedback, architecture recommendations, and security suggestions directly on your Pull Request.
2. **🛡️ GitHub CodeQL Static Security Analysis (`.github/workflows/codeql.yml`)**:
   - Runs deep semantic static security analysis for C# and TypeScript/JavaScript. Scans for OWASP Top 10 vulnerabilities, SQL injection risks, and bad coding practices.
3. **🧹 Automated Unit Testing & Build Validation (`.github/workflows/ci-cd.yml`)**:
   - Executes parallel .NET 10 xUnit and React Vitest suites on every commit.

---

## Running Automated Tests

### Backend xUnit Test Suite (.NET 10)
```powershell
dotnet test PortfolioApi.Tests/PortfolioApi.Tests.csproj
```

### Frontend Vitest Suite (React)
```powershell
cd client
npm test
```

---

## Git Branching Strategy

- **`develop`**: Active development branch. All feature commits go here. Uses `docker-compose.dev.yml` and `portfolio-app:dev` builds.
- **`main`**: Production release branch. Accepts merges via Pull Requests. Uses `docker-compose.yml` and `portfolio-app:prod` builds.
