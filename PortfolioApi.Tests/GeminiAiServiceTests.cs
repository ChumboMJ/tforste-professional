using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using PortfolioApi.Models;
using PortfolioApi.Services;
using Xunit;

namespace PortfolioApi.Tests;

public class GeminiAiServiceTests
{
    private readonly GeminiAiService _aiService;

    public GeminiAiServiceTests()
    {
        var mockEnv = new Mock<IHostEnvironment>();
        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortfolioApi"));
        mockEnv.Setup(e => e.ContentRootPath).Returns(basePath);

        var mockConfig = new Mock<IConfiguration>();
        var mockLogger = new Mock<ILogger<GeminiAiService>>();
        var httpClient = new HttpClient();

        _aiService = new GeminiAiService(httpClient, mockConfig.Object, mockEnv.Object, mockLogger.Object);
    }

    [Fact]
    public async Task AskAsync_ReturnsGroundedResponse_InLocalMode()
    {
        var request = new AiChatRequest("What experience do you have with C# and .NET?");
        var response = await _aiService.AskAsync(request);

        Assert.NotNull(response);
        Assert.True(response.GroundedInResume);
        Assert.Contains("C#", response.Answer, StringComparison.OrdinalIgnoreCase);
        Assert.NotEmpty(response.SuggestedFollowUps);
    }
}
