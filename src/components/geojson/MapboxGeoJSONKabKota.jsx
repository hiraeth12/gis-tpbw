import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

const MapboxGeoJSONKabKota = ({ map }) => {
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (!map) return;

    const sourceId = "kabkota-source";
    const fillLayerId = "kabkota-layer";
    const highlightLayerId = "kabkota-highlight";

    const loadGeoJSON = async () => {
      try {
        const response = await fetch(
          "/geojson-indonesia/kota/all_kabkota_ind.geojson"
        );
        const data = await response.json();

        // Tambah source jika belum ada
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: "geojson",
            data: data,
          });
        }

        // Layer utama dengan fill transparan
        if (!map.getLayer(fillLayerId)) {
          map.addLayer({
            id: fillLayerId,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": "transparent",
              "fill-opacity": 0,
            },
          });
        }

        // Tambah layer border
        if (!map.getLayer(`${fillLayerId}-border`)) {
          map.addLayer({
            id: `${fillLayerId}-border`,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": "transparent",
              "line-width": 1,
            },
          });
        }

        if (!map.getLayer(highlightLayerId)) {
          map.addLayer({
            id: highlightLayerId,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": "yellow",
              "fill-opacity": 0.5,
            },
            filter: ["==", ["get", "mhid"], ""], 
          });
        }

        map.on("mousemove", fillLayerId, (e) => {
          if (e.features.length > 0) {
            const id = e.features[0].properties.mhid;

            // Ganti filter layer highlight hanya untuk fitur yg dihover
            map.setFilter(highlightLayerId, ["==", ["get", "mhid"], id]);
            setHoveredId(id);

            // 🔥 Set cursor jadi pointer
            map.getCanvas().style.cursor = "pointer";
          }
        });

        map.on("mouseleave", fillLayerId, () => {
          // Reset filter highlight
          map.setFilter(highlightLayerId, ["==", ["get", "mhid"], ""]);
          setHoveredId(null);

          // 🔥 Kembalikan cursor ke default
          map.getCanvas().style.cursor = "";
        });

        map.on("mouseleave", fillLayerId, () => {
          // Reset filter highlight
          map.setFilter(highlightLayerId, ["==", ["get", "mhid"], ""]);
          setHoveredId(null);
        });

        // Tambah popup saat klik
        map.on("click", fillLayerId, (e) => {
          const props = e.features[0].properties;
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>${props.alt_name || props.name}</strong>`)
            .addTo(map);
        });
      } catch (err) {
        console.error("Gagal load GeoJSON KabKota:", err);
      }
    };

    loadGeoJSON();
  }, [map]);

  return null;
};

export default MapboxGeoJSONKabKota;
