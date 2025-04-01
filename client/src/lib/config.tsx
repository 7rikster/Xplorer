import {
  BarChart,
  Hotel,
  LogOut,
  MapPinHouse,
  MapPinned,
  MicVocal,
  MountainSnow,
  Plane,
  PlaneTakeoff,
  Plus,
  Utensils,
} from "lucide-react";



export const ExplorePageHeaderContents = [
  {
    title: "Places",
    type: "text",
    link: "/explore/places",
    icon: <MapPinHouse />,
  },
  {
    title: "Events",
    type: "text",
    link: "/explore/events",
    icon: <MicVocal />,
  },
  {
    title: "Tours",
    type: "text",
    link: "/explore/tours",
    icon: <MountainSnow />,
  },
  {
    title: "Hotels",
    type: "text",
    link: "/explore/hotels",
    icon: <Hotel />,
  },
  {
    title: "Flights",
    type: "text",
    link: "/explore/flights",
    icon: <Plane />,
  },
  {
    title: "Restaurants",
    type: "text",
    link: "/explore/restaurants",
    icon: <Utensils />,
  },
  {
    title: "Generate",
    type: "button",
    link: "/generate",
  },
];

export const GeneratePageHeaderContents = [
  {
    title: "Create Trip",
    type: "text",
    link: "/generate/create-trip",
    icon: <Plus />,
  },
  {
    title: "My Trips",
    type: "text",
    link: "/generate/my-trips",
    icon: <PlaneTakeoff />,
  },
  {
    title: "Explore",
    type: "button",
    link: "/explore",
  },
];

export const AdminPageMenuItems = [
  {
    icon: BarChart,
    label: "Dashboard",
    value: "dashboard",
   
  },
  {
    icon: MapPinned,
    label: "Destinations",
    value: "destinations",

  },
  {
    icon: PlaneTakeoff,
    label: "Tours",
    value: "tours",

  },
  {
    icon: LogOut,
    label: "Logout",
    value: "logout",
  },
];