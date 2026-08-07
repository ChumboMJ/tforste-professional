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
        
        // Root path is parent directory where Data/ResumeKnowledgeBase.json resides
        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortfolioApi"));
        mockEnv.Setup(e => e.ContentRootPath).Returns(basePath);

        mockAi.Setup(a => a.AskAsync(It.IsAny<AiChatRequest>()))
              .ReturnsAsync(new AiChatResponse("AI answer test", new List<string> { "follow up" }, "MockEngine", true));

        _service = new PortfolioService(mockEnv.Object, mockAi.Object);
    }

    [Fact]
    public void GetProfile_ReturnsValidProfile()
    {
        var profile = _service.GetProfile();
        Assert.NotNull(profile);
        Assert.Equal("Alex Mercer", profile.Name);
        Assert.True(profile.Metrics.YearsOfExperience >= 8);
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
    [InlineData("contact", "text")]
    [InlineData("clear", "clear")]
    public void ExecuteTerminalCommand_HandlesValidCommands(string command, string expectedType)
    {
        var response = _service.ExecuteTerminalCommand(command);
        Assert.Equal(expectedType, response.Type);
        Assert.NotNull(response.Output);
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
    public void SubmitContactMessage_AcceptsValidInput()
    {
        var validReq = new ContactMessageRequest("Jane Doe", "jane@example.com", "Job Opportunity", "Hello Alex!");
        var result = _service.SubmitContactMessage(validReq);

        Assert.True(result.Success);
        Assert.Contains("dispatched", result.ConfirmationMessage, StringComparison.OrdinalIgnoreCase);
    }
}
