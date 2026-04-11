'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not showing in Next.js
// But since we use custom markers, this is less critical
const createCustomIcon = (price: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="price-marker-outer">
        <div class="price-marker-inner">${price}</div>
        <div class="price-marker-pulse"></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

interface LeafletMapProps {
  properties: any[];
}

// Sub-component for custom controls
const MapControls = () => {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleLocate = () => {
    map.locate().on('locationfound', (e) => {
      map.flyTo(e.latlng, 15);
      L.marker(e.latlng).addTo(map).bindPopup("Kamu di sini!").openPopup();
    });
  };

  return (
    <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
      <div className="flex flex-col bg-white-pure/90 backdrop-blur-md rounded-xl shadow-premium border border-white/20 overflow-hidden">
        <button 
          onClick={handleZoomIn}
          className="p-3 hover:bg-surface-gray border-b border-border-line text-text-dark transition-colors"
          title="Zoom In"
        >
          <span className="text-xl font-bold">+</span>
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 hover:bg-surface-gray text-text-dark transition-colors"
          title="Zoom Out"
        >
          <span className="text-xl font-bold">−</span>
        </button>
      </div>

      <button 
        onClick={handleLocate}
        className="p-3 bg-white-pure/90 backdrop-blur-md rounded-xl shadow-premium border border-white/20 text-brand-blue hover:text-brand-orange transition-all active:scale-95"
        title="Lokasi Saya"
      >
        <MapIcon size={20} />
      </button>
    </div>
  );
};

export default function LeafletMap({ properties }: LeafletMapProps) {
  // Center map on Central Java (Semarang area)
  const defaultCenter: [number, number] = [-7.025, 110.320];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={11} 
      scrollWheelZoom={true}
      className="w-full h-full"
      zoomControl={false} // We will add custom controls later or just use default position
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      <MapControls />
      
      {properties.map((prop) => (
        <Marker 
          key={prop.id} 
          position={[prop.coords.lat, prop.coords.lng]} 
          icon={createCustomIcon(prop.price.split(' ')[1] + (prop.price.includes('Miliar') ? 'M' : 'jt'))}
        >
          <Popup className="premium-popup">
            <div className="p-1">
              <img src={prop.image} alt={prop.name} className="w-full h-24 object-cover rounded-lg mb-2" />
              <h4 className="font-bold text-brand-blue text-sm">{prop.name}</h4>
              <p className="text-brand-orange font-bold text-xs">{prop.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
