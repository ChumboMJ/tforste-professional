namespace PortfolioApi.Models;

public record AnalyzeJobDescriptionRequest(
    string JobTitle,
    string Company,
    string JobDescriptionText
);

public record MatchedSkillItem(
    string SkillName,
    int ProficiencyLevel,
    string EvidenceFromResume
);

public record MissingSkillItem(
    string SkillName,
    string ImportanceCategory, // Core / Preferred / Bonus
    string SuggestedComparableSkills
);

public record SkillGapAnalysisResult(
    string JobTitle,
    string Company,
    int MatchPercentage,
    List<MatchedSkillItem> MatchedSkills,
    List<MissingSkillItem> MissingSkills,
    string Summary,
    string ModelUsed
);

public record UserSkillOverride(
    string SkillName,
    bool UserPossessesSkill,
    string? UserNotes = null
);

public record GenerateResumeRequest(
    string JobTitle,
    string Company,
    string JobDescriptionText,
    List<UserSkillOverride> UserSkillOverrides
);

public record GeneratedResumeResult(
    string JobTitle,
    string Company,
    string AtsResumeMarkdown,
    List<string> KeywordsTargeted,
    int EstimatedAtsScore,
    string ModelUsed
);
