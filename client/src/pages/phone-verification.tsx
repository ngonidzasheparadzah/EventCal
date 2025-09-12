import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PhoneVerificationPage() {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendPhoneOTP, verifyPhoneOTP, updateUserPhone } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;

    // Format phone number (add +263 for Zimbabwe if not present)
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+263" + formattedPhone.substring(1);
      } else {
        formattedPhone = "+263" + formattedPhone;
      }
    }

    try {
      const { error } = await sendPhoneOTP(formattedPhone);
      
      if (error) {
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setPhoneNumber(formattedPhone);
        setStep("otp");
        toast({
          title: "OTP sent!",
          description: `A verification code has been sent to ${formattedPhone}`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      const { error } = await verifyPhoneOTP(phoneNumber, otp);
      
      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setStep("success");
        toast({
          title: "Phone verified!",
          description: "Your phone number has been successfully verified.",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await sendPhoneOTP(phoneNumber);
      
      if (error) {
        toast({
          title: "Failed to resend OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP resent!",
          description: "A new verification code has been sent to your phone.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Phone Verified!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your phone number has been successfully verified. You can now access all RooMe features.
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="w-full"
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
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => step === "otp" ? setStep("phone") : setLocation("/")}
              className="p-1"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Verify Phone Number</span>
              </CardTitle>
              <CardDescription>
                {step === "phone" 
                  ? "Enter your phone number to receive a verification code"
                  : "Enter the 6-digit code sent to your phone"
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  data-testid="input-phone-number"
                  placeholder="077 123 4567 or +263 77 123 4567"
                  className="text-base"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter your Zimbabwe phone number. We'll add the country code (+263) if needed.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
                data-testid="button-send-otp"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  minLength={6}
                  pattern="[0-9]{6}"
                  data-testid="input-otp-code"
                  placeholder="123456"
                  className="text-center text-lg tracking-widest"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sent to: {phoneNumber}
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
                data-testid="button-verify-otp"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Phone Number
              </Button>
              
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm"
                  data-testid="button-resend-otp"
                >
                  Didn't receive the code? Resend
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}