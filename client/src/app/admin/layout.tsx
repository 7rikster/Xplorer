import ProtectedRoute from "@/components/protectedRoutes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main>{children}</main>
    </ProtectedRoute>
  );
}
