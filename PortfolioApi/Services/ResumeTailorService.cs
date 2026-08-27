using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class ResumeTailorService : IResumeTailorService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResumeTailorService> _logger;
    private readonly string _baseResumeContext;

    public ResumeTailorService(
        HttpClient httpClient,
        IConfiguration configuration,
        IHostEnvironment env,
        ILogger<ResumeTailorService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        var jsonPath = Path.Combine(env.ContentRootPath, "Data", "ResumeKnowledgeBase.json");
        _baseResumeContext = File.Exists(jsonPath) ? File.ReadAllText(jsonPath) : string.Empty;
    }

    public async Task<SkillGapAnalysisResult> AnalyzeSkillGapsAsync(AnalyzeJobDescriptionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.JobDescriptionText))
        {
            throw new ArgumentException("Job description text cannot be empty.", nameof(request.JobDescriptionText));
        }

        var apiKey = _configuration["GEMINI_API_KEY"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            try
            {
                return await CallGeminiForSkillAnalysisAsync(request, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to call GCP Gemini API for skill gap analysis. Falling back to local analyzer.");
            }
        }

        return GenerateFallbackSkillAnalysis(request);
    }

    public async Task<GeneratedResumeResult> GenerateAtsResumeAsync(GenerateResumeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.JobDescriptionText))
        {
            throw new ArgumentException("Job description text cannot be empty.", nameof(request.JobDescriptionText));
        }

        var apiKey = _configuration["GEMINI_API_KEY"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            try
            {
                return await CallGeminiForAtsResumeAsync(request, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to call GCP Gemini API for ATS resume generation. Falling back to local generator.");
            }
        }

        return GenerateFallbackAtsResume(request);
    }

    private async Task<SkillGapAnalysisResult> CallGeminiForSkillAnalysisAsync(AnalyzeJobDescriptionRequest request, string apiKey)
    {
        var prompt = $$"""
        You are an expert ATS (Applicant Tracking System) Specialist and Technical Career Coach.
        Your task is to analyze a target Job Description against Tim Forste's Base Resume Knowledge Base.

        JOB TITLE: {{request.JobTitle}}
        COMPANY: {{request.Company}}

        JOB DESCRIPTION TEXT:
        {{request.JobDescriptionText}}

        TIM FORSTE BASE RESUME KNOWLEDGE BASE:
        {{_baseResumeContext}}

        INSTRUCTIONS:
        Respond ONLY with a valid JSON object matching this exact schema (no surrounding markdown code fences, no extra text):
        {
            "jobTitle": "Target job title",
            "company": "Company name",
            "matchPercentage": 85,
            "matchedSkills": [
                {
                    "skillName": "C# / .NET Core",
                    "proficiencyLevel": 98,
                    "evidenceFromResume": "11+ years experience modernizing legacy systems and building APIs."
                }
            ],
            "missingSkills": [
                {
                    "skillName": "Kubernetes / Helm",
                    "importanceCategory": "Core",
                    "suggestedComparableSkills": "GCP Cloud Run container deployment experience"
                }
            ],
            "summary": "High alignment for senior backend roles with minor gap in container orchestration."
        }
        """;

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.2,
                maxOutputTokens = 1500,
                responseMimeType = "application/json"
            }
        };

        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={apiKey}";
        var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(endpoint, requestContent);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseJson);

        var rawText = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        if (string.IsNullOrWhiteSpace(rawText))
        {
            return GenerateFallbackSkillAnalysis(request);
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var parsed = JsonSerializer.Deserialize<SkillAnalysisJsonResponse>(CleanJsonText(rawText), options);

        if (parsed == null)
        {
            return GenerateFallbackSkillAnalysis(request);
        }

        return new SkillGapAnalysisResult(
            string.IsNullOrWhiteSpace(parsed.JobTitle) ? request.JobTitle : parsed.JobTitle,
            string.IsNullOrWhiteSpace(parsed.Company) ? request.Company : parsed.Company,
            parsed.MatchPercentage > 0 ? parsed.MatchPercentage : 80,
            parsed.MatchedSkills ?? new List<MatchedSkillItem>(),
            parsed.MissingSkills ?? new List<MissingSkillItem>(),
            parsed.Summary ?? "Skill gap analysis completed.",
            "GCP Gemini 3.5 Flash-Lite (Live)"
        );
    }

    private async Task<GeneratedResumeResult> CallGeminiForAtsResumeAsync(GenerateResumeRequest request, string apiKey)
    {
        var overridesSummary = request.UserSkillOverrides != null && request.UserSkillOverrides.Any()
            ? string.Join("\n", request.UserSkillOverrides.Select(o => 
                $"- Skill: {o.SkillName} | User Possesses: {o.UserPossessesSkill} | Notes: {o.UserNotes ?? "None"}"))
            : "No user overrides specified.";

        var prompt = $$"""
        You are a top-tier Resume Writer specializing in ATS (Applicant Tracking System) optimization for Senior Software Engineering and Architecture roles.

        Generate a clean, professional, single-column ATS-Optimized Resume in Markdown format tailored for the job below.

        JOB TITLE: {{request.JobTitle}}
        COMPANY: {{request.Company}}

        JOB DESCRIPTION:
        {{request.JobDescriptionText}}

        USER VERIFIED SKILL OVERRIDES (Gaps user confirmed they have or have comparable experience for):
        {{overridesSummary}}

        BASE RESUME KNOWLEDGE BASE (Ground Truth):
        {{_baseResumeContext}}

        STRICT ATS FORMATTING & CONTENT GUIDELINES:
        1. Write in standard markdown with single-column layout (NO tables, NO columns, NO fancy ASCII graphics).
        2. Header: Name (Tim Forste), Title, Contact Info (Email: tforste@gmail.com, Phone: 971-600-4205, Location: Independence, OR, GitHub, LinkedIn).
        3. Professional Summary: 3-4 sentence powerful summary tailoring Tim's 12+ years of experience specifically to the posting's core requirements.
        4. Core Competencies: Categorized list of technical skills matching keywords in the posting.
        5. Professional Experience: Include real company achievements (Entegral, PetSafe Brands, Saif Corporation, State of Oregon). Quantify accomplishments with metrics (e.g., 0 SLA impact, 180,000 repairs, 15+ hours saved, 50% SQL query lift). Tailor bullet points with exact keywords from the posting.
        6. Education & Certifications: Oregon Institute of Technology (Software Engineering coursework).
        7. DO NOT invent false work history or false employers. Use Tim's real career history from the base resume knowledge base.

        Output ONLY the complete Markdown resume text.
        """;

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.3,
                maxOutputTokens = 2500
            }
        };

        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={apiKey}";
        var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync(endpoint, requestContent);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseJson);

        var markdown = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? string.Empty;

        var extractedKeywords = ExtractKeywordsFromJd(request.JobDescriptionText);

        return new GeneratedResumeResult(
            request.JobTitle,
            request.Company,
            markdown.Trim(),
            extractedKeywords,
            92,
            "GCP Gemini 3.5 Flash-Lite (Live)"
        );
    }

    private SkillGapAnalysisResult GenerateFallbackSkillAnalysis(AnalyzeJobDescriptionRequest request)
    {
        var jd = request.JobDescriptionText.ToLowerInvariant();
        var matched = new List<MatchedSkillItem>();
        var missing = new List<MissingSkillItem>();

        // Heuristic skill matching based on base resume keywords
        if (jd.Contains("c#") || jd.Contains(".net") || jd.Contains("asp.net"))
        {
            matched.Add(new MatchedSkillItem("C#, .NET Core & ASP.NET", 98, "11+ years experience architecting .NET microservices and legacy modernizations."));
        }
        if (jd.Contains("azure") || jd.Contains("gcp") || jd.Contains("cloud"))
        {
            matched.Add(new MatchedSkillItem("Cloud Platforms (Azure, GCP, GKE)", 92, "8+ years building cloud-native NestJS and .NET services processing 180k repairs."));
        }
        if (jd.Contains("sql") || jd.Contains("database") || jd.Contains("dapper") || jd.Contains("ef"))
        {
            matched.Add(new MatchedSkillItem("SQL, Oracle & ORMs (EF Core, Dapper)", 95, "12+ years database experience with 50%+ query performance optimization record."));
        }
        if (jd.Contains("microservices") || jd.Contains("service bus") || jd.Contains("pub/sub") || jd.Contains("event"))
        {
            matched.Add(new MatchedSkillItem("Event-Driven Architecture & Messaging", 95, "7+ years experience with Azure Service Bus, GCP Pub/Sub, and DLQ patterns."));
        }

        // Check potential gaps
        if (jd.Contains("aws") && !jd.Contains("azure") && !jd.Contains("gcp"))
        {
            missing.Add(new MissingSkillItem("AWS Cloud Services", "Core", "Extensive 8+ years Azure & GCP multi-cloud architectural experience."));
        }
        if (jd.Contains("python") || jd.Contains("django"))
        {
            missing.Add(new MissingSkillItem("Python Backend Frameworks", "Preferred", "Google Gemini CLI integration & C#/.NET Core expertise."));
        }
        if (jd.Contains("kubernetes") || jd.Contains("k8s") || jd.Contains("helm"))
        {
            missing.Add(new MissingSkillItem("Kubernetes / Helm Orchestration", "Preferred", "GCP Cloud Run and Docker container deployment background."));
        }

        if (!matched.Any())
        {
            matched.Add(new MatchedSkillItem("Senior Software Engineering Leadership", 95, "12+ years delivering enterprise software across Azure, GCP, and .NET."));
        }

        var matchScore = Math.Min(95, 70 + (matched.Count * 6));

        return new SkillGapAnalysisResult(
            request.JobTitle,
            request.Company,
            matchScore,
            matched,
            missing,
            "Grounded analysis completed comparing target job requirements against Tim Forste's 12+ year engineering background.",
            "GCP Gemini Grounded Engine (Local Mode)"
        );
    }

    private GeneratedResumeResult GenerateFallbackAtsResume(GenerateResumeRequest request)
    {
        var overridesText = request.UserSkillOverrides != null && request.UserSkillOverrides.Any(o => o.UserPossessesSkill)
            ? string.Join(", ", request.UserSkillOverrides.Where(o => o.UserPossessesSkill).Select(o => o.SkillName))
            : "Standard core proficiencies applied";

        var markdown = $"""
        # TIM FORSTE
        **Senior Software Engineer & Hybrid-Cloud Architect**
        Independence, OR | tforste@gmail.com | 971-600-4205 | github.com/ChumboMJ | linkedin.com/in/tforste

        ---

        ### PROFESSIONAL SUMMARY
        Senior Software Engineer with 12+ years of experience specializing in C#, .NET Core, ASP.NET, and hybrid-cloud architectures (Azure & GCP). Tailored for the **{request.JobTitle}** position at **{request.Company}**. Proven track record architecting event-driven microservices, modernizing legacy systems, and engineering high-throughput integrations.

        ---

        ### CORE COMPETENCIES
        - **Languages & Frameworks:** C#, .NET Core, ASP.NET Core, TypeScript, Node.js, NestJS
        - **Cloud & DevOps:** Azure App Services, GCP Cloud Run, Docker, Git, CI/CD Pipelines
        - **Databases & ORMs:** MS SQL Server, Oracle, Entity Framework Core, Dapper ORM, PostgreSQL
        - **Architecture:** Event-Driven Microservices, RESTful APIs, Azure Service Bus, GCP Pub/Sub, System Modernization
        - **Verified Match Highlights:** {overridesText}

        ---

        ### PROFESSIONAL EXPERIENCE

        **Senior Software Engineer** | Entegral (Enterprise Rent-A-Car) | *2021 – Present*
        - Architected and deployed GCP-hosted NestJS repair platform onboarding 7,000+ repair shops and processing 180,000 repairs with zero SLA impact.
        - Built automated NestJS event processing service utilizing Google Gemini CLI to ingest and parse complex XML payloads.
        - Designed cross-cloud monitoring pipelines ensuring 99.9% uptime for enterprise API integrations.

        **Senior Software Engineer** | PetSafe Brands | *2019 – 2021*
        - Architected automated HR integrations between Workday and Qualtrics using Azure Functions and Key Vault, saving HR 15+ hours weekly.
        - Re-architected nightly Salesforce batch syncs into real-time Azure Service Bus event streams.

        **Software Engineer Lead** | Saif Corporation | *2015 – 2019*
        - Earned official recognition from Federal OSHA for regulatory data integrity in claims software modernization.
        - Mentored junior developers and led weekly engineering architecture tech talks.

        ---

        ### EDUCATION
        **Oregon Institute of Technology** | Wilsonville, OR
        Software Engineering Coursework (Completed ~75% towards B.S. prior to enterprise software delivery engagement)
        """;

        return new GeneratedResumeResult(
            request.JobTitle,
            request.Company,
            markdown,
            ExtractKeywordsFromJd(request.JobDescriptionText),
            88,
            "GCP Gemini Grounded Engine (Local Mode)"
        );
    }

    private static string CleanJsonText(string text)
    {
        var cleaned = text.Trim();
        if (cleaned.StartsWith("```json", StringComparison.OrdinalIgnoreCase))
        {
            cleaned = cleaned.Substring(7);
        }
        else if (cleaned.StartsWith("```"))
        {
            cleaned = cleaned.Substring(3);
        }

        if (cleaned.EndsWith("```"))
        {
            cleaned = cleaned.Substring(0, cleaned.Length - 3);
        }

        return cleaned.Trim();
    }

    private static List<string> ExtractKeywordsFromJd(string text)
    {
        var keywords = new List<string> { "C#", ".NET Core", "Cloud", "APIs", "SQL", "Microservices", "System Architecture" };
        var lower = text.ToLowerInvariant();

        if (lower.Contains("azure")) keywords.Add("Azure");
        if (lower.Contains("gcp")) keywords.Add("GCP");
        if (lower.Contains("docker")) keywords.Add("Docker");
        if (lower.Contains("rest")) keywords.Add("REST APIs");
        if (lower.Contains("typescript")) keywords.Add("TypeScript");
        if (lower.Contains("dapper")) keywords.Add("Dapper");
        if (lower.Contains("entity framework") || lower.Contains("ef core")) keywords.Add("EF Core");

        return keywords.Distinct().ToList();
    }

    private class SkillAnalysisJsonResponse
    {
        [JsonPropertyName("jobTitle")]
        public string? JobTitle { get; set; }

        [JsonPropertyName("company")]
        public string? Company { get; set; }

        [JsonPropertyName("matchPercentage")]
        public int MatchPercentage { get; set; }

        [JsonPropertyName("matchedSkills")]
        public List<MatchedSkillItem>? MatchedSkills { get; set; }

        [JsonPropertyName("missingSkills")]
        public List<MissingSkillItem>? MissingSkills { get; set; }

        [JsonPropertyName("summary")]
        public string? Summary { get; set; }
    }
}
