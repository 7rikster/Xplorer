"use client";

import { useUser } from "@/context/authContext";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  BarChart,
  CalendarDays,
  LogOut,
  Luggage,
  MapPin,
  Menu,
  MicVocal,
  PlaneTakeoff,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/firebase/auth";
import { useEffect, useRef, useState } from "react";

const discover = [
  { name: "Explore", href: "/explore", icon: <MapPin className="w-5 h-5" /> },
  {
    name: "Tours",
    href: "/explore/tours",
    icon: <Luggage className="w-5 h-5" />,
  },
  {
    name: "Flights",
    href: "/explore/flights",
    icon: <PlaneTakeoff className="w-5 h-5" />,
  },
  {
    name: "Events",
    href: "/explore/events",
    icon: <MicVocal className="w-5 h-5" />,
  },
];

const general = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    name: "My Itineraries",
    href: "/dashboard/itineraries",
    icon: <CalendarDays className="w-5 h-5" />,
  },
];

function SideNav() {
  const { user } = useUser();
  const pathName = usePathname();
  const [toggleNav, setToggleNav] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleNav &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setToggleNav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleNav]);

  return (
    <div>
      <div className="p-2 absolute">
        <Button
          className="absolute md:hidden"
          onClick={() => setToggleNav(!toggleNav)}
        >
          <Menu />
        </Button>
      </div>
      <div
      ref={navRef}
        className={`group h-screen bg-white flex flex-col z-100 p-3 md:p-4 transition-all duration-300 w-64 md:w-18 hover:w-64  overflow-hidden absolute top-0 left-0  md:translate-x-0 ${
          toggleNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="ml-auto md:hidden"
          onClick={() => setToggleNav(!toggleNav)}
        >
          <X className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 overflow-hidden">
          <Image
            src={user?.photoUrl || ""}
            width={48}
            height={48}
            alt="User"
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h1 className="font-semibold text-sm">{user?.name}</h1>
            <h2 className="text-xs text-gray-500 font-semibold">
              {user?.email}
            </h2>
          </div>
        </div>

        <Link href="/generate" className="mt-4">
          <Button className="w-full gap-2">
            <Plus className="w-5 h-5" />
            <span className="md:hidden group-hover:inline transition-inline duration-500">
              New Trip
            </span>
          </Button>
        </Link>

        {/* General Section */}
        <div className="mt-8">
          <h2 className="text-gray-500 font-bold mb-2 text-sm md:opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            GENERAL
          </h2>
          {general.map((item, index) => (
            <Link key={index} href={item.href} className="mb-2">
              <Button
                className={`w-full justify-start mb-2 gap-3 cursor-pointer ${
                  pathName === item.href ? "" : "text-gray-500"
                }`}
                variant={pathName === item.href ? "default" : "ghost"}
              >
                {item.icon}
                <span className="md:hidden group-hover:inline">
                  {item.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Discover Section */}
        <div className="mt-8">
          <h2 className="text-gray-500 font-bold mb-2 text-sm md:opacity-0 group-hover:opacity-100 transition-opacity duration-100">
            DISCOVER
          </h2>
          {discover.map((item, index) => (
            <Link key={index} href={item.href} className="mb-2">
              <Button
                className="w-full justify-start gap-3 text-gray-500 cursor-pointer mb-1"
                variant={pathName === item.href ? "default" : "ghost"}
              >
                {item.icon}
                <span className="md:hidden group-hover:inline">
                  {item.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto">
          <Button
            onClick={() => signOut()}
            variant={"ghost"}
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="md:hidden group-hover:inline">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
