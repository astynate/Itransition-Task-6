using Instend.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Instend.Server.Database
{
    public class DatabaseContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; } = null!;
        public DbSet<PermissionModel> Permissions { get; set; } = null!;
        public DbSet<PresentationModel> Presentations { get; set; } = null!;
        public DbSet<SlideModel> Slides { get; set; } = null!;
        public DbSet<TextModel> Texts { get; set; } = null!;
        public DbSet<UserConnection> Connections { get; set; } = null!;

        public DatabaseContext() => Database.EnsureCreated();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserConnection>()
                .HasKey(uc => new { uc.User, uc.Presentation });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;user=root;password=47188475;database=itransition_presentations",
                new MySqlServerVersion(new Version(8, 3, 0)),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure());
        }
    }
}