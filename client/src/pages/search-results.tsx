import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/property/property-card";
import SearchWidget from "@/components/search/search-widget";
import FilterModal from "@/components/search/filter-modal";
import { SearchFilters } from "@/types";
import type { Listing } from "@shared/schema";
import { Filter, MapPin, SlidersHorizontal } from "lucide-react";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters: SearchFilters = {};
    
    if (params.get('city')) initialFilters.city = params.get('city')!;
    if (params.get('propertyType')) {
      const types = params.get('propertyType')!.split(',');
      initialFilters.propertyType = types;
    }
    if (params.get('minPrice')) initialFilters.minPrice = parseFloat(params.get('minPrice')!);
    if (params.get('maxPrice')) initialFilters.maxPrice = parseFloat(params.get('maxPrice')!);
    if (params.get('maxGuests')) initialFilters.maxGuests = parseInt(params.get('maxGuests')!);
    if (params.get('checkIn')) initialFilters.checkIn = params.get('checkIn')!;
    if (params.get('checkOut')) initialFilters.checkOut = params.get('checkOut')!;
    
    setFilters(initialFilters);
  }, []);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.propertyType && filters.propertyType.length > 0) {
      params.set('propertyType', filters.propertyType.join(','));
    }
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.maxGuests) params.set('maxGuests', filters.maxGuests.toString());
    return params.toString();
  };

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: [`/api/listings/search?${buildQueryParams()}`],
    retry: false,
  });

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.propertyType && newFilters.propertyType.length > 0) {
      params.set('propertyType', newFilters.propertyType.join(','));
    }
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.maxGuests) params.set('maxGuests', newFilters.maxGuests.toString());
    if (newFilters.checkIn) params.set('checkIn', newFilters.checkIn);
    if (newFilters.checkOut) params.set('checkOut', newFilters.checkOut);
    
    setLocation(`/search?${params.toString()}`);
  };

  const handleApplyFilters = (newFilters: SearchFilters) => {
    handleSearch(newFilters);
  };

  const clearFilters = () => {
    const basicFilters = {
      city: filters.city,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      maxGuests: filters.maxGuests
    };
    setFilters(basicFilters);
    setLocation('/search');
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.propertyType && filters.propertyType.length > 0) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.amenities && filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Widget */}
        <SearchWidget 
          onSearch={handleSearch}
          initialFilters={filters}
          className="mb-8"
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {filters.city ? `Stays in ${filters.city}` : 'Search Results'}
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Searching...' : `${listings.length} properties found`}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(true)}
              data-testid="button-show-filters"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount() > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {activeFilterCount()}
                </Badge>
              )}
            </Button>
            
            {activeFilterCount() > 0 && (
              <Button 
                variant="ghost"
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(filters.propertyType?.length || filters.minPrice || filters.maxPrice) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.propertyType?.map(type => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type.replace('_', ' ')}
              </Badge>
            ))}
            {filters.minPrice && (
              <Badge variant="secondary" className="text-xs">
                Min: ${filters.minPrice}
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="text-xs">
                Max: ${filters.maxPrice}
              </Badge>
            )}
          </div>
        )}

        {/* Results Grid */}
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
        ) : listings.length === 0 ? (
          <Card className="p-8 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or removing some filters
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => handleSearch({})}
                data-testid="button-view-all"
              >
                View all properties
              </Button>
              <Button 
                onClick={() => setShowFilters(true)}
                data-testid="button-adjust-filters"
              >
                Adjust filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <PropertyCard 
                key={listing.id} 
                listing={listing}
                onClick={() => setLocation(`/property/${listing.id}`)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {listings.length > 0 && listings.length % 12 === 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

    </>
  );
}
