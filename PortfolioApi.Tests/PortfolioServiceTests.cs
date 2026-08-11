using Microsoft.Extensions.Hosting;
using Moq;
using PortfolioApi.Models;
using PortfolioApi.Services;
using Xunit;

namespace PortfolioApi.Tests;

public class PortfolioServiceTests
{
    private readonly PortfolioService _service;

    public PortfolioServiceTests()
    {
        var mockEnv = new Mock<IHostEnvironment>();
        var mockAi = new Mock<IGeminiAiService>();
        var mockConfig = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();
        
        // Root path is parent directory where Data/ResumeKnowledgeBase.json resides
        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortfolioApi"));
        mockEnv.Setup(e => e.ContentRootPath).Returns(basePath);

        mockAi.Setup(a => a.AskAsync(It.IsAny<AiChatRequest>()))
              .ReturnsAsync(new AiChatResponse("AI answer test", new List<string> { "follow up" }, "MockEngine", true));

        _service = new PortfolioService(mockEnv.Object, mockAi.Object, mockConfig.Object);
    }

    [Fact]
    public void GetProfile_ReturnsValidProfile()
    {
        var profile = _service.GetProfile();
        Assert.NotNull(profile);
        Assert.Equal("Tim Forste", profile.Name);
        Assert.True(profile.Metrics.YearsOfExperience >= 12);
    }

    [Fact]
    public void GetSkills_FiltersByRecruiterPerspective()
    {
        var backendSkills = _service.GetSkills(recruiterPerspective: "Backend");
        Assert.NotEmpty(backendSkills);
        Assert.All(backendSkills, s => Assert.Contains(s.Category, new[] { "Backend & APIs", "Databases & Architecture", "Cloud & DevOps" }));
    }

    [Fact]
    public void GetProjects_ReturnsFeaturedProjects()
    {
        var featuredProjects = _service.GetProjects(featuredOnly: true);
        Assert.NotEmpty(featuredProjects);
        Assert.All(featuredProjects, p => Assert.True(p.Featured));
    }

    [Theory]
    [InlineData("help", "text")]
    [InlineData("skills", "text")]
    [InlineData("projects", "text")]
    [InlineData("exp", "text")]
    [InlineData("experience", "text")]
    [InlineData("contact", "text")]
    [InlineData("whoami", "text")]
    [InlineData("clear", "clear")]
    public void ExecuteTerminalCommand_HandlesValidCommands(string command, string expectedType)
    {
        var response = _service.ExecuteTerminalCommand(command);
        Assert.Equal(expectedType, response.Type);
        Assert.NotNull(response.Output);
    }

    [Fact]
    public void ExecuteTerminalCommand_HandlesSpecialCommands()
    {
        // Test empty command
        var emptyResp = _service.ExecuteTerminalCommand("");
        Assert.Contains("help", emptyResp.Output, StringComparison.OrdinalIgnoreCase);

        // Test unknown command
        var errorResp = _service.ExecuteTerminalCommand("invalidcmd");
        Assert.Equal("error", errorResp.Type);
        Assert.Contains("not recognized", errorResp.Output, StringComparison.OrdinalIgnoreCase);

        // Test cat resume.json command
        var catResp = _service.ExecuteTerminalCommand("cat resume.json");
        Assert.Equal("json", catResp.Type);
        Assert.Contains("Tim Forste", catResp.Output);

        // Test ask command with question
        var askResp = _service.ExecuteTerminalCommand("ask What is your .NET experience?");
        Assert.Equal("text", askResp.Type);
        Assert.Contains("AI Resume Assistant", askResp.Output);

        // Test ask command without question
        var askEmptyResp = _service.ExecuteTerminalCommand("ask ");
        Assert.Contains("Usage: ask <question>", askEmptyResp.Output);
    }

