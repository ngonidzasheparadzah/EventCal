import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PropertyCard from "@/components/property/property-card";
import { SearchFilters, Listing } from "@/types";
import type { Listing as SchemaListing } from "@shared/schema";
import { Search, MapPin, Clock, Star, TrendingUp, Heart, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const ZIMBABWE_CITIES = [
  "Harare",
  "Bulawayo", 
  "Gweru",
  "Mutare",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Marondera",
  "Hwange"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const { user, isAuthenticated } = useAuth();

  const { data: listings = [], isLoading } = useQuery<SchemaListing[]>({
    queryKey: ["/api/listings"],
    retry: false,
  });

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  // Get user's initials for avatar
  const getUserInitials = (firstName?: string | null, lastName?: string | null) => {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    return initials || 'U';
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.city) params.set('city', searchFilters.city);
    if (searchFilters.checkIn) params.set('checkIn', searchFilters.checkIn);
    if (searchFilters.checkOut) params.set('checkOut', searchFilters.checkOut);
    if (searchFilters.maxGuests) params.set('maxGuests', searchFilters.maxGuests.toString());
    
    setLocation(`/search?${params.toString()}`);
  };

  const featuredListings = listings.slice(0, 8);
  const recentlyViewedListings = listings.slice(0, 4); // Mock recently viewed - will be enhanced later
  const recommendedListings = listings.slice(4, 8); // Mock recommendations - will be enhanced later
  
  const propertyTypeStats = [
    { id: "boarding_house", name: "Boarding Houses", count: listings.filter((l: SchemaListing) => l.propertyType === 'boarding_house').length, description: "Budget-friendly shared accommodations" },
    { id: "private_room", name: "Private Rooms", count: listings.filter((l: SchemaListing) => l.propertyType === 'private_room').length, description: "Your own space with privacy" },
    { id: "lodge", name: "Lodges", count: listings.filter((l: SchemaListing) => l.propertyType === 'lodge').length, description: "Comfortable mid-range stays" },
    { id: "hotel", name: "Hotels", count: listings.filter((l: SchemaListing) => l.propertyType === 'hotel').length, description: "Full-service accommodations" }
  ];

  return (
    <>
      {/* Personalized Guest Dashboard */}
      <section className="bg-background py-6 md:py-8">
        <div className="responsive-container">
          {/* Personalized Greeting */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12 md:w-16 md:h-16">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {getUserInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="greeting-title">
                  Hi, {user?.firstName || 'Guest'}! 👋
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Ready to find your perfect stay in Zimbabwe?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Search Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-6">
        <div className="responsive-container">
          <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Continue your search</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation('/search')}
                  data-testid="button-continue-search-all"
                >
                  View all <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    Where to?
                  </label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, city: value})}>
                    <SelectTrigger className="h-10 border focus:border-primary" data-testid="select-city-continue">
                      <SelectValue placeholder="Choose destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZIMBABWE_CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Check in</label>
                  <Input 
                    type="date" 
                    className="h-10 border focus:border-primary"
                    data-testid="input-checkin-continue"
                    onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Check out</label>
                  <Input 
                    type="date" 
                    className="h-10 border focus:border-primary"
                    data-testid="input-checkout-continue"
                    onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Guests</label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, maxGuests: parseInt(value)})}>
                    <SelectTrigger className="h-10 border focus:border-primary" data-testid="select-guests-continue">
                      <SelectValue placeholder="Add guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 guest</SelectItem>
                      <SelectItem value="2">2 guests</SelectItem>
                      <SelectItem value="3">3 guests</SelectItem>
                      <SelectItem value="4">4+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground" 
                onClick={handleSearch}
                data-testid="button-continue-search"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recently Viewed Homes */}
      {recentlyViewedListings.length > 0 && (
        <section className="py-8 bg-background">
          <div className="responsive-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Recently Viewed</h2>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/search')}
                data-testid="button-view-all-recent"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewedListings.map((listing: SchemaListing) => (
                <PropertyCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => setLocation(`/property/${listing.id}`)}
                  showWishlistButton={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended for You */}
      {recommendedListings.length > 0 && (
        <section className="py-8 bg-secondary/30">
          <div className="responsive-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/search')}
                data-testid="button-view-all-recommended"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedListings.map((listing: SchemaListing) => (
                <PropertyCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => setLocation(`/property/${listing.id}`)}
                  showWishlistButton={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="py-12 bg-background">
        <div className="responsive-container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Browse by category</h2>
            <p className="text-muted-foreground">
              Find the perfect accommodation type for your needs and budget
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {propertyTypeStats.map((type) => (
              <Card 
                key={type.id} 
                className="group cursor-pointer border hover:border-primary transition-all duration-300 hover:shadow-md"
                data-testid={`card-category-${type.id}`}
                onClick={() => setLocation(`/search?propertyType=${type.id}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <MapPin className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {type.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{type.count} available</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 bg-secondary/30">
        <div className="responsive-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Popular destinations</h2>
              <p className="text-muted-foreground">Discover Zimbabwe's most visited cities</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/search')}
              data-testid="button-view-all-destinations"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Harare", "Bulawayo", "Victoria Falls", "Mutare"].map((city) => (
              <Card 
                key={city}
                className="group cursor-pointer border hover:border-primary transition-all duration-300 hover:shadow-md"
                data-testid={`card-city-${city.toLowerCase()}`}
                onClick={() => setLocation(`/search?city=${city}`)}
              >
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{city}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listings.filter(l => l.city.toLowerCase().includes(city.toLowerCase())).length} properties
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings - Enhanced */}
      <section id="featured-listings" className="py-20 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        
        <div className="responsive-container relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
                ⭐ Hand-picked by our team
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Discover <span className="text-primary">Featured Stays</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Carefully selected accommodations that offer exceptional value, 
                stunning locations, and unforgettable experiences.
              </p>
            </div>
            
            <Button 
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
              onClick={() => setLocation('/search')}
              data-testid="button-view-all"
            >
              Explore All Stays
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <div className="h-64 bg-gradient-to-br from-muted to-muted/60 rounded-t-xl"></div>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-gradient-to-r from-muted to-muted/60 rounded-full"></div>
                    <div className="h-4 bg-gradient-to-r from-muted to-muted/60 rounded-full w-3/4"></div>
                    <div className="h-6 bg-gradient-to-r from-muted to-muted/60 rounded-full w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredListings.map((listing: SchemaListing) => (
                <PropertyCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => setLocation(`/property/${listing.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No listings yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We're working hard to bring you amazing accommodations. 
                Check back soon or become our first host!
              </p>
              <Button 
                size="lg"
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent"
                onClick={() => setLocation('/host/dashboard')}
              >
                Become a Host
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-secondary/50 to-secondary/20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-primary/5" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
        
        <div className="responsive-container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-6">
              🛎️ Beyond Accommodation
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Discover <span className="text-accent">Local Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From airport transfers and cleaning services to guided tours and local experiences. 
              Find trusted providers to make your stay perfect.
            </p>
          </div>
          
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service: any) => (
                <Card 
                  key={service.id} 
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 bg-card/80 backdrop-blur-sm overflow-hidden" 
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.images?.[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDYwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0yODUgMTYwVjE0MEgyOTBWMTYwSDI4NVpNMzA1IDE2MFYxNDBIMzEwVjE2MEgzMDVaIiBmaWxsPSIjOTlBM0FFIi8+CjwvZz4K'} 
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDYwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjFGNUY5Ii8+CjxwYXRoIGQ9Ik0yODUgMTYwVjE0MEgyOTBWMTYwSDI4NVpNMzA1IDE2MFYxNDBIMzEwVjE2MEgzMDVaIiBmaWxsPSIjOTlBM0FFIi8+CjwvZz4K';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-accent">
                        {service.price ? `From $${service.price}` : 'Price available'}{
                          service.priceType ? `/${service.priceType.replace('_', ' ')}` : ''
                        }
                      </span>
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                        →
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Search className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Services Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're partnering with local service providers to bring you amazing experiences and convenience services.
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 text-lg border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all"
              onClick={() => setLocation('/marketplace')}
            >
              Browse All Services
            </Button>
          </div>
        </div>
      </section>

      {/* Host Section - Completely redesigned */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.4))]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="responsive-container relative text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-primary-foreground/90 mb-8 backdrop-blur-sm">
              💰 Earn Extra Income
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight">
              Turn Your Space Into
              <br />
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent">
                Extra Income
              </span>
            </h2>
            
            <p className="text-2xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Join hundreds of Zimbabwean hosts who are earning money by sharing their spaces 
              with travelers, students, and professionals looking for quality accommodation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-8 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
                onClick={() => setLocation('/host/dashboard')}
                data-testid="button-start-hosting"
              >
                <MapPin className="w-6 h-6 mr-3" />
                Start Hosting Today
              </Button>
              
              <Button 
                variant="outline"
                size="lg" 
                className="border-2 border-white/30 text-primary-foreground hover:bg-white/10 backdrop-blur-sm rounded-full px-10 py-8 text-xl font-medium transition-all"
                onClick={() => setLocation('/about')}
              >
                Learn How It Works
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">$500+</div>
                <div className="text-primary-foreground/80">Average monthly earnings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-primary-foreground/80">Host support available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-primary-foreground/80">Host satisfaction rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
