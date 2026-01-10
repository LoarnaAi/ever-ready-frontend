/** @format */

"use client";

import { usePathname } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarFooter = pathname?.startsWith("/home-removal");

  if (hideNavbarFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-everready-dark text-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

