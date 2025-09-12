// /app/explore/destinations/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDestination } from "@/context/destinationContext";

export default function DestinationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { setPlace } = useDestination();

  useEffect(() => {
    // Run only if we're exactly on /explore/destinations (not inside [placeId])
    const isBasePage = pathname === "/explore/destinations";
    console.log("Current Pathname:", pathname, "Is Base Page:", isBasePage);
    if (isBasePage) {
      setPlace(null);
    }
  }, [pathname]);

  return <>{children}</>;
}
