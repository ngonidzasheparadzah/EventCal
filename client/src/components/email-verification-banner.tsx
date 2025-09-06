import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, X, Loader2 } from "lucide-react";

export default function EmailVerificationBanner() {
  const [isResending, setIsResending] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { isEmailVerified, resendEmailVerification, session } = useAuth();
  const { toast } = useToast();

  // Don't show banner if email is verified or dismissed
  if (isEmailVerified || isDismissed || !session) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsResending(true);
    
    try {
      const { error } = await resendEmailVerification();
      
      if (error) {
        toast({
          title: "Failed to resend email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification email sent!",
          description: "Please check your email and click the verification link.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to resend email",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Please verify your email address
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Check your email and click the verification link to access all RooMe features.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              size="sm"
              variant="outline"
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-600 dark:text-yellow-200 dark:hover:bg-yellow-800"
              data-testid="button-resend-email-verification"
            >
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend email
            </Button>
            
            <Button
              onClick={() => setIsDismissed(true)}
              size="sm"
              variant="ghost"
              className="text-yellow-600 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-800"
              data-testid="button-dismiss-verification-banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}