    [Fact]
    public void GetSkills_FiltersAllCategoriesAndPerspectives()
    {
        var allSkills = _service.GetSkills(category: "All", recruiterPerspective: "All");
        Assert.NotEmpty(allSkills);

        var fullstackSkills = _service.GetSkills(recruiterPerspective: "fullstack");
        Assert.Equal(allSkills.Count, fullstackSkills.Count);

        var devopsSkills = _service.GetSkills(recruiterPerspective: "devops");
        Assert.NotEmpty(devopsSkills);
        Assert.All(devopsSkills, s => Assert.Contains(s.Category, new[] { "Cloud & DevOps", "Databases & Architecture" }));

        var aiSkills = _service.GetSkills(recruiterPerspective: "ai");
        Assert.NotEmpty(aiSkills);

        var specificCatSkills = _service.GetSkills(category: "Backend & APIs");
        Assert.All(specificCatSkills, s => Assert.Equal("Backend & APIs", s.Category));
    }

    [Fact]
    public void GetProjects_FiltersByCategoryAndFeatured()
    {
        var allProjects = _service.GetProjects(category: "All");
        Assert.NotEmpty(allProjects);

        var enterpriseProjects = _service.GetProjects(category: "Enterprise Architecture");
        Assert.All(enterpriseProjects, p => Assert.Equal("Enterprise Architecture", p.Category));

        var nonFeatured = _service.GetProjects(featuredOnly: false);
        Assert.Equal(allProjects.Count, nonFeatured.Count);
    }

    [Fact]
    public void GetExperiences_FiltersByRecruiterPerspective()
    {
        var allExp = _service.GetExperiences();
        Assert.NotEmpty(allExp);

        var backendExp = _service.GetExperiences(recruiterPerspective: "Backend");
        Assert.NotEmpty(backendExp);
        Assert.All(backendExp, e => Assert.Contains(e.RecruiterCategories, rc => rc.Equals("Backend", StringComparison.OrdinalIgnoreCase)));

        var allPerspectiveExp = _service.GetExperiences(recruiterPerspective: "All");
        Assert.Equal(allExp.Count, allPerspectiveExp.Count);
    }

    [Fact]
    public void SubmitContactMessage_RejectsInvalidInput()
    {
        var invalidReq = new ContactMessageRequest("", "", "", "");
        var result = _service.SubmitContactMessage(invalidReq);

        Assert.False(result.Success);
        Assert.Contains("required", result.ConfirmationMessage, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void SubmitContactMessage_ValidatesPhoneNumberIfProvided()
    {
        var invalidPhoneReq = new ContactMessageRequest("Jane Doe", "jane@example.com", "Job", "Hello", "123");
        var result = _service.SubmitContactMessage(invalidPhoneReq);
        Assert.False(result.Success);
        Assert.Contains("phone", result.ConfirmationMessage, StringComparison.OrdinalIgnoreCase);

        var validPhoneReq = new ContactMessageRequest("Jane Doe", "jane@example.com", "Job", "Hello", "(503) 555-0199");
        var validResult = _service.SubmitContactMessage(validPhoneReq);
        Assert.True(validResult.Success);
    }

    [Fact]
    public void SubmitContactMessage_DispatchesWithDiscordWebhookUrl()
    {
        var mockEnv = new Mock<IHostEnvironment>();
        var mockAi = new Mock<IGeminiAiService>();
        var mockConfig = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();

        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortfolioApi"));
        mockEnv.Setup(e => e.ContentRootPath).Returns(basePath);
        mockConfig.Setup(c => c["DISCORD_WEBHOOK_URL"]).Returns("https://discord.com/api/webhooks/mock/test");

        var service = new PortfolioService(mockEnv.Object, mockAi.Object, mockConfig.Object);

        var req = new ContactMessageRequest("Recruiter Alice", "alice@enterprise.com", "Interview", "We would love to connect!", "(503) 555-0122", "TechCorp");
        var res = service.SubmitContactMessage(req);

        Assert.True(res.Success);
        Assert.Contains("Recruiter Alice", res.ConfirmationMessage);
    }

    [Fact]
    public void Constructor_ThrowsFileNotFoundException_WhenFileMissing()
    {
        var mockEnv = new Mock<IHostEnvironment>();
        var mockAi = new Mock<IGeminiAiService>();
        var mockConfig = new Mock<Microsoft.Extensions.Configuration.IConfiguration>();

        mockEnv.Setup(e => e.ContentRootPath).Returns(Path.GetTempPath());

        Assert.Throws<FileNotFoundException>(() => new PortfolioService(mockEnv.Object, mockAi.Object, mockConfig.Object));
    }
}
