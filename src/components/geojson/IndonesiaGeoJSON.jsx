// components/IndonesiaGeoJSON.jsx
import { GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export const IndonesiaGeoJSON = () => {
  const [geoData, setGeoData] = useState(null);
  const map = useMap(); // akses instance peta

  useEffect(() => {
    fetch("/geojson-indonesia/kota/all_kabkota_ind.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  // Style default polygon
  const geoStyle = {
    weight: 0,            // hilangkan garis tepi
    color: "transparent", // jika ada, tetap transparan
    fillColor: "transparent", // tidak ada warna isi
    fillOpacity: 0,       // isi benar-benar tidak kelihatan
  };

  // Fungsi styling saat highlight hover
  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: "#666",        // garis tepi saat hover
      fillColor: "yellow",  // warna isi saat hover
      fillOpacity: 0.5,
    });
  
    layer.bringToFront();
    layer._path.style.cursor = "pointer";
  };
  

  // Fungsi reset ke style default saat mouse keluar
  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 0,
      color: "transparent",
      fillColor: "transparent",
      fillOpacity: 0,
    });
  };
  

  // Fungsi zoom saat klik polygon
  const zoomToFeature = (e) => {
    map.fitBounds(e.target.getBounds());
  };

  // onEachFeature untuk bind event dan popup
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const { name, alt_name, prov_name, sample_value } = feature.properties;
  
      layer.bindPopup(`<strong>${feature.properties.alt_name}</strong>`);
    }
  
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature,
    });
  };
  

  // Simpan referensi GeoJSON agar bisa akses resetStyle
  let geojsonRef = null;

  return (
    geoData && (
      <GeoJSON
        data={geoData}
        style={geoStyle}
        onEachFeature={onEachFeature}
        ref={(ref) => {
          if (ref) geojsonRef = ref; // pastikan geojsonRef terisi
        }}
      />
    )
  );
};
