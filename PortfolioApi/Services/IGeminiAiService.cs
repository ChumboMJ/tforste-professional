using PortfolioApi.Models;

namespace PortfolioApi.Services;

public interface IGeminiAiService
{
    Task<AiChatResponse> AskAsync(AiChatRequest request);
}
