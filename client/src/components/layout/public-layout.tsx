import { ReactNode } from "react";
import Header from "@/components/layout/header";
import TopNav from "@/components/layout/top-nav";
import Footer from "@/components/layout/footer";
import GuestMobileNav from "./guest-mobile-nav";

interface PublicLayoutProps {
  children: ReactNode;
  showTopNav?: boolean;
  className?: string;
}

export default function PublicLayout({ 
  children, 
  showTopNav = true,
  className = "" 
}: PublicLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header />
      {showTopNav && <TopNav />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <GuestMobileNav />
    </div>
  );
}