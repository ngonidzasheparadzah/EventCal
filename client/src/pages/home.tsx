import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/property/property-card";
import { SearchFilters, Listing } from "@/types";
import type { Listing as SchemaListing } from "@shared/schema";
import { Search, MapPin } from "lucide-react";

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

  const { data: listings = [], isLoading } = useQuery<SchemaListing[]>({
    queryKey: ["/api/listings"],
    retry: false,
  });

  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
    retry: false,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.city) params.set('city', searchFilters.city);
    if (searchFilters.checkIn) params.set('checkIn', searchFilters.checkIn);
    if (searchFilters.checkOut) params.set('checkOut', searchFilters.checkOut);
    if (searchFilters.maxGuests) params.set('maxGuests', searchFilters.maxGuests.toString());
    
    setLocation(`/search?${params.toString()}`);
  };

  const featuredListings = listings.slice(0, 8);
  const propertyTypeStats = [
    { id: "boarding_house", name: "Boarding Houses", count: listings.filter((l: SchemaListing) => l.propertyType === 'boarding_house').length },
    { id: "private_room", name: "Private Rooms", count: listings.filter((l: SchemaListing) => l.propertyType === 'private_room').length },
    { id: "lodge", name: "Lodges", count: listings.filter((l: SchemaListing) => l.propertyType === 'lodge').length },
    { id: "hotel", name: "Hotels", count: listings.filter((l: SchemaListing) => l.propertyType === 'hotel').length }
  ];

  return (
    <>
      {/* Hero Section - Completely redesigned */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100/25 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-72 w-72 rounded-full bg-gradient-to-tr from-accent/20 to-primary/20 blur-3xl" />
        
        <div className="relative responsive-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              🏠 Welcome to Zimbabwe's Premier Accommodation Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent mb-6 leading-tight">
              Find Your Perfect
              <br />
              Stay in <span className="text-primary">Zimbabwe</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-light">
              From cozy boarding houses in Harare to luxury lodges in Victoria Falls. 
              <br className="hidden md:block" />
              Discover authentic Zimbabwean hospitality at unbeatable prices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                onClick={() => setLocation('/search')}
                data-testid="button-start-exploring"
              >
                <Search className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => {
                  const featuredElement = document.getElementById('featured-listings');
                  if (featuredElement) {
                    featuredElement.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setLocation('/search');
                  }
                }}
                data-testid="button-view-featured"
              >
                View Featured Stays
              </Button>
            </div>
          </div>
          
          {/* Enhanced Search Widget */}
          <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">Where will you stay next?</h3>
                <p className="text-muted-foreground">Search thousands of verified accommodations across Zimbabwe</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    Destination
                  </label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, city: value})}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary" data-testid="select-city">
                      <SelectValue placeholder="Choose your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZIMBABWE_CITIES.map(city => (
                        <SelectItem key={city} value={city} className="text-base">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Check In</label>
                  <Input 
                    type="date" 
                    className="h-12 border-2 focus:border-primary"
                    data-testid="input-checkin"
                    onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Check Out</label>
                  <Input 
                    type="date" 
                    className="h-12 border-2 focus:border-primary"
                    data-testid="input-checkout"
                    onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Guests</label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, maxGuests: parseInt(value)})}>
                    <SelectTrigger className="h-12 border-2 focus:border-primary" data-testid="select-guests">
                      <SelectValue placeholder="How many?" />
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
                className="w-full mt-8 h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all" 
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Amazing Places
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Property Types - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="responsive-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Explore Your Perfect <span className="text-primary">Home Away From Home</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're looking for budget-friendly boarding houses or luxury safari lodges, 
              we have the perfect accommodation for every traveler and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {propertyTypeStats.map((type, index) => (
              <Card 
                key={type.id} 
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 bg-gradient-to-br from-card to-card/80"
                data-testid={`card-property-type-${type.id}`}
                onClick={() => setLocation(`/search?propertyType=${type.id}`)}
              >
                <CardContent className="p-8 text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {type.count} amazing options
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                </CardContent>
                
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8 py-6 text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => setLocation('/search')}
              data-testid="button-view-all-property-types"
            >
              View All Property Types
            </Button>
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
