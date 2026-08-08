using PortfolioApi.Models;
using PortfolioApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddHttpClient();
builder.Services.AddSingleton<IGeminiAiService, GeminiAiService>();
builder.Services.AddSingleton<IPortfolioService, PortfolioService>();

// Enable CORS for React frontend (Vite default ports 5173, 3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactClient");

// Serve static files if React static build is hosted in wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// REST API Endpoints
var api = app.MapGroup("/api");

api.MapGet("/profile", (IPortfolioService service, ILogger<Program> logger) => 
{
    logger.LogDebug("Fetching user profile data...");
    return Results.Ok(service.GetProfile());
}).WithName("GetProfile");

api.MapGet("/skills", (IPortfolioService service, ILogger<Program> logger, string? category, string? perspective) => 
{
    logger.LogDebug("Querying skills matrix. Category: {Category}, Perspective: {Perspective}", category, perspective);
    return Results.Ok(service.GetSkills(category, perspective));
}).WithName("GetSkills");

api.MapGet("/projects", (IPortfolioService service, ILogger<Program> logger, string? category, bool? featured) => 
{
    logger.LogDebug("Querying projects showcase. Category: {Category}, Featured: {Featured}", category, featured);
    return Results.Ok(service.GetProjects(category, featured));
}).WithName("GetProjects");

api.MapGet("/experience", (IPortfolioService service, ILogger<Program> logger, string? perspective) => 
{
    logger.LogDebug("Querying experiences timeline. Perspective: {Perspective}", perspective);
    return Results.Ok(service.GetExperiences(perspective));
}).WithName("GetExperiences");

api.MapPost("/terminal/command", (IPortfolioService service, ILogger<Program> logger, TerminalRequest request) => 
{
    logger.LogTrace("Executing CLI Terminal Command: {Command}", request.Command);
    return Results.Ok(service.ExecuteTerminalCommand(request.Command));
}).WithName("ExecuteTerminalCommand");

api.MapPost("/contact", (IPortfolioService service, ILogger<Program> logger, ContactMessageRequest request) =>
{
    logger.LogInformation("Contact submission received from: {Name} <{Email}>", request.Name, request.Email);
    var response = service.SubmitContactMessage(request);
    return response.Success ? Results.Ok(response) : Results.BadRequest(response);
}).WithName("SubmitContactMessage");

api.MapPost("/ai/ask", async (IGeminiAiService aiService, ILogger<Program> logger, AiChatRequest request) =>
{
    logger.LogDebug("Dispatching AI query: {Query}", request.Message);
    var response = await aiService.AskAsync(request);
    return Results.Ok(response);
}).WithName("AskAiAssistant");

// Fallback to index.html for SPA routing
app.MapFallbackToFile("index.html");

app.Run();
