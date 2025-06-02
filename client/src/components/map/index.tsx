"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { map } from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SetViewOnClick = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

interface MapPin {
  latitude?: number;
  longitude?: number;
  place?: string;
}

interface MapProps {
  mapPins: MapPin[];
}

const Map: React.FC<MapProps> = ({ mapPins }) => {
  const [locations, setLocations] = useState<MapPin[]>([]);

  useEffect(() => {
    if (mapPins && mapPins.length > 0) {
      setLocations(mapPins);
    }
  }, [mapPins]);

  return (
    <main>
      <div className="flex flex-col-reverse md:flex-row overflow-hidden justify-between intems-center mt-2 mb-8">
        <MapContainer
          center={
            locations && locations.length > 0
              ? [locations[0].latitude!, locations[0].longitude!]
              : [48.8566, 2.3522]
          }
          zoom={10}
          id="map"
          className="h-[70vh] w-100 rounded-xl shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations && locations.length > 0 && (
            <>
              {locations.map((location, index) => (
                <div key={index}>
                  {/* Set the view on click for each marker */}
                  <SetViewOnClick
                    key={`${index}`}
                    coords={[location.latitude!, location.longitude!]}
                  />
                  <Marker
                    key={`marker-${index}`}
                    position={[location.latitude!, location.longitude!]}
                  >
                    <Popup>{location.place}</Popup>
                  </Marker>
                </div>
              ))}
            </>
          )}
        </MapContainer>
      </div>
    </main>
  );
};

export default Map;
