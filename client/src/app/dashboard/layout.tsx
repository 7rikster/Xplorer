import SideNav from "@/components/dashboard-side-nav";
import ProtectedRoute from "@/components/protectedRoutes";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <SideNav />
      <main>{children}</main>
    </ProtectedRoute>
  );
}
