import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Heart, Star, MapPin, Filter, Home, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface Listing {
  id: string;
  title: string;
  location: string;
  city: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  images: string[];
  propertyType: string;
  maxGuests: number;
  isActive: boolean;
  hostId: string;
}

export default function BrowsePage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("homes");
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch listings
  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/listings'],
    enabled: true,
  });

  const promptSignup = (action: string) => {
    toast({
      title: "Sign up to continue",
      description: `Please create an account to ${action}. It only takes a minute!`,
      action: (
        <Button 
          onClick={() => setLocation('/guest-signup')}
          className="bg-[#0390D7] hover:bg-[#027BB8] text-white"
        >
          Sign Up
        </Button>
      ),
    });
  };

  const handleFavorite = (listingId: string) => {
    if (!user) {
      promptSignup("save favorites");
      return;
    }
    // TODO: Implement favorite functionality for authenticated users
  };

  const handleContact = (listingId: string) => {
    if (!user) {
      promptSignup("contact hosts");
      return;
    }
    // TODO: Implement contact functionality for authenticated users
  };

  const categories = [
    { id: "homes", label: "Homes", icon: Home },
    { id: "experiences", label: "Experiences", icon: Calendar, badge: "NEW" },
    { id: "services", label: "Services", icon: Users, badge: "NEW" },
  ];

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Start your search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-gray-300 rounded-full focus:ring-2 focus:ring-[#0390D7] focus:border-transparent"
              data-testid="input-search"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center space-y-1 pb-2 border-b-2 transition-colors ${
                    activeCategory === category.id
                      ? 'border-[#0390D7] text-[#0390D7]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid={`tab-${category.id}`}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {category.badge && (
                      <span className="absolute -top-1 -right-2 bg-[#0390D7] text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
                        {category.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Continue Searching Section */}
        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Continue searching for homes in {searchQuery || "Zimbabwe"}
              </h2>
              <Button variant="ghost" size="sm" className="text-[#0390D7]">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        )}

        {/* Featured Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Featured Accommodations
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-2xl mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.slice(0, 12).map((listing) => (
                <div key={listing.id} className="group cursor-pointer" data-testid={`listing-${listing.id}`}>
                  {/* Property Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                    <img
                      src={listing.images[0] || "/placeholder-room.jpg"}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(listing.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                      data-testid={`favorite-${listing.id}`}
                    >
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>
                    
                    {/* Guest Favourite Badge */}
                    {listing.rating > 4.5 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-900">
                          Guest favourite
                        </span>
                      </div>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      1/{listing.images.length || 1}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{listing.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-current text-gray-900" />
                        <span className="text-sm font-medium">{listing.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-semibold text-gray-900">${listing.pricePerNight}</span>
                        <span className="text-gray-600 text-sm"> per night</span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContact(listing.id);
                        }}
                        className="text-sm text-[#0390D7] hover:text-[#027BB8] font-medium"
                        data-testid={`contact-${listing.id}`}
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Section (for guests who have browsed before) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Explore by City
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Harare", "Bulawayo", "Victoria Falls", "Mutare"].map((city) => (
              <button
                key={city}
                onClick={() => setSearchQuery(city)}
                className="text-left p-4 border border-gray-200 rounded-xl hover:border-[#0390D7] transition-colors"
                data-testid={`city-${city.toLowerCase()}`}
              >
                <h4 className="font-medium text-gray-900">{city}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {listings.filter(l => l.city.toLowerCase().includes(city.toLowerCase())).length} properties
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Prompt */}
        <div className="bg-gray-50 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to book your perfect stay?
          </h3>
          <p className="text-gray-600 mb-4">
            Create an account to save favorites, contact hosts, and book accommodations across Zimbabwe.
          </p>
          <Button
            onClick={() => setLocation('/guest-signup')}
            className="bg-[#0390D7] hover:bg-[#027BB8] text-white px-8 py-3 text-lg"
            data-testid="button-signup-prompt"
          >
            Get Started
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Already have an account?{' '}
            <button
              onClick={() => setLocation('/auth')}
              className="text-[#0390D7] hover:text-[#027BB8] font-medium"
              data-testid="link-signin-prompt"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button
            className="flex flex-col items-center py-2 px-4 text-[#0390D7]"
            data-testid="nav-explore"
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Explore</span>
          </button>
          <button
            onClick={() => promptSignup("view your wishlist")}
            className="flex flex-col items-center py-2 px-4 text-gray-400"
            data-testid="nav-wishlists"
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Wishlists</span>
          </button>
          <button
            onClick={() => promptSignup("view your trips")}
            className="flex flex-col items-center py-2 px-4 text-gray-400"
            data-testid="nav-trips"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Trips</span>
          </button>
          <button
            onClick={() => promptSignup("view messages")}
            className="flex flex-col items-center py-2 px-4 text-gray-400"
            data-testid="nav-messages"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={() => setLocation('/guest-signup')}
            className="flex flex-col items-center py-2 px-4 text-gray-400"
            data-testid="nav-profile"
          >
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}