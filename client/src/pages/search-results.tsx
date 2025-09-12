import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Heart, Star, ChevronRight, Search } from "lucide-react";
import type { Listing } from "@shared/schema";

// Property Card Component
interface PropertyCardProps {
  listing: Listing;
  onClick: () => void;
}

function PropertyCard({ listing, onClick }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'boarding_house': return 'Boarding House';
      case 'lodge': return 'Lodge';
      case 'hotel': return 'Hotel';
      case 'apartment': return 'Apartment';
      case 'guesthouse': return 'Guesthouse';
      case 'private_room': return 'To Let';
      default: return 'Property';
    }
  };

  return (
    <div 
      className="min-w-[280px] cursor-pointer group mr-4"
      onClick={onClick}
      data-testid={`property-card-${listing.id}`}
    >
      <div className="relative">
        {/* Property Image */}
        <div className="relative h-[280px] rounded-xl overflow-hidden mb-3">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image Available</span>
          </div>
          
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white text-[#2C2C2C] text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              {getPropertyTypeLabel(listing.propertyType)}
            </span>
          </div>
          
          {/* Like Button */}
          <button
            className="absolute top-3 right-3 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            data-testid={`button-like-${listing.id}`}
          >
            <Heart 
              className={`w-6 h-6 ${isLiked ? 'fill-[#0390D7] text-[#0390D7]' : 'text-white fill-black/20'}`}
            />
          </button>
        </div>
        
        {/* Property Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#2C2C2C] text-sm truncate" data-testid={`text-title-${listing.id}`}>
              {listing.title}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              <Star className="w-4 h-4 fill-current text-[#2C2C2C]" />
              <span className="text-sm font-medium text-[#2C2C2C]">
                4.5
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
            {listing.city && `${listing.city}, `}Zimbabwe
          </p>
          
          <div className="flex items-baseline space-x-1">
            <span className="font-semibold text-[#2C2C2C]" data-testid={`text-price-${listing.id}`}>
              {formatPrice(listing.pricePerNight)}
            </span>
            <span className="text-gray-600 text-sm">night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Property Section Component
interface PropertySectionProps {
  title: string;
  properties: Listing[];
  onPropertyClick: (id: string) => void;
  isLoading?: boolean;
}

function PropertySection({ title, properties, onPropertyClick, isLoading }: PropertySectionProps) {
  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#2C2C2C]">{title}</h2>
          <ChevronRight className="w-6 h-6 text-[#2C2C2C]" />
        </div>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[280px] animate-pulse">
              <div className="h-[280px] bg-gray-200 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[#2C2C2C]">{title}</h2>
        <button className="flex items-center text-[#2C2C2C] hover:text-[#0390D7] transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      <div 
        className="flex overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            listing={property}
            onClick={() => onPropertyClick(property.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/listings/search'],
    retry: false,
  });

  const handlePropertyClick = (propertyId: string) => {
    setLocation(`/property/${propertyId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  // Categorize properties for different sections
  const popularHomes = listings
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const availableThisWeekend = listings
    .filter(listing => listing.propertyType === 'hotel' || listing.propertyType === 'lodge')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for places to stay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-[#2C2C2C] bg-white rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0390D7] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                data-testid="search-input"
              />
            </div>
          </form>
        </div>
        {/* Popular Homes Section */}
        <PropertySection
          title="Popular homes in Harare"
          properties={popularHomes}
          onPropertyClick={handlePropertyClick}
          isLoading={isLoading}
        />

        {/* Available This Weekend Section */}
        <PropertySection
          title="Available in Bulawayo this weekend"
          properties={availableThisWeekend}
          onPropertyClick={handlePropertyClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}