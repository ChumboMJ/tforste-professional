using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IResumeTailorService
{
    Task<SkillGapAnalysisResult> AnalyzeSkillGapsAsync(AnalyzeJobDescriptionRequest request);
    Task<GeneratedResumeResult> GenerateAtsResumeAsync(GenerateResumeRequest request);
}
