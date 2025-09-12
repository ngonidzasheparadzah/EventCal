import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border app-nav">
      <div className="responsive-container">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setLocation('/')}
            data-testid="logo"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-foreground">RooMe</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setLocation('/')}
              data-testid="nav-stays"
            >
              Stays
            </button>
            <button 
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLocation('/services')}
              data-testid="nav-services"
            >
              Services
            </button>
            {isAuthenticated && (
              <button 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setLocation('/host/dashboard')}
                data-testid="nav-host"
              >
                Host
              </button>
            )}
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost"
                  className="hidden md:block text-muted-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setLocation('/host/dashboard')}
                  data-testid="button-rent-property"
                >
                  Rent your property
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="flex items-center space-x-3 p-2 border border-border rounded-full hover:shadow-md transition-shadow"
                      data-testid="button-user-menu"
                    >
                      <Menu className="w-5 h-5 text-muted-foreground" />
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        {user?.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setLocation('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/bookings')}>
                      Your trips
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/wishlist')}>
                      Wishlists
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLocation('/host/dashboard')}>
                      Host dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation('/help')}>
                      Help
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                variant="ghost"
                className="flex items-center space-x-3 p-2 border border-border rounded-full hover:shadow-md transition-shadow"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
