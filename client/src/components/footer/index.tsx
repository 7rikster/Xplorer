"use client";

import { usePathname } from "next/navigation";

function Footer() {
    const pathName = usePathname();

    return (
      <footer className={` bg-red-500 h-60 text-white py-4 ${pathName.startsWith("/admin") ? "hidden" : ""}`}>
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    );
}

export default Footer;