import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Listing } from "@/types";
import { Star, Shield, Heart, MessageCircle, Phone } from "lucide-react";

interface PropertyCardProps {
  listing: Listing;
  onClick?: () => void;
  showWishlistButton?: boolean;
  isInWishlist?: boolean;
  onWishlistToggle?: () => void;
}

export default function PropertyCard({ 
  listing, 
  onClick, 
  showWishlistButton = true,
  isInWishlist = false,
  onWishlistToggle 
}: PropertyCardProps) {
  
  const handleContact = (method: 'whatsapp' | 'phone', e: React.MouseEvent) => {
    e.stopPropagation();
    const contact = listing.contactMethods;
    if (method === 'whatsapp' && contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace('+', '')}?text=Hi, I'm interested in your property: ${listing.title}`, '_blank');
    } else if (method === 'phone' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle?.();
  };

  return (
    <Card 
      className="property-card cursor-pointer" 
      onClick={onClick}
      data-testid={`card-listing-${listing.id}`}
    >
      <div className="relative">
        <img 
          src={listing.images?.[0] || '/api/placeholder/600/400'} 
          alt={listing.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {showWishlistButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-card/80 hover:bg-card"
            onClick={handleWishlistClick}
            data-testid={`button-wishlist-${listing.id}`}
          >
            <Heart 
              className={`w-5 h-5 ${isInWishlist ? 'fill-current text-destructive' : 'text-muted-foreground'}`}
            />
          </Button>
        )}
        {listing.isVerified && (
          <Badge className="absolute top-3 left-3 bg-success text-white">
            <Shield className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
        {listing.tags?.includes('superhost') && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Superhost
          </Badge>
        )}
        {listing.tags?.includes('great_value') && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Great Value
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {listing.propertyType.replace('_', ' ')} • {listing.city}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-accent fill-current" />
            <span className="text-sm font-medium text-foreground">{listing.rating}</span>
          </div>
        </div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{listing.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-foreground">${listing.pricePerNight}</span>
            <span className="text-sm text-muted-foreground"> per night</span>
          </div>
          <div className="flex space-x-2">
            {listing.contactMethods?.whatsapp && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleContact('whatsapp', e)}
                data-testid={`button-whatsapp-${listing.id}`}
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-success" />
              </Button>
            )}
            {listing.contactMethods?.phone && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleContact('phone', e)}
                data-testid={`button-call-${listing.id}`}
                title="Call"
              >
                <Phone className="w-4 h-4 text-primary" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
