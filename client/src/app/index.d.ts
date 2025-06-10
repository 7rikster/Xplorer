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

declare interface Faq{
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

declare interface Review{
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userDisplayName: string;
  userPhoto: string;
  tripId: string;
  imageUrl?: string;
  publicId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  createAt?: Date;
  faqs: Faq[];
  reviews: Review[];
}

declare interface TripResponse {
  id: string;
  createdAt: Date;
  tripDetail: string;
  imageUrls: string[];
  city: string;
  country: string;
  groupType: string;
  budget: string;
}
