// Importamos el hook `useMap` de react-leaflet, que permite acceder a la instancia del mapa de Leaflet
import { useMap } from 'react-leaflet';
// Importamos `useEffect` de React para ejecutar un efecto cuando cambie la posición
import { useEffect } from 'react';
// Importamos el tipo LatLngExpression de Leaflet, que representa una latitud y longitud
import { LatLngExpression } from 'leaflet';

// Exportamos un componente funcional llamado MapUpdater
// Recibe como prop una `position` (latitud y longitud) a la cual debe mover el mapa
export function MapUpdater({ position }: { position: LatLngExpression }) {
  // Obtenemos la instancia del mapa con el hook `useMap`
  const map = useMap();

  // Usamos useEffect para ejecutar el cambio de vista del mapa
  // Este efecto se ejecuta cada vez que cambia `position` o `map`
  useEffect(() => {
    // Movemos la vista del mapa a la nueva posición con un zoom de 13
    // `flyTo` crea una animación de transición hacia la nueva posición
    map.flyTo(position, 13);
  }, [position, map]);

  // Este componente no renderiza nada en el DOM, solo ejecuta lógica
  return null;
}
