"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

interface MapProps {
  latitude?: number;
  longitude?: number;
  place?: string;
}

const Map: React.FC<MapProps> = ({ latitude, longitude, place }) => {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      (location === null ||
        location[0] !== latitude ||
        location[1] !== longitude)
    ) {
      setLocation([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <main>
      <div className="flex flex-col-reverse md:flex-row overflow-hidden justify-between intems-center mt-2 mb-8">
        <MapContainer
          center={location ? location : [48.8566, 2.3522]}
          zoom={10}
          id="map"
          className="h-[70vh] w-100 rounded-xl shadow"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {location && (
            <>
              <SetViewOnClick coords={location} />
              <Marker position={location}>
                <Popup>{place}</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </main>
  );
};

export default Map;
