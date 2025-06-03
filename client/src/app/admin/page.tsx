"use client";

import AdminDashboard from "@/components/admin-dashboard";
import AdminDestination from "@/components/admin-destinations";
import AdminHoarding from "@/components/admin-hoarding";
import AdminTours from "@/components/admin-tours";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { signOut } from "@/lib/firebase/auth";
import {
  BarChart,
  GalleryThumbnails,
  LogOut,
  MapPinned,
  Menu,
  PlaneTakeoff,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toggleNav, setToggleNav] = useState(true);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <AdminDashboard />,
    },
    {
      icon: MapPinned,
      label: "Destinations",
      value: "destinations",
      component: <AdminDestination />,
    },
    {
      icon: PlaneTakeoff,
      label: "Trips",
      value: "trips",
      component: <AdminTours />,
    },
    {
      icon: GalleryThumbnails,
      label: "Hoardings",
      value: "hoardings",
      component: <AdminHoarding />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      if (mediaQuery.matches) {
        setToggleNav(false);
      } else {
        setToggleNav(true);
      }
    };

    handleResize();

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className=" min-h-screen flex bg-gray-100">
      <aside
        className={`fixed min-h-screen transition-all duration-300 ease-in-out ${
          toggleNav ? "w-12 md:w-18" : "w-48 md:w-64"
        } bg-white shadow-md md:block`}
      >
        <div className="flex items-center justify-center h-16 mt-4">
          <Link href="/explore">
            <div className="text-4xl font-semibold">
              <span className="text-5xl text-primary ">X</span>
              <span className={`${toggleNav == true ? "hidden" : ""}`}>
                plorer
              </span>
            </div>
          </Link>
        </div>
        <div className="p-1 pt-6 md:p-4 md:pt-6">
          <nav>
            <div className="lg:hidden flex justify-end ">
              <Button
                className="mb-2 cursor-pointer"
                onClick={() => setToggleNav(!toggleNav)}
              >
                {toggleNav ? <Menu /> : <X />}
              </Button>
            </div>
            {menuItems.map((item) => (
              <Button
                key={item.value}
                className="w-full mb-2 flex justify-start cursor-pointer"
                onClick={
                  item.value === "logout"
                    ? () => signOut()
                    : () => {
                        setActiveTab(item.value);
                        if (window.matchMedia("(max-width: 1023px)").matches) {
                          setToggleNav(true);
                        }
                      }
                }
                variant={item.value === activeTab ? "default" : "ghost"}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {toggleNav ? "" : item.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 ml-12 sm:ml-16 lg:ml-64 p-1 md:p-8  overflow-y-auto">
        <div className="max-w-[82.1rem] mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((item) => (
              <TabsContent key={item.value} value={item.value}>
                {item.component !== null ? item.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default Admin;
