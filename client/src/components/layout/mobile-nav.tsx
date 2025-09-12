import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Search, Heart, Calendar, MessageCircle, User } from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      icon: Search,
      label: "Search", 
      path: "/search",
      testId: "nav-search"
    },
    {
      icon: Heart,
      label: "Saved",
      path: "/wishlist", 
      testId: "nav-saved",
      requiresAuth: true
    },
    {
      icon: Calendar,
      label: "Trips",
      path: "/bookings",
      testId: "nav-trips", 
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      testId: "nav-messages",
      requiresAuth: true
    },
    {
      icon: User,
      label: "Profile",
      path: isAuthenticated ? "/profile" : "/api/login",
      testId: "nav-profile"
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border bottom-nav-shadow z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || 
            (item.path === "/search" && location === "/");
          const canShow = !item.requiresAuth || isAuthenticated;

          if (!canShow) {
            return (
              <div key={item.path} className="flex flex-col items-center justify-center">
                <div className="w-5 h-5"></div>
                <span className="text-xs font-medium text-muted-foreground/50">—</span>
              </div>
            );
          }

          return (
            <button
              key={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => {
                if (item.path.startsWith('/api/')) {
                  window.location.href = item.path;
                } else {
                  setLocation(item.path);
                }
              }}
              data-testid={item.testId}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
