import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PropertyDetails from "@/pages/property-details";
import HostDashboard from "@/pages/host-dashboard";
import SearchResults from "@/pages/search-results";
import AuthPage from "@/pages/auth";
import EmailVerificationPage from "@/pages/email-verification";
import PasswordResetPage from "@/pages/password-reset";
import PhoneVerificationPage from "@/pages/phone-verification";
import OnboardingDemo from "@/pages/onboarding-demo";
import WebsiteType from "@/pages/website-type";
import GuestSignup from "@/pages/guest-signup";
import GuestContactVerification from "@/pages/guest-contact-verification";
import GuestPreferences from "@/pages/guest-preferences";
import OnboardingEntry from "@/components/onboarding/OnboardingEntry";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={OnboardingDemo} />
          <Route path="/website-type" component={WebsiteType} />
          <Route path="/guest-signup" component={GuestSignup} />
          <Route path="/guest-contact-verification" component={GuestContactVerification} />
          <Route path="/guest-preferences" component={GuestPreferences} />
          <Route path="/landing" component={Landing} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/auth/verify" component={EmailVerificationPage} />
          <Route path="/auth/reset-password" component={PasswordResetPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/browse" component={SearchResults} />
          <Route path="/property/:id" component={PropertyDetails} />
          <Route path="/host/dashboard" component={HostDashboard} />
          <Route path="/search" component={SearchResults} />
          <Route path="/profile/phone-verification" component={PhoneVerificationPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;
