using Exider.Services.Middleware;
using Instend.Server.Database.Abstraction;
using Instend.Server.Database.Realization;
using Itrantion.Server.Database;
using Itrantion.Server.Database.Abstraction;
using Itrantion.Server.Database.Realization;
using Itransition.Server.Hubs;

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

builder.Services.AddScoped<ISlidesRepository, SlidesRepository>();
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