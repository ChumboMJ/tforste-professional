using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using PortfolioApi.Models;
using PortfolioApi.Services;
using Xunit;

namespace PortfolioApi.Tests;

public class ResumeTailorServiceTests
{
    private readonly Mock<IHostEnvironment> _mockEnv;
    private readonly Mock<ILogger<ResumeTailorService>> _mockLogger;
    private readonly IConfiguration _configuration;

    public ResumeTailorServiceTests()
    {
        _mockEnv = new Mock<IHostEnvironment>();
        _mockEnv.Setup(e => e.ContentRootPath).Returns(Directory.GetCurrentDirectory());
        _mockLogger = new Mock<ILogger<ResumeTailorService>>();
        
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"GEMINI_API_KEY", ""} // Test local fallback mode
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
    }

    [Fact]
    public async Task AnalyzeSkillGapsAsync_ValidRequest_ReturnsGroundedAnalysis()
    {
        // Arrange
        var httpClient = new HttpClient();
        var service = new ResumeTailorService(httpClient, _configuration, _mockEnv.Object, _mockLogger.Object);
        var request = new AnalyzeJobDescriptionRequest("Senior .NET Developer", "Acme Corp", "Looking for C#, .NET Core, Azure, and AWS experience.");

        // Act
        var result = await service.AnalyzeSkillGapsAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Senior .NET Developer", result.JobTitle);
        Assert.Equal("Acme Corp", result.Company);
        Assert.True(result.MatchPercentage > 0);
        Assert.NotEmpty(result.MatchedSkills);
        Assert.Contains(result.MatchedSkills, s => s.SkillName.Contains(".NET"));
    }

    [Fact]
    public async Task AnalyzeSkillGapsAsync_EmptyJd_ThrowsArgumentException()
    {
        // Arrange
        var httpClient = new HttpClient();
        var service = new ResumeTailorService(httpClient, _configuration, _mockEnv.Object, _mockLogger.Object);
        var request = new AnalyzeJobDescriptionRequest("Senior Engineer", "Acme", "");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => service.AnalyzeSkillGapsAsync(request));
    }

    [Fact]
    public async Task GenerateAtsResumeAsync_ValidRequest_ReturnsTailoredMarkdown()
    {
        // Arrange
        var httpClient = new HttpClient();
        var service = new ResumeTailorService(httpClient, _configuration, _mockEnv.Object, _mockLogger.Object);
        var request = new GenerateResumeRequest(
            "Senior Cloud Architect",
            "TechCorp",
            "Must have Azure, GCP, C#, and microservices expertise.",
            new List<UserSkillOverride>
            {
                new("AWS SQS", true, "Used in side projects and comparable to Azure Service Bus")
            }
        );

        // Act
        var result = await service.GenerateAtsResumeAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Senior Cloud Architect", result.JobTitle);
        Assert.Contains("TIM FORSTE", result.AtsResumeMarkdown);
        Assert.Contains("Senior Cloud Architect", result.AtsResumeMarkdown);
        Assert.NotEmpty(result.KeywordsTargeted);
    }
}
