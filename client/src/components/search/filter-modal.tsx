import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchFilters } from "@/types";
import { X } from "lucide-react";

const PROPERTY_TYPES = [
  { id: "boarding_house", name: "Boarding House" },
  { id: "private_room", name: "Private Room" },
  { id: "lodge", name: "Lodge" },
  { id: "hotel", name: "Hotel" },
  { id: "apartment", name: "Apartment" },
  { id: "guesthouse", name: "Guesthouse" }
];

const AMENITIES = [
  "WiFi",
  "Parking", 
  "Kitchen",
  "Security",
  "Air Conditioning",
  "Pool",
  "Gym",
  "Laundry"
];

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
}

export default function FilterModal({ isOpen, onClose, filters, onApplyFilters }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const togglePropertyType = (type: string) => {
    const currentTypes = localFilters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    updateFilter('propertyType', newTypes);
  };

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = { 
      city: localFilters.city,
      checkIn: localFilters.checkIn,
      checkOut: localFilters.checkOut,
      maxGuests: localFilters.maxGuests
    };
    setLocalFilters(clearedFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="filter-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Filters
          </DialogTitle>
          <Button 
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
            data-testid="button-close-filter-modal"
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Price range</h4>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-muted-foreground mb-2">Min price</label>
                <Input 
                  type="number" 
                  placeholder="$10" 
                  value={localFilters.minPrice || ""}
                  onChange={(e) => updateFilter('minPrice', parseFloat(e.target.value) || undefined)}
                  data-testid="input-min-price"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-muted-foreground mb-2">Max price</label>
                <Input 
                  type="number" 
                  placeholder="$100" 
                  value={localFilters.maxPrice || ""}
                  onChange={(e) => updateFilter('maxPrice', parseFloat(e.target.value) || undefined)}
                  data-testid="input-max-price"
                />
              </div>
            </div>
          </div>
          
          {/* Property Type */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Property type</h4>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map((type) => (
                <label 
                  key={type.id}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                >
                  <Checkbox 
                    checked={(localFilters.propertyType || []).includes(type.id)}
                    onCheckedChange={() => togglePropertyType(type.id)}
                    data-testid={`checkbox-property-type-${type.id}`}
                  />
                  <span className="text-foreground">{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Amenities */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Amenities</h4>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <label 
                  key={amenity}
                  className="flex items-center space-x-3"
                >
                  <Checkbox 
                    checked={(localFilters.amenities || []).includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    data-testid={`checkbox-amenity-${amenity.toLowerCase()}`}
                  />
                  <span className="text-foreground">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4 pt-6 border-t border-border">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleClearFilters}
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
          <Button 
            className="flex-1"
            onClick={handleApplyFilters}
            data-testid="button-apply-filters"
          >
            Apply filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
