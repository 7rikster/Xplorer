"use client"; // this is mandatory

import { SocketProvider } from "@/context/socketContext";
import ProtectedRoute from "@/components/protectedRoutes";
import SideNav from "@/components/dashboard-side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <ProtectedRoute allowedRoles={["CLIENT"]}>
        <SideNav />
        <main>{children}</main>
      </ProtectedRoute>
    </SocketProvider>
  );
}
