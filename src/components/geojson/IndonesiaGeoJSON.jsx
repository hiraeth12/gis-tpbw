// components/MapboxGeoJSONKabKota.jsx
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const MapboxGeoJSONKabKota = ({ map }) => {
  useEffect(() => {
    if (!map) return;

    const loadGeoJSON = async () => {
      try {
        const response = await fetch("/geojson-indonesia/kota/all_kabkota_ind.geojson");
        const geojsonData = await response.json();

        // Tambahkan source GeoJSON kab/kota
        if (!map.getSource("kabkota")) {
          map.addSource("kabkota", {
            type: "geojson",
            data: geojsonData,
          });
        }

        // Tambahkan layer polygon (default transparan)
        if (!map.getLayer("kabkota-fill")) {
          map.addLayer({
            id: "kabkota-fill",
            type: "fill",
            source: "kabkota",
            paint: {
              "fill-color": "transparent",
              "fill-opacity": 0,
            },
          });
        }

        // Tambahkan layer outline
        if (!map.getLayer("kabkota-outline")) {
          map.addLayer({
            id: "kabkota-outline",
            type: "line",
            source: "kabkota",
            paint: {
              "line-color": "transparent",
              "line-width": 1,
            },
          });
        }

        // Hover effect (highlight menggunakan fill-color)
        map.on("mouseenter", "kabkota-fill", (e) => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty("kabkota-fill", "fill-color", "yellow");
          map.setPaintProperty("kabkota-fill", "fill-opacity", 0.3);
        });

        map.on("mouseleave", "kabkota-fill", () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty("kabkota-fill", "fill-color", "transparent");
          map.setPaintProperty("kabkota-fill", "fill-opacity", 0);
        });

        // Zoom ke polygon saat diklik
        map.on("click", "kabkota-fill", (e) => {
          const bounds = e.features[0].geometry.coordinates.reduce(
            (bounds, coord) => bounds.extend(coord[0]),
            new mapboxgl.LngLatBounds(e.features[0].geometry.coordinates[0][0], e.features[0].geometry.coordinates[0][0])
          );
          map.fitBounds(bounds, { padding: 20 });

          // Tampilkan popup
          const { name, alt_name, prov_name } = e.features[0].properties;
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <strong>${alt_name || name}</strong><br/>
              Provinsi: ${prov_name || "-"}
            `)
            .addTo(map);
        });

      } catch (err) {
        console.error("Gagal memuat GeoJSON Kab/Kota:", err);
      }
    };

    map.on("load", loadGeoJSON);
    // Bisa juga langsung panggil jika map sudah load
    if (map.loaded()) loadGeoJSON();

  }, [map]);

  return null;
};

export default MapboxGeoJSONKabKota;
