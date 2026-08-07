using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IPortfolioService
{
    ProfileDto GetProfile();
    List<SkillItem> GetSkills(string? category = null, string? recruiterPerspective = null);
    List<ProjectItem> GetProjects(string? category = null, bool? featuredOnly = null);
    List<ExperienceItem> GetExperiences(string? recruiterPerspective = null);
    TerminalResponse ExecuteTerminalCommand(string rawCommand);
    ContactMessageResponse SubmitContactMessage(ContactMessageRequest request);
}
