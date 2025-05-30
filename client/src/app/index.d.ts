declare interface Activity {
  time: string;
  description: string;
  location: string;
  openingHours?: string;
  ticketPrice?: string;
  traverlTimeFromHotel?: string;
  travelTimeFromPrevious?: string;
}

declare interface DayPlan {
  day: number;
  location: string;
  photoUrl: string;
  activities: Activity[];
}

declare interface Location {
  city: string;
  country: string;
  coordinates: [number, number];
  openStreetMap: string;
}

declare interface Accommodation {
  hotelName: string;
  photoUrl: string;
  pricePerNight: string;
  location: string;
  amenities: string[];
  bookingLink?: string;
  stars?: number;
}

declare interface Transport {
  interCityTransport?: string[];
  localTransport?: string[];
  notes?: string;
}

declare interface Trip {
  id: string;
  name: string;
  accommodation: Accommodation;
  bestTimeToVisit: string[];
  budget: string;
  description: string;
  groupType: string;
  interests: string;
  itinerary: DayPlan[];
  location: Location;
  transport: Transport;
  travelStyle: string;
  duration: number;
  estimatedPrice: string;
  weatherInfo: string[];
  imageUrls: string[];
  createAt: Date;
}
