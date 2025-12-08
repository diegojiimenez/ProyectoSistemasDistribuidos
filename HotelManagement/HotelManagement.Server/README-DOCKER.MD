# Guía para levantar el Backend con Docker

## Requisitos previos

### Windows
- Docker Desktop instalado (https://www.docker.com/products/docker-desktop)
- Docker Compose (incluido en Docker Desktop)

### Ubuntu/Linux
- Docker Engine instalado
- Docker Compose instalado

#### Instalación en Ubuntu:

```bash
# Actualizar paquetes
sudo apt update

# Instalar Docker
sudo apt install docker.io -y

# Instalar Docker Compose
sudo apt install docker-compose -y

# Agregar tu usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Aplicar cambios (cierra sesión y vuelve a iniciar)
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

## Instrucciones

### 1. Levantar los servicios

**Windows (PowerShell):**
```powershell
cd HotelManagement
docker-compose up -d
```

**Ubuntu/Linux (Terminal):**
```bash
cd HotelManagement
docker-compose up -d
```

Esto levantará:
- **MySQL** en el puerto 3306
- **phpMyAdmin** en el puerto 8080
- **API Backend** en el puerto 5069

### 2. Verificar que los servicios están corriendo

**Ambos sistemas:**
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

**Ambos sistemas:**
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

**Ambos sistemas:**
```bash
docker-compose down
```

### 7. Detener y eliminar volúmenes (reinicio completo)

⚠️ **Advertencia:** Esto eliminará todos los datos de la base de datos

**Ambos sistemas:**
```bash
docker-compose down -v
```

### 8. Reconstruir la imagen de la API

Si haces cambios en el backend:

**Ambos sistemas:**
```bash
docker-compose up -d --build
```

## Configuración del Frontend

En tu aplicación React, configura la URL base de la API:

```typescript
const API_BASE_URL = "http://localhost:5069/api";
```

## Sincronización de datos entre desarrolladores

### ⚠️ Importante
Cada desarrollador tiene su propia base de datos local. Los datos NO se comparten automáticamente.

### Exportar/Importar datos

**Windows (PowerShell) - Exportar:**
```powershell
docker exec hotel-mysql mysqldump -uroot -proot_password_2024 hoteldb > hoteldb_backup.sql
```

**Windows (PowerShell) - Importar:**
```powershell
Get-Content hoteldb_backup.sql | docker exec -i hotel-mysql mysql -uroot -proot_password_2024 hoteldb
```

**Ubuntu/Linux - Exportar:**
```bash
docker exec hotel-mysql mysqldump -uroot -proot_password_2024 hoteldb > hoteldb_backup.sql
```

**Ubuntu/Linux - Importar:**
```bash
docker exec -i hotel-mysql mysql -uroot -proot_password_2024 hoteldb < hoteldb_backup.sql
```

### Datos semilla automáticos
El proyecto incluye datos de prueba que se crean automáticamente:
- Usuarios de prueba (admin y usuario)
- Cuartos de ejemplo
- Las migraciones se aplican automáticamente

Ambos desarrolladores tendrán los mismos datos iniciales al levantar Docker por primera vez.

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

### Windows

#### Docker Desktop no está corriendo
1. Busca "Docker Desktop" en el menú inicio
2. Espera a que el ícono en la barra de tareas esté estable
3. Verifica: `docker ps`

#### La API no se conecta a MySQL
- Espera unos segundos más, MySQL tarda en iniciar
- Verifica los logs: `docker-compose logs mysql`

### Ubuntu/Linux

#### Permission denied al ejecutar docker
```bash
# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Puerto 3306 ya en uso
```bash
# Ver qué está usando el puerto
sudo lsof -i :3306

# Detener MySQL local si está corriendo
sudo systemctl stop mysql
```

#### Firewall bloqueando puertos
```bash
# Permitir puertos necesarios
sudo ufw allow 3306
sudo ufw allow 5069
sudo ufw allow 8080
```

### Ambos sistemas

#### No puedo acceder a phpMyAdmin
- Verifica que el contenedor esté corriendo: `docker-compose ps`
- Verifica que el puerto 8080 no esté en uso

#### Error de puerto ya en uso
- **Puerto 3306:** Detén MySQL local o cambia el puerto en docker-compose.yml
- **Puerto 8080:** Cambia el puerto de phpMyAdmin (ejemplo: `"8081:80"`)
- **Puerto 5069:** Cambia el puerto de la API

#### Cambios en el código no se reflejan
- Reconstruye la imagen: `docker-compose up -d --build`

#### Olvidé las credenciales
- Revisa este archivo README
- Las credenciales están en `docker-compose.yml`

## Comandos útiles adicionales

### Limpiar contenedores huérfanos
```bash
docker system prune -a
```

### Ver uso de recursos
```bash
docker stats
```

### Reiniciar un servicio específico
```bash
docker-compose restart api
docker-compose restart mysql
```