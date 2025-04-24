/// <reference types="vite/client" />

// Interfaz que define el formato de los puntos de carga
interface PuntoDeCarga {
  AddressInfo: {
    Title?: string; // Título del punto de carga
    AddressLine1?: string; // Dirección del punto de carga
    Town?: string; // Ciudad del punto de carga
    StateOrProvince?: string; // Estado o provincia del punto de carga
    Country?: {
      Title?: string; // País del punto de carga
    };
    Latitude: number; // Latitud del punto de carga
    Longitude: number; // Longitud del punto de carga
  };
  UsageCost?: string; // Costo del uso del punto de carga
  Connections?: {
    PowerKW?: number; // Potencia del punto de carga en kW
    CurrentType?: {
      Title?: string; // Tipo de corriente (AC, DC, etc.)
    };
  }[];
  DateLastStatusUpdate?: string; // Fecha de la última actualización del estado del punto de carga
}