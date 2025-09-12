import { useLocation } from "wouter";
import { 
  Search,
  Heart,
  Calendar,
  MessageCircle,
  User
} from "lucide-react";

export default function GuestMobileNav() {
  const [location, setLocation] = useLocation();

  // Guest navigation items for unauthenticated users
  const guestNavItems = [
    {
      icon: Search,
      label: "Explore", 
      path: "/",
      testId: "nav-explore",
      requiresAuth: false
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
      testId: "nav-wishlist-login",
      requiresAuth: true
    },
    {
      icon: Calendar,
      label: "Trips",
      path: "/trips",
      testId: "nav-trips-login",
      requiresAuth: true
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      testId: "nav-messages-login",
      requiresAuth: true
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      testId: "nav-profile-login",
      requiresAuth: true
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border bottom-nav-shadow z-40">
      <div className="grid grid-cols-5 h-16">
        {guestNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || 
            (item.path === "/" && (location === "/" || location === "/search" || location === "/marketplace" || location === "/roommates"));

          return (
            <button
              key={item.testId}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => {
                if (item.requiresAuth) {
                  window.location.href = "/api/login";
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