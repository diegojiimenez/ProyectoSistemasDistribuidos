# Guía para levantar el Backend con Docker

## Requisitos previos
- Docker Desktop instalado
- Docker Compose instalado

## Instrucciones

### 1. Levantar los servicios

Desde la carpeta `HotelManagement`, ejecuta:

```bash
docker-compose up -d
```

Esto levantará:
- **MySQL** en el puerto 3306
- **phpMyAdmin** en el puerto 8080
- **API Backend** en el puerto 5069

### 2. Verificar que los servicios están corriendo

```bash
docker-compose ps
```

### 3. Acceder a los servicios

#### API Backend
- URL: `http://localhost:5069`
- Swagger (documentación): `http://localhost:5069`
- Health Check: `http://localhost:5069/api/health`

#### phpMyAdmin
- URL: `http://localhost:8080`
- **Servidor:** `mysql`
- **Usuario:** `hoteluser`
- **Contraseña:** `hotel_password_2024`
- **Base de datos:** `hoteldb`

**Nota:** Si prefieres usar el usuario root:
- **Usuario:** `root`
- **Contraseña:** `root_password_2024`

### 4. Ver logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver solo logs de la API
docker-compose logs -f api

# Ver solo logs de MySQL
docker-compose logs -f mysql

# Ver logs de phpMyAdmin
docker-compose logs -f phpmyadmin
```

### 5. Credenciales de la aplicación

**Usuarios pre-creados en la API:**
- Admin: `admin` / `Admin123!`
- Usuario: `usuario` / `User123!`

**Conexión a MySQL:**
- **Host:** `localhost` (desde tu máquina)
- **Host:** `mysql` (desde contenedores Docker)
- **Puerto:** `3306`
- **Base de datos:** `hoteldb`
- **Usuario:** `hoteluser`
- **Contraseña:** `hotel_password_2024`
- **Root password:** `root_password_2024`

### 6. Detener los servicios

```bash
docker-compose down
```

### 7. Detener y eliminar volúmenes (reinicio completo)

⚠️ **Advertencia:** Esto eliminará todos los datos de la base de datos

```bash
docker-compose down -v
```

### 8. Reconstruir la imagen de la API

Si haces cambios en el backend:

```bash
docker-compose up -d --build
```

## Configuración del Frontend

En la aplicación React, configura la URL base de la API:

```typescript
const API_BASE_URL = "http://localhost:5069/api";
```

## Explorar la base de datos con phpMyAdmin

1. Abre `http://localhost:8080` en tu navegador
2. Inicia sesión con las credenciales proporcionadas
3. Selecciona la base de datos `hoteldb`
4. Explora las tablas:
   - `Huespedes`
   - `Cuartos`
   - `Reservas`
   - `Usuarios`

## Problemas comunes

### La API no se conecta a MySQL
- Espera unos segundos más, MySQL tarda en iniciar
- Verifica los logs: `docker-compose logs mysql`

### No puedo acceder a phpMyAdmin
- Verifica que el contenedor esté corriendo: `docker-compose ps`
- Verifica que el puerto 8080 no esté en uso

### Error de puerto ya en uso
- **Puerto 3306:** Detén MySQL local o cambia el puerto en docker-compose.yml
- **Puerto 8080:** Cambia el puerto de phpMyAdmin (ejemplo: `"8081:80"`)
- **Puerto 5069:** Cambia el puerto de la API

### Cambios en el código no se reflejan
- Reconstruye la imagen: `docker-compose up -d --build`

### Olvidé las credenciales
- Revisa este archivo README
- Las credenciales están en `docker-compose.yml`