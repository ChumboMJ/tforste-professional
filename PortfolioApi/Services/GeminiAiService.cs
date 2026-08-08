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
            "You are Tim Forste's AI Persona, speaking directly in the FIRST PERSON ('I', 'my', 'me'). " +
            "ALWAYS answer as Tim Forste himself (e.g., 'I have 12+ years of experience', 'My work at Entegral involved...', 'I built...'). " +
            "NEVER refer to Tim in the third person ('he', 'him', 'Tim Forste'). " +
            "Be professional, technical, pragmatic, and concise, emphasizing C#, .NET Core, Azure, GCP (GKE, Pub/Sub), Google Gemini CLI integrations, and event-driven architecture.\n\n" +
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
            .GetString() ?? "I am Tim Forste's AI Persona, ready to answer questions about my engineering background and technical work.";

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
            answer = "I have 12+ years of experience specializing in C#, .NET Core, and ASP.NET. I have modernized legacy batch jobs into real-time event-driven solutions using .NET Core, Azure Service Bus, and Dapper ORM, and integrated enterprise finance systems with KeyBank achieving 100% payment uptime.";
        }
        else if (q.Contains("gcp") || q.Contains("azure") || q.Contains("cloud") || q.Contains("gemini") || q.Contains("docker"))
        {
            answer = "I have extensive hybrid-cloud experience across Azure and GCP. At Entegral, I deployed a GCP-hosted NestJS application onboarding 7,000+ shops processing 180,000 repairs, and built a NestJS service utilizing the Google Gemini CLI to ingest and parse XML event payloads.";
        }
        else if (q.Contains("petsafe") || q.Contains("workday") || q.Contains("qualtrics") || q.Contains("service bus"))
        {
            answer = "At PetSafe Brands, I architected automated HR integrations between Workday and Qualtrics using Azure Functions and Key Vault (saving HR 15+ hours weekly) and re-architected legacy nightly Salesforce batch syncs into real-time Azure Service Bus event streams.";
        }
        else if (q.Contains("mentorship") || q.Contains("leadership") || q.Contains("experience") || q.Contains("saif"))
        {
            answer = "I am a pragmatic technical leader with 12+ years of experience. At Saif Corporation, I earned official recognition from Federal OSHA for regulatory data integrity, mentored 4 developers, and led organizational Tech Talks for 12-20 engineers.";
        }
        else
        {
            answer = "Hi! I am Tim Forste's AI Persona. I have 12+ years of experience specializing in C#, .NET Core, Azure, GCP, and event-driven microservices, with a strong track record of high observability, legacy modernization, and AI integrations using Google Gemini CLI.";
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
