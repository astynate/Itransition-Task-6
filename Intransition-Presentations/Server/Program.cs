using Exider.Services.Middleware;
using Exider_Version_2._0._0.Server.Hubs;
using Instend.Server.Database;
using Instend.Server.Database.Abstraction;
using Instend.Server.Database.Realization;
using Microsoft.AspNet.SignalR.Messaging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
        .SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<IPresentationsRepository, PresentationsRepository>();
builder.Services.AddDbContext<DatabaseContext>();
builder.Services.AddTransient<LoggingMiddleware>();
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

builder.Services.AddAuthorization();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseMiddleware<LoggingMiddleware>();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<UserHub>("/user-hub");

app.Run();