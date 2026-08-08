using System.Text;
using System.Text.Json;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class GeminiAiService : IGeminiAiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GeminiAiService> _logger;
    private readonly string _knowledgeContext;

    public GeminiAiService(HttpClient httpClient, IConfiguration configuration, IHostEnvironment env, ILogger<GeminiAiService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        var jsonPath = Path.Combine(env.ContentRootPath, "Data", "ResumeKnowledgeBase.json");
        _knowledgeContext = File.Exists(jsonPath) ? File.ReadAllText(jsonPath) : string.Empty;
    }

    public async Task<AiChatResponse> AskAsync(AiChatRequest request)
    {
        var apiKey = _configuration["GEMINI_API_KEY"] ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            try
            {
                return await CallGcpGeminiApiAsync(request.Message, apiKey);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error invoking GCP Gemini API endpoint. Falling back to local grounded engine.");
            }
        }

        // Local grounded AI response engine
        return GenerateGroundedFallbackResponse(request.Message);
    }

    private async Task<AiChatResponse> CallGcpGeminiApiAsync(string prompt, string apiKey)
    {
        var systemInstruction = 
            "You are an AI career representative for Tim Forste, Senior Software Engineer with 12+ years of experience. " +
            "Answer questions accurately based ONLY on the grounded resume knowledge context below. " +
            "Be professional, technical, concise, and emphasize C#, .NET Core, Azure, GCP (GKE, Pub/Sub), Google Gemini CLI integrations, and event-driven architecture.\n\n" +
            $"Resume Knowledge Base Context:\n{_knowledgeContext}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = $"{systemInstruction}\n\nUser Question: {prompt}" }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.2,
                maxOutputTokens = 800
            }
        };

        var requestJson = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
        var response = await _httpClient.PostAsync(endpoint, content);

        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseJson);
        
        var text = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? "Tim Forste is a Senior Software Engineer specializing in C#, .NET Core, Azure, and GCP.";

        return new AiChatResponse(
            text.Trim(),
            GetSuggestedFollowUps(prompt),
            "GCP Gemini 2.5/1.5 Flash (Live)",
            true
        );
    }

    private AiChatResponse GenerateGroundedFallbackResponse(string query)
    {
        var q = query.ToLowerInvariant();
        string answer;

        if (q.Contains("c#") || q.Contains(".net") || q.Contains("backend") || q.Contains("asp.net"))
        {
            answer = "Tim Forste has 12+ years of deep experience with C#, .NET Core, and ASP.NET. He has modernized legacy batch jobs into real-time event-driven solutions using .NET Core, Azure Service Bus, and Dapper ORM, and integrated enterprise finance systems with KeyBank achieving 100% payment uptime.";
        }
        else if (q.Contains("gcp") || q.Contains("azure") || q.Contains("cloud") || q.Contains("gemini") || q.Contains("docker"))
        {
            answer = "Tim has extensive hybrid-cloud experience across Azure and GCP. At Entegral, he deployed a GCP-hosted NestJS app onboarded 7,000+ shops processing 180,000 repairs, and built a NestJS service utilizing the Google Gemini CLI to ingest and parse XML event payloads.";
        }
        else if (q.Contains("petsafe") || q.Contains("workday") || q.Contains("qualtrics") || q.Contains("service bus"))
        {
            answer = "At PetSafe Brands, Tim architected automated HR integrations between Workday and Qualtrics using Azure Functions and Key Vault (saving HR 15+ hrs/week) and re-architected legacy nightly Salesforce batch syncs into real-time Azure Service Bus event streams.";
        }
        else if (q.Contains("mentorship") || q.Contains("leadership") || q.Contains("experience") || q.Contains("saif"))
        {
            answer = "Tim is a pragmatic technical leader with 12+ years of experience. At Saif Corporation, he earned official recognition from Federal OSHA for regulatory data integrity, mentored 4 developers, and led organizational Tech Talks for 12-20 engineers.";
        }
        else
        {
            answer = "Tim Forste is a Senior Software Engineer with 12+ years of experience specializing in C#, .NET Core, Azure, GCP, and event-driven microservices. He has a track record of high observability, legacy modernization, and AI integration with Google Gemini CLI.";
        }

        return new AiChatResponse(
            answer,
            GetSuggestedFollowUps(query),
            "GCP Gemini Grounded Engine (Local Mode)",
            true
        );
    }

    private static List<string> GetSuggestedFollowUps(string query)
    {
        var q = query.ToLowerInvariant();

        if (q.Contains("c#") || q.Contains(".net"))
        {
            return new List<string>
            {
                "What experience do you have with GCP Cloud Run and Pub/Sub?",
                "Can you describe your work with React and WebSockets?",
                "Tell me about your leadership and team experience."
            };
        }

        return new List<string>
        {
            "What is your experience with C# .NET 10 and microservices?",
            "How do you utilize GCP Vertex AI and Generative Models?",
            "What are your top engineering accomplishments and metrics?"
        };
    }
}
