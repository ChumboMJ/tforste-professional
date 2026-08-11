using System.Text.Json;
using PortfolioApi.Models;

namespace PortfolioApi.Services;

public class PortfolioService : IPortfolioService
{
    private readonly ProfileDto _profile;
    private readonly List<SkillItem> _skills;
    private readonly List<ProjectItem> _projects;
    private readonly List<ExperienceItem> _experiences;
    private readonly IGeminiAiService _aiService;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public PortfolioService(IHostEnvironment env, IGeminiAiService aiService, IConfiguration configuration, HttpClient? httpClient = null)
    {
        _aiService = aiService;
        _configuration = configuration;
        _httpClient = httpClient ?? new HttpClient();

        var jsonPath = Path.Combine(env.ContentRootPath, "Data", "ResumeKnowledgeBase.json");

        if (!File.Exists(jsonPath))
        {
            throw new FileNotFoundException($"Knowledge base file missing at: {jsonPath}");
        }

        var rawJson = File.ReadAllText(jsonPath);
        using var doc = JsonDocument.Parse(rawJson);
        var root = doc.RootElement;

        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        _profile = JsonSerializer.Deserialize<ProfileDto>(root.GetProperty("profile").GetRawText(), jsonOptions)!;
        _skills = JsonSerializer.Deserialize<List<SkillItem>>(root.GetProperty("skills").GetRawText(), jsonOptions)!;
        _projects = JsonSerializer.Deserialize<List<ProjectItem>>(root.GetProperty("projects").GetRawText(), jsonOptions)!;
        _experiences = JsonSerializer.Deserialize<List<ExperienceItem>>(root.GetProperty("experience").GetRawText(), jsonOptions)!;
    }

    public ProfileDto GetProfile() => _profile;

    public List<SkillItem> GetSkills(string? category = null, string? recruiterPerspective = null)
    {
        var query = _skills.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(s => s.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(recruiterPerspective) && !recruiterPerspective.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = recruiterPerspective.ToLowerInvariant() switch
            {
                "backend" => query.Where(s => s.Category is "Backend & APIs" or "Databases & Architecture" or "Cloud & DevOps"),
                "fullstack" => query,
                "devops" => query.Where(s => s.Category is "Cloud & DevOps" or "Databases & Architecture"),
                "ai" => query.Where(s => s.Category is "AI & ML" or "Backend & APIs" or "Cloud & DevOps"),
                _ => query
            };
        }

        return query.OrderByDescending(s => s.ProficiencyPercent).ToList();
    }

    public List<ProjectItem> GetProjects(string? category = null, bool? featuredOnly = null)
    {
        var query = _projects.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        if (featuredOnly == true)
        {
            query = query.Where(p => p.Featured);
        }

        return query.ToList();
    }

    public List<ExperienceItem> GetExperiences(string? recruiterPerspective = null)
    {
        var query = _experiences.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(recruiterPerspective) && !recruiterPerspective.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(e => e.RecruiterCategories.Any(rc => rc.Equals(recruiterPerspective, StringComparison.OrdinalIgnoreCase)));
        }

