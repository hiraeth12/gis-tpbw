import { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { IndonesiaGeoJSON } from "./components/geojson/IndonesiaGeoJSON";

const customIcon = new Icon({
  iconUrl:
    "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
  iconSize: [38, 38],
});

function App() {
  const [markers, setMarkers] = useState([]);

  // Load Database Data Gempa
  useEffect(() => {
    fetch("http://localhost:5000/api/earthquakes")
      .then((res) => res.json())
      .then((data) => setMarkers(data))
      .catch((err) => console.log(err));
  }, []);

  function formatDateTime(dateTimeString) {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const date = new Date(dateTimeString);
    return date.toLocaleString("id-ID", options);
  }

  return (
    <>
      {/* Load Openstreet map */}
      <MapContainer
        center={[-6.968892, 107.628062]}
        zoom={6}
        style={{ height: "100vh" }}
      >
        {/* Styling untuk map disini */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* End Styling untuk map */}
        {/* Menampilkan GeoJSON Provinsi Indonesia */}
        <IndonesiaGeoJSON />
        {/* End Menampilkan GeoJSON Provinsi Indonesia */}
        <MarkerClusterGroup>
          {/* Menambahkan marker pada map */}
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={[marker.latitude, marker.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <strong>Location:</strong> {marker.location}
                  <br />
                  <strong>Magnitude:</strong> {marker.magnitude}
                  <br />
                  <strong>Magnitude Type:</strong> {marker.mag_type}
                  <br />
                  <strong>Depth:</strong> {marker.depth_km} km
                  <br />
                  <strong>Date:</strong> {formatDateTime(marker.date_time)}
                  <br />
                  <strong>Agency:</strong> {marker.agency}
                </div>
              </Popup>
            </Marker>
          ))}
          {/* End menambahkan marker pada map */}
        </MarkerClusterGroup>
      </MapContainer>
      {/* End Load Openstreet map */}
    </>
  );
}

export default App;
