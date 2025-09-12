import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PasswordResetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword, session } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated (has clicked reset link)
    if (!session) {
      toast({
        title: "Invalid reset link",
        description: "Please use the link from your email to reset your password.",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [session, toast, setLocation]);

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password updated!",
          description: "Your password has been successfully updated.",
        });
        
        // Redirect to home after a short delay
        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Password update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Password Updated!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your password has been successfully updated. You can now access your RooMe account.
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
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>
            Enter your new password for your RooMe account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                data-testid="input-new-password"
                placeholder="Enter your new password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                data-testid="input-confirm-password"
                placeholder="Confirm your new password"
              />
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Password Requirements
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Your password must be at least 6 characters long and should include a mix of letters, numbers, and symbols for better security.
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
              data-testid="button-update-password"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}