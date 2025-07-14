"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type Place = {
  location: string;
  placeId: string;
  latitude?: number;
  longitude?: number;
};

interface DestinationContextType {
  place: Place | null;
  setPlace: (place: Place | null) => void;
}

export const DestinationContext = createContext<DestinationContextType | null>(null);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [place, setPlace] = useState<Place | null>(null);

  return (
    <DestinationContext.Provider value={{ place, setPlace }}>
      {children}
    </DestinationContext.Provider>
  );
};

function useDestination() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestination must be used within a DestinationProvider");
  }
  return context;
}

export { useDestination };
