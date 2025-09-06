import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Phone, PhoneCall, X, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export function PhoneVerificationBanner() {
  const { isPhoneVerified, user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [, setLocation] = useLocation();

  // Don't show banner if phone is verified, user doesn't exist, or banner is dismissed
  if (isPhoneVerified || !user || isDismissed) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
      <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium text-orange-800 dark:text-orange-200">
            Phone verification required
          </span>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            Please verify your phone number to access all RooMe features and improve account security.
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/profile/phone-verification")}
            className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-800"
            data-testid="button-verify-phone"
          >
            <PhoneCall className="h-3 w-3 mr-1" />
            Verify Phone
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-400 dark:hover:text-orange-200 dark:hover:bg-orange-800 p-1"
            data-testid="button-dismiss-phone-banner"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}