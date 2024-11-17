var builder = WebApplication.CreateBuilder(args);

// Thêm các dịch vụ (ConfigureServices)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Cấu hình pipeline (Configure)

// Middleware xử lý tệp tĩnh
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Cache-Control", "no-cache, no-store");
    }
});

// Middleware xử lý định tuyến
app.UseRouting();

// Middleware cho CORS
app.UseCors("AllowAll");

// Middleware cho Session
app.UseSession();

// Middleware ánh xạ các controller
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}"
);

app.Run();
