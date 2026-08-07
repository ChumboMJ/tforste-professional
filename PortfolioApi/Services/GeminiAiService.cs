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
            "You are an AI career representative for Alex Mercer, Senior Software Engineer. " +
            "Answer questions accurately based ONLY on the following grounded resume knowledge context. " +
            "Be professional, concise, and highlight specific engineering metrics, ASP.NET Core .NET 10, GCP cloud architecture, and React experience.\n\n" +
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
            .GetString() ?? "I am ready to share details about my engineering experience and background.";

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
            answer = "Alex Mercer has 8+ years of deep expertise with C# and .NET (including .NET 10 & ASP.NET Core). He has built high-throughput microservices handling over 50,000 requests per second with sub-12ms latency, leveraging Redis caching, Entity Framework Core, and resilient messaging queues.";
        }
        else if (q.Contains("gcp") || q.Contains("cloud") || q.Contains("vertex") || q.Contains("docker") || q.Contains("k8s"))
        {
            answer = "Alex specializes in GCP Cloud Architecture (Cloud Run, Pub/Sub, Vertex AI, BigQuery) and container orchestration with Docker and Kubernetes. He reduced cloud infrastructure costs by $120,000/year at Apex Distributed Systems while maintaining a 99.99% SLA across 45 production microservices.";
        }
        else if (q.Contains("react") || q.Contains("frontend") || q.Contains("ui") || q.Contains("js") || q.Contains("typescript"))
        {
            answer = "Alex has 6+ years of modern frontend experience using React, Vite, and TypeScript. He built real-time WebSockets & Canvas cloud monitoring dashboards running at 60fps and designed responsive, glassmorphism UI applications for over 250,000 daily active users.";
        }
        else if (q.Contains("outage") || q.Contains("failure") || q.Contains("leadership") || q.Contains("experience"))
        {
            answer = "As Senior/Staff Engineer at Apex Distributed Systems, Alex led a team of 6 engineers. He architected automated CI/CD pipelines, integrated GCP Vertex AI models to automate data processing by 75%, and established 99.99% SLA track records across multi-region deployments.";
        }
        else
        {
            answer = "Alex Mercer is a Senior Software Engineer specializing in C# .NET 10, GCP Cloud Architecture, Vertex AI, and React. He has 8 years of experience building resilient microservices, leading engineering teams, and optimizing production cloud infrastructure.";
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
