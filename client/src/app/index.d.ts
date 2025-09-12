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

declare interface Faq {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

declare interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  userDisplayName: string;
  userPhoto: string;
  tripId: string;
  imageUrl?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
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
  transport?: Transport;
  travelStyle: string;
  duration: number;
  estimatedPrice: string;
  weatherInfo: string[];
  imageUrls: string[];
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

declare interface User {
  id: string;
  name: string;
  email: string;
  firebaseId: string;
  photoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: string;
  reviews?: Review[];
  messages?: Message[];
  adminOf?: Group[];
  groupMemberships?: GroupMember[];
}

declare interface Message {
  id: string;
  content: string;
  sender: User;
  senderId: string;
  group: Group;
  groupId: string;
  attachments: Attachment[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

declare interface Group {
  id: string;
  name: string;
  photoUrl: string;
  members: GroupMember[];
  admin: User;
  adminId: string;
  messages: Message[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

declare interface GroupMember {
  id: string;
  user: User;
  userId: string;
  group: Group;
  groupId: string;
  joinedAt: DateTime;
}

declare interface Attachment {
  id: string;
  url: string;
  fileType: string;
  message: Message;
  messageId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}


