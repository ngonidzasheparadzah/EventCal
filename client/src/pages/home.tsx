import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import EmailVerificationBanner from "@/components/email-verification-banner";
import { PhoneVerificationBanner } from "@/components/phone-verification-banner";
import PropertyCard from "@/components/property/property-card";
import { SearchFilters, Listing } from "@/types";
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

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["/api/listings"],
    retry: false,
  });

  const { data: services = [] } = useQuery({
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
    { id: "boarding_house", name: "Boarding Houses", count: listings.filter((l: Listing) => l.propertyType === 'boarding_house').length },
    { id: "private_room", name: "Private Rooms", count: listings.filter((l: Listing) => l.propertyType === 'private_room').length },
    { id: "lodge", name: "Lodges", count: listings.filter((l: Listing) => l.propertyType === 'lodge').length },
    { id: "hotel", name: "Hotels", count: listings.filter((l: Listing) => l.propertyType === 'hotel').length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmailVerificationBanner />
      <PhoneVerificationBanner />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome back! Find your next stay in <span className="text-primary">Zimbabwe</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique accommodations from boarding houses to luxury lodges across all major cities.
          </p>
          
          {/* Search Widget */}
          <Card className="floating-search max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">Where</label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, city: value})}>
                    <SelectTrigger data-testid="select-city">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZIMBABWE_CITIES.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Check in</label>
                  <Input 
                    type="date" 
                    data-testid="input-checkin"
                    onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Check out</label>
                  <Input 
                    type="date" 
                    data-testid="input-checkout"
                    onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                  <Select onValueChange={(value) => setSearchFilters({...searchFilters, maxGuests: parseInt(value)})}>
                    <SelectTrigger data-testid="select-guests">
                      <SelectValue placeholder="1 guest" />
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
                className="w-full mt-6" 
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by property type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {propertyTypeStats.map((type) => (
              <Card 
                key={type.id} 
                className="property-card cursor-pointer hover:border-primary transition-all" 
                data-testid={`card-property-type-${type.id}`}
                onClick={() => setLocation(`/search?propertyType=${type.id}`)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.count} available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Featured stays</h2>
            <Button 
              variant="ghost" 
              className="text-primary font-medium hover:underline"
              onClick={() => setLocation('/search')}
              data-testid="button-view-all"
            >
              View all
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.map((listing: Listing) => (
                <PropertyCard 
                  key={listing.id} 
                  listing={listing} 
                  onClick={() => setLocation(`/property/${listing.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Discover local services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">From cleaning services to guided tours, find trusted local providers for all your needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service: any) => (
              <Card key={service.id} className="property-card cursor-pointer" data-testid={`card-service-${service.id}`}>
                <img 
                  src={service.images?.[0] || '/api/placeholder/600/300'} 
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <span className="text-sm font-medium text-primary">From ${service.price}/{service.priceType.replace('_', ' ')}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Start hosting on RooMe
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Earn extra income by sharing your space with travelers and locals looking for accommodation.
          </p>
          <Button 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setLocation('/host/dashboard')}
            data-testid="button-start-hosting"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Go to Host Dashboard
          </Button>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
