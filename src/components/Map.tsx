// Importaciones necesarias para usar el mapa, componentes y funciones
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Importación de Leaflet para el mapa
import "leaflet/dist/leaflet.css"; // Importación de los estilos de Leaflet
import { useState, useEffect, useCallback } from "react"; // Importación de hooks de React
import { LatLngExpression } from "leaflet"; // Importación de tipos de Leaflet para las coordenadas
import { MapUpdater } from "./MapUpdater"; // Importación de componente para actualizar el mapa
import L from "leaflet"; // Importación de la librería de Leaflet para crear marcadores personalizados

export function Map() {
  // Estados para manejar la posición del mapa, ciudad, puntos de carga, y opciones de búsqueda
  const [posicion, setPosicion] = useState<LatLngExpression>([41.5421, 2.4445]); // Posición inicial del mapa
  const [ciudad, setCiudad] = useState<string>(""); // Ciudad que se va a buscar
  const [puntosCarga, setPuntosCarga] = useState<PuntoDeCarga[]>([]); // Lista de puntos de carga obtenidos
  const [maxResults, setMaxResults] = useState<number>(25); // Número máximo de resultados a mostrar
  const [distanceKm, setDistanceKm] = useState<number>(10); // Distancia en km para la búsqueda

  // Función que busca la ciudad usando la API de Nominatim (OpenStreetMap)
  const buscarCiudad = async () => {
    if (ciudad.trim() === "") return; // Si el campo de ciudad está vacío, no hacer nada

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${ciudad}&format=json&limit=1`
    );
    const data = await response.json(); // Obtiene la respuesta en formato JSON

    if (data && data.length > 0) {
      const { lat, lon } = data[0]; // Obtiene las coordenadas de la ciudad
      const newPos: LatLngExpression = [parseFloat(lat), parseFloat(lon)]; // Convierte las coordenadas en un tipo LatLngExpression
      setPosicion(newPos); // Actualiza la posición del mapa
    } else {
      alert("Ciudad no encontrada"); // Si no se encuentra la ciudad, muestra una alerta
    }

    setCiudad(""); // Limpia el campo de búsqueda
  };

  // Función que obtiene los puntos de carga cercanos a las coordenadas
  const obtenerPuntosDeCarga = useCallback(async (lat: number, lon: number) => {
    const response = await fetch(
      `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${distanceKm}&distanceunit=KM&maxresults=${maxResults}&compact=true&verbose=false&key=d2dced1b-3959-4701-b1ed-ea19cc826dad`
    );
    const data = await response.json(); // Obtiene los puntos de carga en formato JSON
    setPuntosCarga(data); // Actualiza los puntos de carga en el estado
  }, [distanceKm, maxResults]); // Dependencias: se vuelve a ejecutar si cambia la distancia o los resultados máximos

  // Hook de efecto que se ejecuta cuando cambia la posición
  useEffect(() => {
    if (posicion) {
      const [lat, lon] = posicion as [number, number]; // Extrae latitud y longitud de la posición
      obtenerPuntosDeCarga(lat, lon); // Obtiene los puntos de carga cercanos a la nueva posición
    }
  }, [posicion, obtenerPuntosDeCarga]); // Dependencias: se ejecuta cada vez que cambia la posición o la función obtenerPuntosDeCarga

  // Define un ícono personalizado para los puntos de carga usando Leaflet
  const customIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [12, 41], // Anclaje del icono
    popupAnchor: [1, -34], // Anclaje del popup
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", // Sombra del icono
    shadowSize: [41, 41], // Tamaño de la sombra
  });

  // Función para obtener la ubicación actual del usuario
  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude; // Obtiene la latitud de la ubicación
          const lon = position.coords.longitude; // Obtiene la longitud de la ubicación
          setPosicion([lat, lon]); // Actualiza la posición en el mapa
        },
        () => {
          alert("No se pudo obtener tu ubicación"); // Muestra una alerta si no se puede obtener la ubicación
        }
      );
    } else {
      alert("La geolocalización no está soportada por tu navegador."); // Alerta si la geolocalización no es soportada
    }
  };

  // Renderiza el componente del mapa
  return (
    <section className="map-component">
      {/* Componente de búsqueda */}
      <div className="search">
        <div className="input-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)} // Actualiza la ciudad al escribir
            onKeyDown={(e) => {
              if (e.key === "Enter") buscarCiudad(); // Ejecuta la búsqueda al presionar Enter
            }}
            placeholder="Introduce una ciudad" // Placeholder para el campo de texto
          />
          <label htmlFor="maxResults">Máx. resultados:</label>
          <input
            id="maxResults"
            type="number"
            min={1}
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))} // Actualiza el número máximo de resultados
            placeholder="Máx. resultados" // Placeholder para el número máximo de resultados
          />
          <label htmlFor="distanceKm">Distancia (km):</label>
          <input
            id="distanceKm"
            type="number"
            min={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))} // Actualiza la distancia en km
            placeholder="Distancia (km)" // Placeholder para la distancia
          />
        </div>
        <button onClick={buscarCiudad}>Buscar</button> {/* Botón de búsqueda */}
        <button onClick={obtenerUbicacionUsuario}>Mi ubicación</button> {/* Botón para obtener la ubicación del usuario */}
      </div>

      {/* Componente del mapa */}
      <div className="map">
        <MapContainer center={posicion} zoom={8} scrollWheelZoom={true}>
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Capa de mapa de OpenStreetMap
          />
          <MapUpdater position={posicion} /> {/* Componente para actualizar el mapa */}
          <Marker position={posicion}>
            <Popup>Ciudad seleccionada.</Popup> {/* Popup para la ciudad seleccionada */}
          </Marker>
          {/* Muestra los puntos de carga en el mapa */}
          {puntosCarga.map((punto, index) => (
            <Marker
              key={index}
              position={[
                punto.AddressInfo.Latitude,
                punto.AddressInfo.Longitude,
              ]}
              icon={customIcon} // Usa el ícono personalizado
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <strong>{punto.AddressInfo?.Title || "Punto de carga"}</strong> {/* Título del punto de carga */}
                  <br />
                  {punto.AddressInfo?.AddressLine1} {/* Dirección */}
                  <br />
                  {punto.AddressInfo?.Town}, {punto.AddressInfo?.StateOrProvince} {/* Ciudad y estado */}
                  <br />
                  {punto.AddressInfo?.Country?.Title} {/* País */}
                  <hr />
                  <strong>Costo:</strong> {punto.UsageCost || "No especificado"} {/* Costo de uso */}
                  <br />
                  <strong>Conectores:</strong>
                  <ul style={{ paddingLeft: "1.2em", margin: "0.3em 0" }}>
                    {punto.Connections?.map((conn, i) => (
                      <li key={i}>
                        {conn.PowerKW ? `${conn.PowerKW} kW` : ""}{" "}
                        {conn.CurrentType?.Title
                          ? `(${conn.CurrentType?.Title})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                  <strong>Última actualización:</strong>
                  <br />
                  {punto.DateLastStatusUpdate
                    ? new Date(punto.DateLastStatusUpdate).toLocaleString()
                    : "Sin fecha"} {/* Fecha de la última actualización */}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
