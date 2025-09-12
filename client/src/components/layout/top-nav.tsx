import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TopNavProps {
  className?: string;
}

export default function TopNav({ className = "" }: TopNavProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Derive activeTab from current URL location
  const getActiveTab = (currentLocation: string) => {
    if (currentLocation === "/" || currentLocation.startsWith("/search")) return "homes";
    if (currentLocation.startsWith("/marketplace")) return "marketplace";
    if (currentLocation.startsWith("/roommates")) return "roommates";
    return "homes"; // default fallback
  };
  
  const [activeTab, setActiveTab] = useState(() => getActiveTab(location));

  // Sync activeTab with URL changes
  useEffect(() => {
    setActiveTab(getActiveTab(location));
  }, [location]);

  // Top navigation tabs
  const navigationTabs = [
    {
      id: "homes",
      label: "Homes",
      path: "/",
      searchPlaceholder: "Search for places to stay...",
      testId: "tab-homes"
    },
    {
      id: "marketplace",
      label: "Marketplace", 
      path: "/marketplace",
      searchPlaceholder: "Search furniture, solar, cleaning & more...",
      testId: "tab-marketplace"
    },
    {
      id: "roommates",
      label: "Roommates",
      path: "/roommates", 
      searchPlaceholder: "Search roommates by area, age, lifestyle...",
      testId: "tab-roommates"
    }
  ];

  const currentTab = navigationTabs.find(tab => tab.id === activeTab);
  const searchPlaceholder = currentTab?.searchPlaceholder || "Start your search...";

  const handleTabClick = (tab: typeof navigationTabs[0]) => {
    setActiveTab(tab.id);
    setLocation(tab.path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${activeTab}`);
    }
  };

  return (
    <div className={`bg-card border-b border-border ${className}`}>
      <div className="responsive-container">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 py-4">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              onClick={() => handleTabClick(tab)}
              data-testid={tab.testId}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Search Bar */}
        <div className="pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg rounded-full border-2 border-muted focus:border-primary transition-colors"
                data-testid="input-search"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 hover:bg-muted"
                data-testid="button-search-filters"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}