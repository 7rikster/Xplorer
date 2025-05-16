import ProtectedRoute from "@/components/protectedRoutes";

export default function GenerateLayout({
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
