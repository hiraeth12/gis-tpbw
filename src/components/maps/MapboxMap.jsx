import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchGempaData } from "@/api/fetchGempaData";
import MapboxGeoJSONKabKota from "@/components/geojson/MapboxGeoJSONKabKota";

const MapboxMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false); // Tambahan agar komponen GeoJSON nunggu map siap

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.error("MAPBOX TOKEN TIDAK TERBACA!");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [118, -2],
      zoom: 4,
      projection: "globe",
    });

    map.on("style.load", () => {
      map.setFog({
        color: "rgba(255,255,255,0.5)",
        "horizon-blend": 0.2,
      });
    });

    mapRef.current = map;

    map.on("load", async () => {
      setMapReady(true); // ✅ map siap, aktifkan GeoJSONKabKota

      try {
        const data = await fetchGempaData();
        map.addSource("earthquakes", {
          type: "geojson",
          data: data,
        });

        map.addLayer({
          id: "earthquakes-layer",
          type: "circle",
          source: "earthquakes",
          paint: {
            "circle-radius": ["*", ["to-number", ["get", "mag"]], 2],
            "circle-stroke-width": 2,
            "circle-color": [
              "case",
              ["<=", ["to-number", ["get", "depth"]], 50], "red",
              ["<=", ["to-number", ["get", "depth"]], 100], "orange",
              ["<=", ["to-number", ["get", "depth"]], 250], "yellow",
              ["<=", ["to-number", ["get", "depth"]], 600], "green",
              "blue"
            ],
            "circle-stroke-color": "white",
          },
        });

        map.on("click", "earthquakes-layer", (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const props = e.features[0].properties;
          const popupHTML = `
            <strong>Lokasi:</strong> ${props.place}<br/>
            <strong>Magnitude:</strong> ${props.mag}<br/>
            <strong>Kedalaman:</strong> ${props.depth} km<br/>
            <strong>Waktu:</strong> ${props.time}
          `;
          new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupHTML).addTo(map);
        });

        map.on("mouseenter", "earthquakes-layer", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "earthquakes-layer", () => {
          map.getCanvas().style.cursor = "";
        });

      } catch (error) {
        console.error("Terjadi kesalahan saat load data gempa:", error);
      }
    });

    return () => map.remove();
  }, []);

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
      {mapReady && mapRef.current && (
        <MapboxGeoJSONKabKota map={mapRef.current} />
      )}
    </>
  );
};

export default MapboxMap;
