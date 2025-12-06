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
                    CapacidadPersonas = 1,
                    PrecioPorNoche = 50.00m,
                    Estado = EstadoCuarto.Disponible,
                    Descripcion = "Habitación individual con vista a la ciudad"
                },
                new Cuarto
                {
                    Id = 2,
                    Numero = "102",
                    Tipo = TipoCuarto.Doble,
                    CapacidadPersonas = 2,
                    PrecioPorNoche = 80.00m,
                    Estado = EstadoCuarto.Disponible,
                    Descripcion = "Habitación doble con cama queen size"
                },
                new Cuarto
                {
                    Id = 3,
                    Numero = "201",
                    Tipo = TipoCuarto.Suite,
                    CapacidadPersonas = 3,
                    PrecioPorNoche = 150.00m,
                    Estado = EstadoCuarto.Disponible,
                    Descripcion = "Suite con sala de estar y jacuzzi"
                },
                new Cuarto
                {
                    Id = 4,
                    Numero = "202",
                    Tipo = TipoCuarto.Familiar,
                    CapacidadPersonas = 4,
                    PrecioPorNoche = 120.00m,
                    Estado = EstadoCuarto.Disponible,
                    Descripcion = "Habitación familiar con dos camas dobles"
                },
                new Cuarto
                {
                    Id = 5,
                    Numero = "301",
                    Tipo = TipoCuarto.Presidencial,
                    CapacidadPersonas = 4,
                    PrecioPorNoche = 300.00m,
                    Estado = EstadoCuarto.Disponible,
                    Descripcion = "Suite presidencial con todas las comodidades"
                }
            );

            // Huéspedes de ejemplo
            modelBuilder.Entity<Huesped>().HasData(
                new Huesped
                {
                    Id = 1,
                    Nombre = "Juan",
                    Apellido = "Pérez",
                    Email = "juan.perez@email.com",
                    Telefono = "+34-600-123-456",
                    DocumentoIdentidad = "12345678A",
                    Direccion = "Calle Mayor 1, Madrid",
                    FechaRegistro = DateTime.Now.AddMonths(-3)
                },
                new Huesped
                {
                    Id = 2,
                    Nombre = "María",
                    Apellido = "García",
                    Email = "maria.garcia@email.com",
                    Telefono = "+34-600-789-012",
                    DocumentoIdentidad = "87654321B",
                    Direccion = "Avenida Principal 45, Barcelona",
                    FechaRegistro = DateTime.Now.AddMonths(-2)
                }
            );
        }
    }
}