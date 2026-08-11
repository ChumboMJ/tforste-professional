namespace PortfolioApi.Models;

public record ProfileDto(
    string Name,
    string Title,
    string Location,
    string Bio,
    string AvailabilityStatus,
    List<string> TopRoles,
    Dictionary<string, string> SocialLinks,
    CoreMetrics Metrics
);

public record CoreMetrics(
    int YearsOfExperience,
    int ProductionServicesDeployed,
    string SystemUptimeTrackRecord,
    int OpenSourceContributions
);

public record SkillItem(
    string Id,
    string Name,
    string Category, // Frontend, Backend & APIs, Cloud & DevOps, Databases & Architecture, AI & ML
    int ProficiencyPercent,
    int YearsExperience,
    List<string> HighlightedProjects,
    bool CoreCompetency
);

public record ProjectItem(
    string Id,
    string Title,
    string Subtitle,
    string Description,
    string Role,
    List<string> TechStack,
    List<string> KeyMetrics,
    string ArchitectureOverview,
    string DemoUrl,
    string GithubUrl,
    string Category, // Cloud Infrastructure, Microservices, Full-Stack Apps, AI / Machine Learning
    bool Featured
);

public record ExperienceItem(
    string Id,
    string RoleTitle,
    string Company,
    string Period,
    string Location,
    List<string> Responsibilities,
    List<string> TechnologiesUsed,
    List<string> RecruiterCategories, // FullStack, Backend, DevOps, AI
    List<string> ImpactHighlights
);

public record TerminalRequest(string Command);

public record TerminalResponse(
    string Output,
    string Type, // text, json, help, error, clear
    object? Metadata = null
);

public record ContactMessageRequest(
    string Name,
    string Email,
    string Subject,
    string Message,
    string? Phone = null
);

public record ContactMessageResponse(
    bool Success,
    string ConfirmationMessage,
    DateTime Timestamp
);

public record AiChatRequest(
    string Message,
    string? ConversationTopic = null
);

public record AiChatResponse(
    string Answer,
    List<string> SuggestedFollowUps,
    string ModelUsed,
    bool GroundedInResume
);
