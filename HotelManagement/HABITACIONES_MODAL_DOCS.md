# Modal de Gestión de Habitaciones - Documentación

## 📋 Descripción General

Se ha implementado un modal completo para gestionar habitaciones del hotel con las siguientes características:

## ✨ Características Principales

### 1. **Vista de Lista de Habitaciones**
- Grid responsivo que muestra todas las habitaciones
- Tarjetas con información detallada de cada habitación:
  - **Indicador de Estado**: Círculo de color en la parte superior indicando el estado actual
  - **Número de Cuarto**: Título principal de la tarjeta
  - **Información**: Tipo, Capacidad, Precio/noche, Estado
  - **Descripción**: Vista de la descripción completa de la habitación
  - **Acciones**: Botones para editar o eliminar

### 2. **Estados de Habitación con Circulitos de Colores**
```
🟢 Disponible    (Verde)      #4CAF50
🟠 Ocupado       (Naranja)    #FF9800
🔴 Mantenimiento (Rojo)       #F44336
🔵 Limpieza      (Azul)       #2196F3
```

Cada estado se visualiza como:
- **Indicador superior** en cada tarjeta (pequeña línea de color)
- **Selector interactivo** en el formulario (círculos grandes y selectables)

### 3. **Crear Nueva Habitación**
- Botón "+ Nueva Habitación" en la parte inferior del modal
- Formulario con campos:
  - Número de Cuarto (obligatorio)
  - Tipo (Individual, Doble, Suite, Familiar)
  - Capacidad (1-10 personas)
  - Precio por Noche
  - Descripción
  - **Estado**: Selector visual con círculos de colores

### 4. **Editar Habitación**
- Botón "Editar" en cada tarjeta
- Abre el mismo formulario con los datos precargados
- Cambiar cualquier campo incluyendo el estado
- Selector visual de estados con círculos interactivos

### 5. **Eliminar Habitación**
- Botón "Eliminar" en cada tarjeta
- Confirmación antes de eliminar
- Actualiza la lista automáticamente

## 🎨 Diseño Visual

### Paleta de Colores
- **Primario**: #8B6F47 (Marrón)
- **Secundario**: #6F4E37 (Marrón oscuro)
- **Fondo claro**: #E8DCC8 (Beige)
- **Fondo muy claro**: #FAFAFA (Casi blanco)

### Responsive
- Desktop: Grid de 4 columnas
- Tablet: Grid de 2-3 columnas
- Móvil: 1 columna

### Animaciones
- Fade-in al abrir el modal
- Slide-up de contenido
- Hover effects en tarjetas y botones
- Escalado suave de elementos interactivos

## 🔗 Integración en la Aplicación

### Botón "Habitaciones" en Navbar
- Visible solo en la página de Reservas (`/reservas`)
- Ubicado junto al botón "+ Añadir Nueva Reserva"
- Abre el modal al hacer clic

### Flujo de Uso
1. Usuario en página de Reservas
2. Hace clic en botón "Habitaciones"
3. Se abre el modal con lista completa de habitaciones
4. Puede ver estados, editar, crear o eliminar habitaciones
5. Cierra el modal con la X o haciendo clic fuera

## 📱 Modal Features

### Header
- Título: "Gestión de Habitaciones"
- Botón de cerrar (×)

### Body
- Área scrolleable con grid de habitaciones
- Cada tarjeta es un componente independiente
- Estado de carga y manejo de errores

### Footer
- Botón "+ Nueva Habitación" (cuando se muestra la lista)
- Desaparece cuando se abre el formulario

## 🛠️ Archivos Creados/Modificados

### Nuevos
1. `/services/cuartosService.ts` - Servicio de API para cuartos
2. `/components/Hotel/HabitacionesModal.tsx` - Componente modal
3. `/styles/HabitacionesModal.css` - Estilos del modal

### Modificados
1. `/components/Navbar.tsx` - Integración del modal
2. `/components/ReservationsChart.tsx` - Gráficos (cambio anterior)

## 🔄 API Endpoints Utilizados

```
GET    /api/cuartos              - Obtener todas las habitaciones
GET    /api/cuartos/{id}         - Obtener habitación por ID
POST   /api/cuartos              - Crear nueva habitación
PUT    /api/cuartos/{id}         - Actualizar habitación
DELETE /api/cuartos/{id}         - Eliminar habitación
GET    /api/cuartos/disponibles  - Obtener disponibles
```

## 📦 Dependencias

- React hooks (useState, useEffect)
- React Router (useLocation, useNavigate)
- Custom hooks (useAuth)
- Servicio API (apiClient)

## 🎯 Casos de Uso

1. **Gerente de Hotel**: Ver estado actual de todas las habitaciones
2. **Personal de Limpieza**: Cambiar estado de "Disponible" a "Limpieza"
3. **Recepción**: Marcar habitaciones como "Ocupado" o "Disponible"
4. **Mantenimiento**: Marcar habitaciones en "Mantenimiento"
5. **Administrador**: Crear, editar o eliminar habitaciones

## ✅ Validaciones

- Número de cuarto: Obligatorio
- Capacidad: 1-10 personas
- Precio: Positivo
- Estados: Selección visual con colores
- Confirmación antes de eliminar

## 🚀 Mejoras Futuras Sugeridas

1. Búsqueda y filtrado por estado
2. Exportar lista de habitaciones
3. Historial de cambios de estado
4. Asignación automática de limpieza
5. Notificaciones de mantenimiento requerido
