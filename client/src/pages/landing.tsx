import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { SearchFilters } from "@/types";
import { Search, MapPin, Star, Shield, MessageCircle, Phone } from "lucide-react";

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

const PROPERTY_TYPES = [
  { id: "boarding_house", name: "Boarding Houses", price: "$15", image: "/api/placeholder/400/200" },
  { id: "private_room", name: "Private Rooms", price: "$25", image: "/api/placeholder/400/200" },
  { id: "lodge", name: "Lodges", price: "$80", image: "/api/placeholder/400/200" },
  { id: "hotel", name: "Hotels", price: "$45", image: "/api/placeholder/400/200" }
];

const FEATURED_LISTINGS = [
  {
    id: "1",
    title: "Cozy room in Borrowdale with garden view",
    location: "Borrowdale, Harare",
    type: "Private room",
    price: "$28",
    rating: "4.8",
    verified: true,
    superhost: false,
    image: "/api/placeholder/600/400",
    description: "Modern furnished room with private bathroom, WiFi, and access to shared kitchen.",
    contact: { whatsapp: "+263771234567", phone: "+263771234567" }
  },
  {
    id: "2", 
    title: "Traditional lodge near Matobo Hills",
    location: "Bulawayo",
    type: "Entire lodge",
    price: "$65",
    rating: "4.9",
    verified: false,
    superhost: true,
    image: "/api/placeholder/600/400",
    description: "Authentic experience with stunning views, traditional meals included.",
    contact: { whatsapp: "+263771234568", phone: "+263771234568" }
  },
  {
    id: "3",
    title: "Modern apartment in city center",
    location: "Gweru",
    type: "Entire apartment",
    price: "$42",
    rating: "4.6",
    verified: false,
    superhost: false,
    image: "/api/placeholder/600/400",
    description: "Fully furnished 2-bedroom apartment with parking and security.",
    contact: { whatsapp: "+263771234569", phone: "+263771234569" }
  },
  {
    id: "4",
    title: "Garden guesthouse near Eastern Highlands",
    location: "Mutare",
    type: "Guesthouse",
    price: "$35",
    rating: "4.7",
    verified: false,
    superhost: false,
    image: "/api/placeholder/600/400",
    description: "Peaceful retreat with mountain views and home-cooked meals.",
    contact: { whatsapp: "+263771234570", phone: "+263771234570" }
  },
  {
    id: "5",
    title: "Student-friendly boarding house",
    location: "Harare",
    type: "Boarding house",
    price: "$18",
    rating: "4.5",
    verified: false,
    superhost: false,
    greatValue: true,
    image: "/api/placeholder/600/400",
    description: "Clean, affordable accommodation near university with shared facilities.",
    contact: { whatsapp: "+263771234571", phone: "+263771234571" }
  }
];

const SERVICES = [
  {
    id: "1",
    title: "Cleaning Services",
    description: "Professional cleaning for homes and offices",
    price: "From $20/service",
    image: "/api/placeholder/600/300"
  },
  {
    id: "2", 
    title: "Moving Services",
    description: "Reliable movers for your relocation needs",
    price: "From $50/day",
    image: "/api/placeholder/600/300"
  },
  {
    id: "3",
    title: "Guided Tours", 
    description: "Explore Zimbabwe with local experts",
    price: "From $30/tour",
    image: "/api/placeholder/600/300"
  }
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.city) params.set('city', searchFilters.city);
    if (searchFilters.checkIn) params.set('checkIn', searchFilters.checkIn);
    if (searchFilters.checkOut) params.set('checkOut', searchFilters.checkOut);
    if (searchFilters.maxGuests) params.set('maxGuests', searchFilters.maxGuests.toString());
    
    setLocation(`/search?${params.toString()}`);
  };

  const handleContact = (method: 'whatsapp' | 'phone', contact: any) => {
    if (method === 'whatsapp') {
      window.open(`https://wa.me/${contact.whatsapp?.replace('+', '')}?text=Hi, I'm interested in your property listing on RooMe`, '_blank');
    } else {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Find amazing places to stay in <span className="text-primary">Zimbabwe</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique accommodations from boarding houses to luxury lodges across Harare, Bulawayo, and beyond.
          </p>
          
          {/* Demo Button */}
          <div className="mb-8">
            <Button 
              onClick={() => setLocation('/onboarding')}
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-primary hover:bg-white hover:text-primary-foreground transition-all duration-200"
              data-testid="button-onboarding-demo"
            >
              🚀 Try Our Onboarding Experience
            </Button>
          </div>
          
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
            {PROPERTY_TYPES.map((type) => (
              <Card key={type.id} className="property-card cursor-pointer hover:border-primary transition-all" data-testid={`card-property-type-${type.id}`}>
                <CardContent className="p-4">
                  <img 
                    src={type.image} 
                    alt={type.name}
                    className="w-full h-24 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-foreground">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">{type.price}/night</p>
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
            <Button variant="ghost" className="text-primary font-medium hover:underline">
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_LISTINGS.map((listing) => (
              <Card key={listing.id} className="property-card cursor-pointer" data-testid={`card-listing-${listing.id}`}>
                <div className="relative">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full bg-card/80 hover:bg-card"
                  >
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </Button>
                  {listing.verified && (
                    <Badge className="absolute top-3 left-3 bg-success text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {listing.superhost && (
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      Superhost
                    </Badge>
                  )}
                  {listing.greatValue && (
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      Great Value
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{listing.type} • {listing.location}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="text-sm font-medium text-foreground">{listing.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-foreground">{listing.price}</span>
                      <span className="text-sm text-muted-foreground"> per night</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContact('whatsapp', listing.contact);
                        }}
                        data-testid={`button-whatsapp-${listing.id}`}
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-success" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContact('phone', listing.contact);
                        }}
                        data-testid={`button-call-${listing.id}`}
                        title="Call"
                      >
                        <Phone className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            {SERVICES.map((service) => (
              <Card key={service.id} className="property-card cursor-pointer" data-testid={`card-service-${service.id}`}>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <span className="text-sm font-medium text-primary">{service.price}</span>
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
            onClick={() => setLocation('/api/login')}
            data-testid="button-start-hosting"
          >
            <MapPin className="w-5 h-5 mr-2" />
            List your property
          </Button>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
