import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { SearchFilters } from "@/types";
import type { Listing } from "@shared/schema";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

// Property Card Component
interface PropertyCardProps {
  listing: Listing;
  onClick: () => void;
}

function DashboardPropertyCard({ listing, onClick }: PropertyCardProps) {
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
      className="min-w-[280px] cursor-pointer group"
      onClick={onClick}
      data-testid={`property-card-${listing.id}`}
    >
      <div className="relative">
        {/* Property Image */}
        <div className="relative h-[200px] rounded-xl overflow-hidden mb-3">
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image Available</span>
          </div>
          
          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white text-[#2C2C2C] text-xs font-medium px-2 py-1 rounded-md shadow-sm">
              {getPropertyTypeLabel(listing.propertyType)}
            </span>
          </div>
          
          {/* Like Button */}
          <button
            className="absolute top-3 right-3 p-1"
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
              <Star className="w-3 h-3 fill-current text-[#2C2C2C]" />
              <span className="text-xs font-medium text-[#2C2C2C]">
                4.5
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-xs">
            {listing.city && `${listing.city}, `}Zimbabwe
          </p>
          
          <div className="flex items-baseline space-x-1">
            <span className="font-semibold text-[#2C2C2C]" data-testid={`text-price-${listing.id}`}>
              {formatPrice(listing.pricePerNight)}
            </span>
            <span className="text-gray-600 text-xs">night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Horizontal Scrolling Section Component
interface PropertySectionProps {
  title: string;
  properties: Listing[];
  onPropertyClick: (id: string) => void;
  isLoading?: boolean;
}

function PropertySection({ title, properties, onPropertyClick, isLoading }: PropertySectionProps) {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer) {
      const scrollAmount = 300;
      scrollContainer.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-[#2C2C2C] mb-6">{title}</h2>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[280px] animate-pulse">
              <div className="h-[200px] bg-gray-100 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
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
        <h2 className="text-xl font-semibold text-[#2C2C2C]">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-200 hover:bg-[#0390D7] hover:border-[#0390D7] hover:text-white transition-colors"
            data-testid={`button-scroll-left-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-200 hover:bg-[#0390D7] hover:border-[#0390D7] hover:text-white transition-colors"
            data-testid={`button-scroll-right-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div 
        ref={setScrollContainer}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {properties.map((property) => (
          <DashboardPropertyCard
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
  const [filters, setFilters] = useState<SearchFilters>({});

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/listings/search'],
    retry: false,
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    // For now, keep search simple - we can enhance this later
  };

  const handlePropertyClick = (propertyId: string) => {
    setLocation(`/property/${propertyId}`);
  };

  // Categorize properties
  const topPicks = listings
    .slice()
    .sort(() => Math.random() - 0.5) // Random for demo
    .slice(0, 8);

  const recommended = listings
    .filter(listing => listing.propertyType === 'boarding_house' || listing.propertyType === 'private_room')
    .slice(0, 8);

  const featured = listings
    .filter(listing => listing.propertyType === 'hotel' || listing.propertyType === 'lodge')
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-[#2C2C2C] mb-2">
            Welcome to <span className="text-[#0390D7]">RooMe</span>
          </h1>
          <p className="text-gray-600">
            Discover amazing places to stay across Zimbabwe
          </p>
        </div>

        {/* Property Sections */}
        <PropertySection
          title="Top Picks"
          properties={topPicks}
          onPropertyClick={handlePropertyClick}
          isLoading={isLoading}
        />

        <PropertySection
          title="Recommended for You"
          properties={recommended}
          onPropertyClick={handlePropertyClick}
          isLoading={isLoading}
        />

        <PropertySection
          title="Featured Properties"
          properties={featured}
          onPropertyClick={handlePropertyClick}
          isLoading={isLoading}
        />

        {/* Show all properties when no specific filters are applied */}
        {!isLoading && listings.length > 0 && (
          <PropertySection
            title="All Properties"
            properties={listings}
            onPropertyClick={handlePropertyClick}
            isLoading={isLoading}
          />
        )}

        {/* Empty state when no properties */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-[#2C2C2C] mb-4">
              No properties available yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working hard to bring you amazing accommodations across Zimbabwe. 
              Check back soon for new listings!
            </p>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}