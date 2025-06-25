export const selectItems = ["groupType", "travelStyle", "interest", "budget"];

export const groupTypes = [
  "Family",
  "Friends",
  "Couple",
  "Solo",
  "Business",
  "Other",
];

export const travelStyle = {
  Family: [
    "Leisure & Relaxation",
    "Theme Parks & Attractions",
    "Wildlife & Nature",
    "Educational Tours",
    "Cultural & Heritage"
  ],
  Friends: [
    "Adventure & Trekking",
    "Road Trips",
    "Beach Parties",
    "Nightlife & Clubs",
    "Backpacking"
  ],
  Couple: [
    "Romantic Getaway",
    "Luxury Retreat",
    "Beach & Islands",
    "Spa & Wellness",
    "Sunset Cruises"
  ],
  Solo: [
    "Backpacking",
    "Spiritual & Wellness",
    "Adventure & Exploration",
    "Self-Discovery Retreats",
    "Volunteering Trips"
  ],
  Business: [
    "Conference & Expo",
    "City Business Tour",
    "Short Stay Packages",
    "Luxury Business Hotels",
    "Networking Events"
  ],
  Other: [
    "Custom Experience",
    "Cultural Exploration",
    "Nature & Wildlife",
    "Slow Travel",
    "Photography Tour"
  ]
};

export const interests = {
  Family: [
    "Zoos & Aquariums",
    "Museums",
    "Amusement Parks",
    "Picnics & Nature Walks",
    "Cultural Experiences",
    "Historical Sites",
    "Hiking & Nature Trails",
    "Shopping & Souvenirs"
  ],
  Friends: [
    "Hiking & Camping",
    "Beaches & Water Sports",
    "Live Music & Festivals",
    "Food & Street Markets",
    "Gaming & Arcades",
    "Extreme Sports",
    "Nightlife & Bars",
    "Cultural Experiences"
  ],
  Couple: [
    "Sunset Viewing",
    "Fine Dining",
    "Private Tours",
    "Art Galleries",
    "Hot Air Balloon Rides",
    "Spa Experiences",
    "Cultural Experiences",
    "Hiking & Camping",
    "Beaches & Water Sports",
    "Live Music & Festivals",
  ],
  Solo: [
    "Photography",
    "Live Music & Festivals",
    "Food & Street Markets",
    "Meditation & Yoga",
    "Reading & Writing",
    "Scenic Exploration",
    "Art & Creativity",
    "Local Immersion",
    "Museums",
  ],
  Business: [
    "Golf",
    "Corporate Dining",
    "Exhibitions & Expos",
    "City Tours",
    "Luxury Shopping",
    "Airport Lounge Access"
  ],
  Other: [
    "Bird Watching",
    "Local Festivals",
    "Gardens & Parks",
    "Artisan Markets",
    "Spiritual Sites",
    "Sustainable Travel",
    "Live Music & Festivals",
    "Food & Street Markets",
  ]
};

export const budget = [
    "Economy",
    "Mid-Range",
    "Luxury",
    "Premium",
]

export const creditPlans = [
  {
    name: "Basic",
    price: 10,
    credits: 3,
    description: "Get 3 credits for $10",
    itineraryEdit: false,
    customerSupport: false,
    updates: false,
  },
  {
    name: "Pro",
    price: 50,
    credits: 20,
    description: "Get 20 credits for $50",
    itineraryEdit: true,
    customerSupport: false,
    updates: false,
  },
  {
    name: "Premium",
    price: 100,
    credits: 50,
    description: "Get 50 credits for $100",
    itineraryEdit: true,
    customerSupport: true,
    updates: true,
  },
]
