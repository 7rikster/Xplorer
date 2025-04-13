"use client";

import AdminDashboard from "@/components/admin-dashboard";
import AdminDestination from "@/components/admin-destinations";
import AdminTours from "@/components/admin-tours";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { signOut } from "@/lib/firebase/auth";
import {
  BarChart,
  LogOut,
  MapPinned,
  Menu,
  PlaneTakeoff,
  X,
} from "lucide-react";
import { useState } from "react";

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
      label: "Tours",
      value: "tours",
      component: <AdminTours />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  return (
    <div className=" min-h-screen flex bg-gray-100">
      <aside
        className={`fixed min-h-screen transition-all duration-300 ease-in-out ${
          toggleNav ? "w-12 md:w-18" : "w-48 md:w-64"
        } bg-white shadow-md md:block`}
      >
        <div className="p-1 pt-18 sm:pt-28 md:p-4 md:pt-28">
          <nav>
            <div className="flex justify-end ">
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
                        setToggleNav(true);
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
      <main className="flex-1 ml-12 md:ml-18 p-1 md:p-8 pt-18 md:pt-30 overflow-y-auto">
        <div className="max-w-[82.1rem] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 ml-2 md:mb-8">
            Dashboard
          </h1>
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
