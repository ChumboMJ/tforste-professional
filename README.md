# Interactive Software Engineer Resume & Portfolio (.NET 10 + React + GCP Gemini AI)

A full-stack, enterprise-grade interactive software engineer portfolio and resume application built with **ASP.NET Core 10 Web API** (`net10.0`), **GCP Gemini AI Grounding**, and **React 19 (Vite)**.

[![CI/CD Pipeline](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml)
[![CodeQL Security Scan](https://github.com/ChumboMJ/tforste-professional/actions/workflows/codeql.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/codeql.yml)
[![AI Code Review](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ai-code-review.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ai-code-review.yml)
[![GCP Cloud Run CD](https://github.com/ChumboMJ/tforste-professional/actions/workflows/cd-deploy.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/cd-deploy.yml)

---

## Key Features

- **ATS-Friendly Resume Tailor & Skill Gap Analyzer (`/resume-tailor`)**: Simplify+-style AI resume tailor leveraging GCP Gemini API (`gemini-3.5-flash-lite`) to analyze target job descriptions against Tim's Base Resume, extract required skills, present an interactive human-in-the-loop skill review matrix (matched skills vs missing gaps with custom overrides), and generate single-column ATS-optimized resumes with 1-click text copy and PDF download.
- **Interactive Cloud Microservices Mesh (Hero Section)**: High-impact interactive background canvas in the Hero section featuring floating microservice tech nodes (`.NET 10`, `C#`, `GCP`, `Azure`, `Gemini AI`, `Kubernetes`, `Docker`, `CI/CD`, `Automated Testing`, `React`), real-time mouse tracking, animated data packet pulses, and theme-aware contrast adaptation for Light & Dark modes.
- **Sub-2s GCP Gemini AI Grounded Persona**: Interactive career assistant powered by GCP Gemini (`Gemini 3.5 Flash-Lite`) grounded on your exact resume and project case studies with sub-1.5s latency, capped output token buffers, and a zero-downtime local fallback engine.
- **Native View Transitions API**: Smooth, GPU-accelerated layout morphing transitions (380ms slide-scale-blur keyframe animation) when switching between *Interactive Resume* and *System Architecture* views or toggling recruiter filters.
- **Client-Side Markdown Formatting Engine**: Custom React markdown parser for AI responses, rendering formatted bulleted lists with cyan markers, bold metric callouts, and clean paragraph line breaks.
- **Recruiter Perspective Filter**: Toggle between *Full Stack*, *Backend & APIs*, *Cloud & DevOps*, and *AI & Data* views to dynamically filter skills, projects, and career highlights with position-locked header tabs.
- **Interactive CLI Terminal**: Terminal drawer component with quick autocomplete pills (`help`, `skills`, `projects`, `exp`, `ask`, `tailor`, `clear`, `cat resume.json`).
- **Promptfoo AI Evaluation Suite**: Automated AI persona evaluation framework (`promptfooconfig.yaml`) asserting tone, safety guardrails (polite off-topic declines), and factual metric verification.
- **Glassmorphism HSL Design System**: Dark cyber & light slate theme toggle with `@media print` single-click PDF export layout.
- **Automated Testing & Coverage Gate**: 100% passing backend .NET 10 xUnit tests with an enforced 70% minimum code coverage CI/CD quality gate (currently **83.6%**).

---

## 🎨 Hero Section & Motion Design

The **Hero Section** serves as the visual centerpiece of the portfolio, combining real-time canvas animation with interactive cloud microservice telemetry:

1. **Floating Tech Nodes**: 10 core technical skill badges (`.NET 10`, `C#`, `GCP`, `Azure`, `Gemini AI`, `Kubernetes`, `Docker`, `CI/CD`, `Automated Testing`, `React`) drift smoothly across an HTML5 Canvas.
2. **Animated Data Pulses**: Simulated network packets pulse along dynamic connection lines between nearby nodes, representing distributed microservices communication.
3. **Cursor Interaction**: Moving the mouse across the canvas creates magnetic node attraction and expands node glow radii.
4. **Theme-Aware Contrast Engine**: Automatically adjusts node colors, stroke opacity, and text badge fills depending on the active theme (`data-theme="dark"` vs `data-theme="light"`) to ensure crisp readability on any background.
5. **High-DPI Retina Scaling**: Utilizes `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` to maintain ultra-crisp vector rendering on 4K and Retina displays without compounding scaling matrix artifacts.

---

## 📄 ATS-Friendly Resume Tailor & Skill Gap Analyzer (`/resume-tailor`)

Built to streamline job applications (Simplify+-style), this feature uses the existing **GCP Gemini AI** integration (`gemini-3.5-flash-lite`) and ground-truth base resume knowledge base (`ResumeKnowledgeBase.json`) to analyze any target job description and generate tailored ATS-friendly resumes.

### Workflow:
1. **Job Description Parsing (`POST /api/resume-tailor/analyze`)**:
   - Paste any target job description into `/resume-tailor`.
   - Gemini extracts key technical requirements and compares them against Tim's 12+ years of software engineering history.
   - Generates an **ATS Match Score %**, a breakdown of **Matched Skills** (with resume evidence), and a checklist of **Skill Gaps**.
2. **Human-in-the-Loop Interactive Review**:
   - An interactive checklist lets you check off any missing skills you possess or have comparable experience for (e.g. mapping AWS SQS experience to Azure Service Bus).
   - Add optional custom context or notes before generation.
3. **ATS Resume Generation (`POST /api/resume-tailor/generate`)**:
   - Synthesizes a clean, single-column markdown resume tailored specifically for the position.
   - Enforces ATS scanner guidelines (standard headers, quantifiable metric bullet points, natural keyword integration, no complex tables).
   - Features 1-click **Copy Plain Text** and **Print / Download PDF**.

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

This repository leverages 100% free automated code review and quality enforcement tools on every Pull Request and commit:

1. **📏 70% Minimum Code Coverage Quality Gate (`.github/workflows/ci-cd.yml`)**:
   - Enforces a mandatory **70.00% minimum line coverage threshold** on `PortfolioApi` using Coverlet and a custom validator script (`.github/scripts/check-coverage.js`).
   - Compiler-generated code (`*.generated.cs`) is automatically excluded via `PortfolioApi.Tests/coverlet.runsettings`.
   - **PR Merges to `main` will fail** if backend code coverage falls below 70.00%.
2. **🤖 GCP Gemini AI Automated Code Reviewer (`.github/workflows/ai-code-review.yml`)**:
   - Triggers on PRs to `main`. Passes the PR git diff to GCP Gemini, generating line-by-line code review feedback, architecture recommendations, and security suggestions directly on your Pull Request.
3. **🛡️ GitHub CodeQL Static Security Analysis (`.github/workflows/codeql.yml`)**:
   - Runs deep semantic static security analysis for C# and TypeScript/JavaScript. Scans for OWASP Top 10 vulnerabilities, SQL injection risks, and bad coding practices.
4. **🧹 Automated Unit Testing & Build Validation (`.github/workflows/ci-cd.yml`)**:
   - Executes parallel .NET 10 xUnit and React Vitest suites on every commit.

---

## Running Automated Tests & Code Coverage Locally

### 1. Backend xUnit Test Suite & Coverage Check (.NET 10)
Run the backend test suite with Coverlet coverage collection and verify the 70% threshold gate locally:

```powershell
# Step 1: Run xUnit tests with Coverlet coverage collection
dotnet test PortfolioApi.Tests/PortfolioApi.Tests.csproj --settings PortfolioApi.Tests/coverlet.runsettings --collect:"XPlat Code Coverage"

# Step 2: Enforce the 70% code coverage threshold gate locally
node .github/scripts/check-coverage.js
```

> **Expected Output**:
> ```text
> 🔍 Inspecting coverage report: PortfolioApi.Tests\TestResults\...\coverage.cobertura.xml
> --------------------------------------------------
> 📊 Current Backend Line Coverage: 84.03%
> 🎯 Required Minimum Threshold:     70.00%
> --------------------------------------------------
> ✅ POLICY SUCCESS: Backend line coverage requirement met (84.03% >= 70%)!
> ```

### 2. Frontend Vitest Suite & Coverage Check (React 19)
Run frontend Vitest unit tests and generate a V8 coverage report:

```powershell
cd client

# Run Vitest unit tests
npm test

# Run Vitest with V8 code coverage report
npm run test:coverage
```

### 3. Promptfoo AI Persona Evaluation Suite (GCP Gemini)
Run automated evaluation assertions against the live or local AI Persona API:

```powershell
# Run Promptfoo evaluation suite
npx promptfoo eval

# Launch interactive web UI to inspect assertions & diffs
npx promptfoo view
```

---

## Git Branching Strategy

- **`develop`**: Active development branch. All feature commits go here. Uses `docker-compose.dev.yml` and `portfolio-app:dev` builds.
- **`main`**: Production release branch. Accepts merges via Pull Requests. Uses `docker-compose.yml` and `portfolio-app:prod` builds.
