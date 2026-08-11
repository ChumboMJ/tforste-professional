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
    private readonly GeminiAiService _service;

    public GeminiAiServiceTests()
    {
        var mockEnv = new Mock<IHostEnvironment>();
        var mockConfig = new Mock<IConfiguration>();
        var mockLogger = new Mock<ILogger<GeminiAiService>>();

        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "PortfolioApi"));
        mockEnv.Setup(e => e.ContentRootPath).Returns(basePath);

        _service = new GeminiAiService(new HttpClient(), mockConfig.Object, mockEnv.Object, mockLogger.Object);
    }

    [Fact]
    public async Task AskAsync_ReturnsGroundedFallbackResponses_ForVariousTopics()
    {
        var emptyReq = new AiChatRequest("");
        var emptyResult = await _service.AskAsync(emptyReq);
        Assert.NotNull(emptyResult.Answer);
        Assert.True(emptyResult.GroundedInResume);

        var locationReq = new AiChatRequest("Where is Tim Located?");
        var locationResult = await _service.AskAsync(locationReq);
        Assert.Contains("Independence, OR", locationResult.Answer);
        Assert.Contains("remote", locationResult.Answer, StringComparison.OrdinalIgnoreCase);

        var educationReq = new AiChatRequest("Tell me about your education and degree at OIT");
        var educationResult = await _service.AskAsync(educationReq);
        Assert.Contains("Oregon Institute of Technology", educationResult.Answer);

        var ormReq = new AiChatRequest("What is your experience with ORMs like Dapper and EF?");
        var ormResult = await _service.AskAsync(ormReq);
        Assert.Contains("Dapper", ormResult.Answer);

        var dotnetReq = new AiChatRequest("Describe your C# and .NET experience");
        var dotnetResult = await _service.AskAsync(dotnetReq);
        Assert.Contains(".NET", dotnetResult.Answer);

        var cloudReq = new AiChatRequest("Tell me about GCP, Azure, and Docker");
        var cloudResult = await _service.AskAsync(cloudReq);
        Assert.Contains("Azure", cloudResult.Answer);

        var petSafeReq = new AiChatRequest("What did you do at PetSafe Brands?");
        var petSafeResult = await _service.AskAsync(petSafeReq);
        Assert.Contains("PetSafe", petSafeResult.Answer);

        var leadershipReq = new AiChatRequest("What experience do you have with mentorship and leadership at Saif?");
        var leadershipResult = await _service.AskAsync(leadershipReq);
        Assert.Contains("Saif", leadershipResult.Answer);
    }
}
