import { useState } from 'react'
import './App.css'
import { Button } from "@/components/ui/button";
import { CarouselDemo } from './components/demo/CarouselDemo';
import { AccordionDemo } from './components/demo/AccordionDemo';
import { CardWithForm } from './components/demo/CardWithForm';
import { MapContainer, TileLayer, Marker,Popup} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { Icon, marker } from 'leaflet';
import { popup } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

function App() {

  const markers = [
    {
      geocode : [-6.968932438011169, 107.62807482627306],
      popup : "Telkom University Landmark Tower"
    },
    {
      geocode : [-6.9729009931341315, 107.62983122986925],
      popup : "GKU Telkom University"
    },

    {
      geocode : [-6.971523911982303, 107.63101908137517],
      popup : "Telkom University Convention Hall"
    },

    {
      geocode : [-6.971826095032829, 107.63251679405751],
      popup : "Open Library Telkom University"
    },

  ];

  const customIcon = new Icon({
    iconUrl :"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
    iconSize :[38,38]
  })


  return (
    <>
      {/* Menambahkan Openstreet Map */}
      <MapContainer center={[-6.968892, 107.628062]} zoom={17}>
        <TileLayer 
          attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        {/* Menambahkan Tanda pada Map */}
        <MarkerClusterGroup>
        {markers.map((marker) => (
          <Marker position={marker.geocode} icon={customIcon}>
            <Popup>
              {marker.popup}
            </Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
        {/* End */}
      </MapContainer>
      {/* End */}
    </>
  )
}

export default App
