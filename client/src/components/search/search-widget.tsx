import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchFilters } from "@/types";
import { Search } from "lucide-react";

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

interface SearchWidgetProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  className?: string;
}

export default function SearchWidget({ onSearch, initialFilters = {}, className = "" }: SearchWidgetProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const handleSearch = () => {
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={`floating-search ${className}`}>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">Where</label>
            <Select 
              value={filters.city || ""} 
              onValueChange={(value) => updateFilter('city', value)}
            >
              <SelectTrigger data-testid="search-select-city">
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
              value={filters.checkIn || ""}
              onChange={(e) => updateFilter('checkIn', e.target.value)}
              data-testid="search-input-checkin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Check out</label>
            <Input 
              type="date" 
              value={filters.checkOut || ""}
              onChange={(e) => updateFilter('checkOut', e.target.value)}
              data-testid="search-input-checkout"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
            <Select 
              value={filters.maxGuests?.toString() || ""} 
              onValueChange={(value) => updateFilter('maxGuests', parseInt(value))}
            >
              <SelectTrigger data-testid="search-select-guests">
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
          data-testid="search-button-submit"
        >
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
