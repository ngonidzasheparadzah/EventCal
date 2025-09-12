import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { useAuth, AuthProvider } from "@/hooks/use-auth";
import AuthenticatedLayout from "@/components/layout/authenticated-layout";
import PublicLayout from "@/components/layout/public-layout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PropertyDetails from "@/pages/property-details";
import HostDashboard from "@/pages/host-dashboard";
import HostListings from "@/pages/host-listings";
import HostInsights from "@/pages/host-insights";
import HostMore from "@/pages/host-more";
import SearchResults from "@/pages/search-results";
import Marketplace from "@/pages/marketplace";
import Roommates from "@/pages/roommates";
import Messages from "@/pages/messages";
import Wishlist from "@/pages/wishlist";
import Bookings from "@/pages/bookings";
import Profile from "@/pages/profile";
import AuthPage from "@/pages/auth";
import EmailVerificationPage from "@/pages/email-verification";
import PasswordResetPage from "@/pages/password-reset";
import PhoneVerificationPage from "@/pages/phone-verification";
import OnboardingDemo from "@/pages/onboarding-demo";
import WebsiteType from "@/pages/website-type";
import GuestSignup from "@/pages/guest-signup";
import GuestContactVerification from "@/pages/guest-contact-verification";
import GuestPreferences from "@/pages/guest-preferences";
import BrowsePage from "@/pages/browse";
import OnboardingEntry from "@/components/onboarding/OnboardingEntry";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          {/* Onboarding flows without layout */}
          <Route path="/onboarding" component={OnboardingDemo} />
          <Route path="/website-type" component={WebsiteType} />
          <Route path="/guest-signup" component={GuestSignup} />
          <Route path="/guest-contact-verification" component={GuestContactVerification} />
          <Route path="/guest-preferences" component={GuestPreferences} />
          <Route path="/landing" component={Landing} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/auth/verify" component={EmailVerificationPage} />
          <Route path="/auth/reset-password" component={PasswordResetPage} />
          
          {/* Public routes with navigation */}
          <PublicLayout>
            <Route path="/" component={BrowsePage} />
            <Route path="/browse" component={BrowsePage} />
            <Route path="/search" component={SearchResults} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/roommates" component={Roommates} />
            <Route path="/property/:id" component={PropertyDetails} />
          </PublicLayout>
        </>
      ) : (
        <AuthenticatedLayout>
          <Route path="/" component={Home} />
          <Route path="/property/:id" component={PropertyDetails} />
          <Route path="/host/dashboard" component={HostDashboard} />
          <Route path="/host/listings" component={HostListings} />
          <Route path="/host/insights" component={HostInsights} />
          <Route path="/host/more" component={HostMore} />
          <Route path="/search" component={SearchResults} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/roommates" component={Roommates} />
          <Route path="/messages" component={Messages} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/profile" component={Profile} />
          <Route path="/profile/phone-verification" component={PhoneVerificationPage} />
        </AuthenticatedLayout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OnboardingProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </OnboardingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
