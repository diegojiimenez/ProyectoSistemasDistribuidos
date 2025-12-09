# Modal de Crear Reserva - Actualización

## 🔄 Cambios Realizados

### 1. **Integración de Cuartos desde la API** ✅
- **Antes**: Los cuartos estaban hardcodeados en el modal
- **Ahora**: Se cargan dinámicamente desde `GET /api/cuartos`
- Los cuartos se obtienen al abrir el modal
- Se crea un mapa interno para acceso rápido a los datos del cuarto

### 2. **Cálculo Automático de Precio Total** 💰
El precio total ahora se calcula automáticamente según:
- **Cuarto seleccionado**: Se obtiene el `precioPorNoche` del cuarto
- **Fecha de entrada y salida**: Se calcula la cantidad de días
- **Fórmula**: `precioPorNoche × días`

**Cálculo automático cuando:**
- Cambias el cuarto
- Cambias la fecha de entrada
- Cambias la fecha de salida

**Campo de entrada:**
- Es `readonly` (solo lectura) para prevenir edición manual
- Muestra un fondo gris para indicar que es automático
- Incluye un tooltip explicativo

### 3. **Mejora en la Visualización de Cuartos** 🏨
El selector de cuartos ahora muestra:
```
Cuarto 101 (Doble) - $80/noche - Disponible
Cuarto 102 (Individual) - $50/noche - Ocupado
Cuarto 103 (Suite) - $120/noche - Limpieza
```

Información incluida:
- ✓ Número de cuarto
- ✓ Tipo de cuarto
- ✓ Precio por noche
- ✓ Estado actual del cuarto

### 4. **Información del Cuarto Seleccionado** ℹ️
Al seleccionar un cuarto, aparece una tarjeta con:
- Capacidad de personas
- Puede expandirse en el futuro con más detalles

## 📝 Función de Cálculo

```typescript
const calculatePrecioTotal = (
  cuartoId: number,
  fechaEntrada: string,
  fechaSalida: string
): number => {
  // 1. Valida que haya datos
  // 2. Obtiene el cuarto del mapa
  // 3. Calcula la diferencia de fechas en días
  // 4. Multiplica días × precio por noche
  // 5. Retorna el total
}
```

### Manejo de Casos Edge:
- Si no hay cuarto seleccionado → 0
- Si las fechas son iguales → 0
- Si fecha de salida es antes que entrada → 0
- Redondeo automático de días (ceil)

## 🔗 Datos Utilizados de la API

Cada cuarto contiene:
```typescript
{
  id: number;
  numero: string;        // "101", "102", etc
  tipo: number;          // 0=Individual, 1=Doble, 2=Suite, 3=Familiar
  descripcion: string;
  precioPorNoche: number; // Usado para el cálculo
  capacidad: number;     // Mostrado en la tarjeta de información
  estado: number;        // 0=Disponible, 1=Ocupado, 2=Mantenimiento, 3=Limpieza
}
```

## 📊 Ejemplo de Cálculo

**Escenario:**
- Cuarto: 102 (Doble) - $80/noche
- Entrada: 2025-12-10 (miércoles)
- Salida: 2025-12-13 (sábado)

**Cálculo:**
- Días: 3 días
- Precio: $80 × 3 = **$240**

## 🎯 Flujo del Usuario

1. **Abrir Modal** → Se cargan huéspedes y cuartos de la API
2. **Seleccionar Huésped** → De la lista cargada
3. **Seleccionar Cuarto** → Muestra tipos, precios y estados
4. **Ingresar Fechas** → Sistema calcula precio automáticamente
5. **Precio Total** → Se actualiza al cambiar cualquier parámetro
6. **Notas Opcionales** → Campo de texto libre
7. **Guardar** → Se envía la reserva con el precio calculado

## 📱 Componentes Actualizados

### AddReservasModal.tsx
- ✅ Nueva importación de `cuartosService`
- ✅ Nuevo estado `cuartosPorId` (mapa para acceso rápido)
- ✅ Nueva función `calculatePrecioTotal`
- ✅ Lógica mejorada en `handleInputChange`
- ✅ Selector de cuartos mejorado
- ✅ Campo de precio total como readonly

## 🛠️ Validaciones Incluidas

1. ✓ Fecha de salida debe ser posterior a entrada
2. ✓ Todos los campos obligatorios deben estar llenos
3. ✓ El precio total se calcula y valida automáticamente
4. ✓ Se previene edición manual del precio total

## 🚀 Mejoras Futuras Sugeridas

1. Filtrar cuartos por disponibilidad
2. Mostrar historial de precios
3. Aplicar descuentos automáticos
4. Mostrar descripción completa del cuarto
5. Vista previa de la habitación (fotos)
6. Sugerencias automáticas de cuartos según capacidad

## ✨ Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Precisión** | El cálculo nunca se equivoca |
| **Automatización** | No requiere entrada manual del precio |
| **Claridad** | El usuario ve todos los detalles del cuarto |
| **Flexibilidad** | Los datos se actualizan desde la API |
| **UX** | Feedback visual inmediato |