        return query.ToList();
    }

    public TerminalResponse ExecuteTerminalCommand(string rawCommand)
    {
        if (string.IsNullOrWhiteSpace(rawCommand))
        {
            return new TerminalResponse("Type 'help' to see available commands.", "text");
        }

        var trimmed = rawCommand.Trim();
        var parts = trimmed.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        var cmd = parts[0].ToLowerInvariant();
        var args = parts.Length > 1 ? parts[1] : string.Empty;

        return cmd switch
        {
            "help" => new TerminalResponse(
                "AVAILABLE COMMANDS:\n" +
                "  help              - Display CLI command list\n" +
                "  skills            - List top technical proficiencies\n" +
                "  projects          - Display featured engineering projects\n" +
                "  exp / experience  - Show career history & SLA track record\n" +
                "  contact           - Display developer contact info\n" +
                "  ask <question>    - Query GCP Gemini AI trained on my resume\n" +
                "  clear             - Clear terminal display screen\n" +
                "  whoami            - Display active user session profile\n" +
                "  cat resume.json   - Output full raw JSON resume payload",
                "text"
            ),

            "skills" => new TerminalResponse(
                string.Join("\n", _skills.Select(s => $"• {s.Name,-30} [{s.ProficiencyPercent}%] ({s.Category})")),
                "text"
            ),

            "projects" => new TerminalResponse(
                string.Join("\n\n", _projects.Select(p => $"🚀 {p.Title.ToUpper()}\n   {p.Subtitle}\n   Tech: {string.Join(", ", p.TechStack)}\n   Role: {p.Role}")),
                "text"
            ),

            "exp" or "experience" => new TerminalResponse(
                string.Join("\n\n", _experiences.Select(e => $"💼 {e.RoleTitle} @ {e.Company} ({e.Period})\n   Key Impact: {string.Join(" | ", e.ImpactHighlights)}")),
                "text"
            ),

            "contact" => new TerminalResponse(
                $"📧 Email: {_profile.SocialLinks["email"]}\n🐙 GitHub: {_profile.SocialLinks["github"]}\n💼 LinkedIn: {_profile.SocialLinks["linkedin"]}\n📍 Location: {_profile.Location}",
                "text"
            ),

            "whoami" => new TerminalResponse(
                $"Session User: Guest Recruiter / Engineering Leader\nTargeting Profile: {_profile.Name} - {_profile.Title}\nStatus: {_profile.AvailabilityStatus}",
                "text"
            ),

            "cat" when args.Equals("resume.json", StringComparison.OrdinalIgnoreCase) => new TerminalResponse(
                JsonSerializer.Serialize(_profile, new JsonSerializerOptions { WriteIndented = true }),
                "json"
            ),

            "ask" => ExecuteAiAskCommand(args),

            "clear" => new TerminalResponse("", "clear"),

            _ => new TerminalResponse($"Command not recognized: '{cmd}'. Type 'help' for command list.", "error")
        };
    }

    private TerminalResponse ExecuteAiAskCommand(string question)
    {
        if (string.IsNullOrWhiteSpace(question))
        {
            return new TerminalResponse("Usage: ask <question> (e.g. ask What is your experience with Kubernetes and .NET?)", "text");
        }

        var aiTask = _aiService.AskAsync(new AiChatRequest(question));
        var aiResult = aiTask.GetAwaiter().GetResult();

        return new TerminalResponse(
            $"🤖 AI Resume Assistant ({aiResult.ModelUsed}):\n\n{aiResult.Answer}\n\nSuggested follow-ups:\n" +
            string.Join("\n", aiResult.SuggestedFollowUps.Select(f => $"  > ask {f}")),
            "text"
        );
    }

    public ContactMessageResponse SubmitContactMessage(ContactMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Message))
        {
            return new ContactMessageResponse(false, "Name, email, and message are required fields.", DateTime.UtcNow);
        }

        // Fire-and-forget Discord Webhook dispatch if DISCORD_WEBHOOK_URL is configured
        var webhookUrl = _configuration["DISCORD_WEBHOOK_URL"] ?? Environment.GetEnvironmentVariable("DISCORD_WEBHOOK_URL");
        if (!string.IsNullOrWhiteSpace(webhookUrl))
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    var discordPayload = new
                    {
                        username = "Portfolio Contact Bot",
                        embeds = new[]
                        {
                            new
                            {
                                title = "📩 New Portfolio Contact Inquiry",
                                color = 65534, // Aqua Cyan
                                fields = new[]
                                {
                                    new { name = "👤 Sender Name", value = request.Name, inline = true },
                                    new { name = "📧 Sender Email", value = request.Email, inline = true },
                                    new { name = "📝 Subject", value = string.IsNullOrWhiteSpace(request.Subject) ? "General Inquiry" : request.Subject, inline = false },
                                    new { name = "💬 Message", value = request.Message, inline = false }
                                },
                                footer = new { text = "Tim Forste Portfolio App • ASP.NET Core 10 Web API" },
                                timestamp = DateTime.UtcNow.ToString("o")
                            }
                        }
                    };

                    var content = new StringContent(JsonSerializer.Serialize(discordPayload), System.Text.Encoding.UTF8, "application/json");
                    await _httpClient.PostAsync(webhookUrl, content);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Discord Webhook Warning] Failed to dispatch contact message: {ex.Message}");
                }
            });
        }

        return new ContactMessageResponse(
            true,
            $"Thank you {request.Name}! Your message regarding '{request.Subject}' has been dispatched directly to {_profile.Name}'s inbox.",
            DateTime.UtcNow
        );
    }
}
