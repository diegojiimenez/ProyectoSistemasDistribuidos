FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5069

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar solo el proyecto del servidor
COPY ["HotelManagement.Server/HotelManagement.Server.csproj", "HotelManagement.Server/"]
RUN dotnet restore "HotelManagement.Server/HotelManagement.Server.csproj"

# Copiar solo los archivos del servidor
COPY ["HotelManagement.Server/", "HotelManagement.Server/"]
WORKDIR "/src/HotelManagement.Server"
RUN dotnet build "HotelManagement.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HotelManagement.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HotelManagement.Server.dll"]