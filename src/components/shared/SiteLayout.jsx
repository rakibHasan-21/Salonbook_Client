
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navber";
import Footer from "./Footer";

export default function SiteLayout({ children }) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}

      <main className="flex-1">
        {children}
      </main>

      {!isDashboard && <Footer />}
    </>
  );
}
