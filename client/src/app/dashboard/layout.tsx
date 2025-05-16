import ProtectedRoute from "@/components/protectedRoutes";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["CLIENT"]}>
      <main>{children}</main>
    </ProtectedRoute>
  );
}
