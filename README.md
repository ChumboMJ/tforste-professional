# Interactive Software Engineer Resume & Portfolio (.NET 10 + React + GCP Gemini AI)

A full-stack, enterprise-grade interactive software engineer portfolio and resume application built with **ASP.NET Core 10 Web API** (`net10.0`), **GCP Gemini AI Grounding**, and **React 19 (Vite)**.

[![CI/CD Pipeline](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/ChumboMJ/tforste-professional/actions/workflows/ci-cd.yml)

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
