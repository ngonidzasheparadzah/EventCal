import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Building, 
  BarChart3, 
  MessageCircle, 
  MoreHorizontal,
  Search,
  Heart,
  Calendar,
  User
} from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isHost = user?.role === "host";

  // Host navigation items (5 tabs: Dashboard, Listings, Insights, Messages, More)
  const hostNavItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/host/dashboard",
      testId: "nav-dashboard",
      requiresAuth: true
    },
    {
      icon: Building,
      label: "Listings",
      path: "/host/listings",
      testId: "nav-listings",
      requiresAuth: true
    },
    {
      icon: BarChart3,
      label: "Insights",
      path: "/host/insights",
      testId: "nav-insights",
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
      icon: MoreHorizontal,
      label: "More",
      path: "/host/more",
      testId: "nav-more",
      requiresAuth: true
    }
  ];

  // Guest navigation items (Explore, Wishlist, Trips, Messages, Profile)
  const guestNavItems = [
    {
      icon: Search,
      label: "Explore", 
      path: "/",
      testId: "nav-explore"
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist", 
      testId: "nav-wishlist",
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

  const navItems = isAuthenticated && isHost ? hostNavItems : guestNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border bottom-nav-shadow z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || 
            (item.path === "/" && (location === "/" || location === "/search")) ||
            (item.path.startsWith("/host") && location.startsWith("/host") && location.includes(item.path.split("/")[2]));
          const canShow = !item.requiresAuth || isAuthenticated;

          if (!canShow) {
            return (
              <button
                key={item.path}
                className="flex flex-col items-center justify-center space-y-1 transition-colors hover:bg-muted/50 text-muted-foreground"
                onClick={() => {
                  window.location.href = "/api/login";
                }}
                data-testid={`${item.testId}-login`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
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
