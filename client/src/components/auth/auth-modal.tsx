import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleLogin = async () => {
    setIsLoading(true);
    // Redirect to Replit Auth
    window.location.href = '/api/login';
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="auth-modal">
        <Button 
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
          data-testid="button-close-auth-modal"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-xl">R</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to RooMe</h3>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone or Email</label>
              <Input 
                type="text" 
                placeholder="Enter phone or email" 
                value={formData.identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                data-testid="input-signin-identifier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="Enter password" 
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                data-testid="input-signin-password"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoading}
              data-testid="button-signin"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <div className="text-center">
              <button className="text-primary text-sm hover:underline">
                Forgot password?
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <Input 
                  type="text" 
                  placeholder="First name" 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  data-testid="input-signup-firstname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <Input 
                  type="text" 
                  placeholder="Last name" 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  data-testid="input-signup-lastname"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone or Email</label>
              <Input 
                type="text" 
                placeholder="Enter phone or email" 
                value={formData.identifier}
                onChange={(e) => handleInputChange('identifier', e.target.value)}
                data-testid="input-signup-identifier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input 
                type="password" 
                placeholder="Create password" 
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                data-testid="input-signup-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <Input 
                type="password" 
                placeholder="Confirm password" 
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                data-testid="input-signup-confirm-password"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoading}
              data-testid="button-signup"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
