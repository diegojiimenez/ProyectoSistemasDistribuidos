using Microsoft.EntityFrameworkCore;
using HotelManagement.API.Models;

namespace HotelManagement.API.Data
{
    public class HotelDbContext : DbContext
    {
        public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options)
        {
        }

        public DbSet<Huesped> Huespedes { get; set; }
        public DbSet<Cuarto> Cuartos { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Huésped
            modelBuilder.Entity<Huesped>(entity =>
            {
                entity.HasKey(h => h.Id);
                entity.Property(h => h.Nombre).IsRequired().HasMaxLength(100);
                entity.Property(h => h.Apellido).IsRequired().HasMaxLength(100);
                entity.Property(h => h.Email).IsRequired().HasMaxLength(150);
                entity.Property(h => h.Telefono).IsRequired().HasMaxLength(20);
                entity.Property(h => h.DocumentoIdentidad).IsRequired().HasMaxLength(20);
                entity.HasIndex(h => h.DocumentoIdentidad).IsUnique();
                entity.HasIndex(h => h.Email).IsUnique();
            });

            // Configuración de Cuarto
            modelBuilder.Entity<Cuarto>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Numero).IsRequired().HasMaxLength(10);
                entity.Property(c => c.PrecioPorNoche).HasColumnType("decimal(18,2)");
                entity.HasIndex(c => c.Numero).IsUnique();
            });

            // Configuración de Reserva
            modelBuilder.Entity<Reserva>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.MontoTotal).HasColumnType("decimal(18,2)");

                entity.HasOne(r => r.Huesped)
                    .WithMany(h => h.Reservas)
                    .HasForeignKey(r => r.HuespedId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Cuarto)
                    .WithMany(c => c.Reservas)
                    .HasForeignKey(r => r.CuartoId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Datos iniciales (Seed Data)
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Cuartos iniciales
            modelBuilder.Entity<Cuarto>().HasData(
                new Cuarto
                {
                    Id = 1,
                    Numero = "101",
                    Tipo = TipoCuarto.Individual,
                    Descripcion = "Habitación individual con vista a la ciudad",
                    PrecioPorNoche = 50.00m,
                    CapacidadPersonas = 1, 
                    Estado = EstadoCuarto.Disponible
                },
                new Cuarto
                {
                    Id = 2,
                    Numero = "102",
                    Tipo = TipoCuarto.Doble,
                    Descripcion = "Habitación doble con balcón",
                    PrecioPorNoche = 75.00m,
                    CapacidadPersonas = 2, 
                    Estado = EstadoCuarto.Disponible
                },
                new Cuarto
                {
                    Id = 3,
                    Numero = "201",
                    Tipo = TipoCuarto.Suite,
                    Descripcion = "Suite de lujo con jacuzzi",
                    PrecioPorNoche = 150.00m,
                    CapacidadPersonas = 4, 
                    Estado = EstadoCuarto.Disponible
                },
                new Cuarto
                {
                    Id = 4,
                    Numero = "202",
                    Tipo = TipoCuarto.Familiar,
                    Descripcion = "Habitación familiar amplia",
                    PrecioPorNoche = 120.00m,
                    CapacidadPersonas = 6, 
                    Estado = EstadoCuarto.Disponible
                },
                new Cuarto
                {
                    Id = 5,
                    Numero = "301",
                    Tipo = TipoCuarto.Doble,
                    Descripcion = "Habitación doble estándar",
                    PrecioPorNoche = 80.00m,
                    CapacidadPersonas = 2, 
                    Estado = EstadoCuarto.Disponible
                }
            );

            // Usuarios iniciales
            modelBuilder.Entity<Usuario>().HasData(
                new Usuario
                {
                    Id = 1,
                    NombreUsuario = "admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Rol = "Admin",
                    FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Usuario
                {
                    Id = 2,
                    NombreUsuario = "usuario",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                    Rol = "Usuario",
                    FechaCreacion = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}