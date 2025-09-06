import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function EmailVerificationPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const { session, isEmailVerified, resendEmailVerification } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Handle email verification callback
    const handleVerification = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session && data.session.user.email_confirmed_at) {
        setVerificationComplete(true);
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified. Welcome to RooMe!",
        });
        
        // Redirect to home after verification
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    };

    // Check for verification token in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('type') === 'signup') {
      setIsVerifying(true);
      handleVerification().finally(() => setIsVerifying(false));
    }
  }, [toast, setLocation]);

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

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-lg font-semibold mb-2">Verifying your email...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your email address.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationComplete || isEmailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your email has been successfully verified. You can now access all RooMe features.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              data-testid="button-continue-home"
            >
              Continue to RooMe
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to{" "}
            <span className="font-medium">{session?.user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Email verification required
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                To start booking accommodations and hosting on RooMe, please verify your email address by clicking the link we sent you.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>
            
            <Button 
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline"
              className="w-full"
              data-testid="button-resend-verification"
            >
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend verification email
            </Button>
            
            <Button 
              onClick={() => setLocation("/auth")}
              variant="ghost"
              className="w-full"
              data-testid="button-back-to-auth"
            >
              Back to sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}