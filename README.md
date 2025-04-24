# Mapa Interactivo de Puntos de Carga

## Descripción General
Esta aplicación web interactiva permite a los usuarios buscar y visualizar puntos de carga para vehículos eléctricos en un mapa. Utiliza datos de OpenChargeMap API para mostrar información detallada sobre las estaciones de carga, incluyendo su ubicación, características técnicas y costos.

## Especificaciones Técnicas

### Tecnologías Utilizadas
- **Frontend**: React + TypeScript
- **Bundler**: Vite
- **Mapas**: Leaflet + React-Leaflet
- **APIs Externas**:
  - OpenChargeMap API (para datos de puntos de carga)
  - Nominatim (OpenStreetMap) para geocodificación

### Requisitos del Sistema
- Node.js (versión 14 o superior)
- NPM o Yarn
- Navegador web moderno con soporte para JavaScript ES6+

### Dependencias Principales
- react-leaflet
- leaflet
- react
- typescript
- vite

## Explicación del Código

### Estructura del Proyecto
```
src/
├── components/
│   ├── Map.tsx
│   └── MapUpdater.tsx
├── App.tsx
├── main.tsx
└── assets/
```

### Componentes Principales

#### Map.tsx
Componente principal que implementa la funcionalidad del mapa interactivo:
- Gestiona el estado de la aplicación (posición, ciudad, puntos de carga)
- Implementa la búsqueda de ciudades
- Muestra los puntos de carga en el mapa
- Proporciona controles para ajustar parámetros de búsqueda
- Muestra información detallada de cada punto de carga en popups

#### MapUpdater.tsx
Componente auxiliar que maneja la actualización de la vista del mapa:
- Utiliza el hook `useMap` de react-leaflet
- Actualiza la posición del mapa cuando cambia la ubicación seleccionada
- Implementa animaciones suaves de transición

## Uso y Ejemplos

### Instalación
1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```
3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

### Funcionalidades
1. **Búsqueda por Ciudad**: Introduce el nombre de una ciudad para centrar el mapa en esa ubicación
2. **Mi Ubicación**: Utiliza la geolocalización del navegador para centrar el mapa en tu posición actual
3. **Ajustes de Búsqueda**:
   - Máximo de resultados a mostrar
   - Radio de búsqueda en kilómetros
4. **Visualización de Puntos de Carga**:
   - Marcadores verdes indican puntos de carga
   - Click en un marcador muestra información detallada
   - Información incluye: dirección, potencia, tipo de conector, costos y última actualización

## Posibles Mejoras y Extensiones

1. **Funcionalidades Adicionales**:
   - Filtrado por tipo de conector
   - Búsqueda por rango de potencia
   - Filtrado por disponibilidad en tiempo real
   - Ruta óptima entre puntos de carga

2. **Mejoras de UX/UI**:
   - Implementar un sistema de favoritos
   - Añadir modo claro
   - Mejorar la responsividad en dispositivos móviles
   - Añadir animaciones de carga

3. **Optimizaciones Técnicas**:
   - Implementar caché de resultados
   - Añadir pruebas unitarias y de integración
   - Optimizar el rendimiento del mapa con grandes conjuntos de datos
   - Implementar lazy loading de marcadores

4. **Características Sociales**:
   - Sistema de comentarios y valoraciones
   - Compartir ubicaciones favoritas
   - Integración con redes sociales

## Contribución
Las contribuciones son bienvenidas. Por favor, asegúrate de:
1. Seguir las convenciones de código existentes
2. Añadir pruebas para nuevas funcionalidades
3. Documentar los cambios realizados
4. Crear un pull request con una descripción clara de los cambios 

## Autores
- [@Fernandodg97](https://github.com/Fernandodg97)

## Licencia
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es)