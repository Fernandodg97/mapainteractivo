import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useCallback } from "react";
import { LatLngExpression } from "leaflet";
import { MapUpdater } from "./MapUpdater";
import L from "leaflet";

interface PuntoDeCarga {
  AddressInfo: {
    Title?: string;
    AddressLine1?: string;
    Town?: string;
    StateOrProvince?: string;
    Country?: {
      Title?: string;
    };
    Latitude: number;
    Longitude: number;
  };
  UsageCost?: string;
  Connections?: {
    PowerKW?: number;
    CurrentType?: {
      Title?: string;
    };
  }[];
  DateLastStatusUpdate?: string;
}

export function Map() {
  const [posicion, setPosicion] = useState<LatLngExpression>([41.5421, 2.4445]);
  const [ciudad, setCiudad] = useState<string>("");
  const [puntosCarga, setPuntosCarga] = useState<PuntoDeCarga[]>([]);
  const [maxResults, setMaxResults] = useState<number>(25);
  const [distanceKm, setDistanceKm] = useState<number>(10);

  const buscarCiudad = async () => {
    if (ciudad.trim() === "") return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${ciudad}&format=json&limit=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const newPos: LatLngExpression = [parseFloat(lat), parseFloat(lon)];
      setPosicion(newPos);
    } else {
      alert("Ciudad no encontrada");
    }

    setCiudad("");
  };

  const obtenerPuntosDeCarga = useCallback(async (lat: number, lon: number) => {
    const response = await fetch(
      `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${distanceKm}&distanceunit=KM&maxresults=${maxResults}&compact=true&verbose=false&key=d2dced1b-3959-4701-b1ed-ea19cc826dad`
    );
    const data = await response.json();
    setPuntosCarga(data);
  }, [distanceKm, maxResults]);

  useEffect(() => {
    if (posicion) {
      const [lat, lon] = posicion as [number, number];
      obtenerPuntosDeCarga(lat, lon);
    }
  }, [posicion, obtenerPuntosDeCarga]);

  const customIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // Función para obtener la ubicación actual del usuario
  const obtenerUbicacionUsuario = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setPosicion([lat, lon]);
        },
        () => {
          alert("No se pudo obtener tu ubicación");
        }
      );
    } else {
      alert("La geolocalización no está soportada por tu navegador.");
    }
  };

  return (
    <section className="map-component">
      <div className="search">
        <div className="input-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") buscarCiudad();
            }}
            placeholder="Introduce una ciudad"
          />
          <label htmlFor="maxResults">Máx. resultados:</label>
          <input
            id="maxResults"
            type="number"
            min={1}
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            placeholder="Máx. resultados"
          />
          <label htmlFor="distanceKm">Distancia (km):</label>
          <input
            id="distanceKm"
            type="number"
            min={1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            placeholder="Distancia (km)"
          />
        </div>
        <button onClick={buscarCiudad}>Buscar</button>
        {/* Botón para obtener la ubicación actual */}
        <button onClick={obtenerUbicacionUsuario}>Mi ubicación</button>
      </div>

      <div className="map">
        <MapContainer center={posicion} zoom={8} scrollWheelZoom={true}>
          <TileLayer
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater position={posicion} />
          <Marker position={posicion}>
            <Popup>Ciudad seleccionada.</Popup>
          </Marker>
          {puntosCarga.map((punto, index) => (
            <Marker
              key={index}
              position={[
                punto.AddressInfo.Latitude,
                punto.AddressInfo.Longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <strong>
                    {punto.AddressInfo?.Title || "Punto de carga"}
                  </strong>
                  <br />
                  {punto.AddressInfo?.AddressLine1}
                  <br />
                  {punto.AddressInfo?.Town}, {punto.AddressInfo?.StateOrProvince}
                  <br />
                  {punto.AddressInfo?.Country?.Title}
                  <hr />
                  <strong>Costo:</strong> {punto.UsageCost || "No especificado"}
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
                    : "Sin fecha"}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
