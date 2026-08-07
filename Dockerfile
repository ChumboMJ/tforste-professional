# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build ASP.NET Core 10 Web API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /app
COPY PortfolioApi/*.csproj ./PortfolioApi/
RUN dotnet restore PortfolioApi/PortfolioApi.csproj
COPY PortfolioApi/ ./PortfolioApi/
COPY --from=frontend-builder /app/PortfolioApi/wwwroot ./PortfolioApi/wwwroot/
WORKDIR /app/PortfolioApi
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Production Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=backend-builder /app/publish .
ENTRYPOINT ["dotnet", "PortfolioApi.dll"]
