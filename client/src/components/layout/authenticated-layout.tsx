import { ReactNode } from "react";
import Header from "@/components/layout/header";
import TopNav from "@/components/layout/top-nav";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { PhoneVerificationBanner } from "@/components/phone-verification-banner";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  showTopNav?: boolean;
  className?: string;
}

export default function AuthenticatedLayout({ 
  children, 
  showTopNav = true,
  className = "" 
}: AuthenticatedLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <Header />
      <EmailVerificationBanner />
      <PhoneVerificationBanner />
      {showTopNav && <TopNav />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}