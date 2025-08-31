import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Listing } from "@/types";
import { 
  Star, 
  MapPin, 
  Users, 
  Wifi, 
  Car, 
  UtensilsCrossed, 
  Shield,
  MessageCircle,
  Phone,
  X
} from "lucide-react";

interface PropertyModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onContactHost?: (method: string, data: any) => void;
}

export default function PropertyModal({ listing, isOpen, onClose, onContactHost }: PropertyModalProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");

  if (!listing) return null;

  const handleContact = (method: 'whatsapp' | 'phone' | 'sms') => {
    const contact = listing.contactMethods;
    if (method === 'whatsapp' && contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace('+', '')}?text=Hi, I'm interested in your property: ${listing.title}`, '_blank');
    } else if (method === 'phone' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    } else if (method === 'sms' && contact.phone) {
      window.location.href = `sms:${contact.phone}?body=Hi, I'm interested in your property: ${listing.title}`;
    }
    onContactHost?.(method, { listing, checkIn, checkOut, guests });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onContactHost?.('message', { listing, message, checkIn, checkOut, guests });
    setMessage("");
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': UtensilsCrossed,
    'Security': Shield,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="property-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {listing.title}
          </DialogTitle>
          <Button 
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <img 
            src={listing.images?.[0] || '/api/placeholder/800/600'} 
            alt={listing.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            {listing.images?.slice(1, 5).map((image: string, index: number) => (
              <img 
                key={index}
                src={image || '/api/placeholder/400/300'} 
                alt={`${listing.title} ${index + 2}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary">{listing.propertyType.replace('_', ' ')}</Badge>
              {listing.isVerified && (
                <Badge className="bg-success text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span className="font-medium">{listing.rating}</span>
                <span>·</span>
                <span>{listing.reviewCount} reviews</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Up to {listing.maxGuests} guests</span>
              </div>
              {listing.bedrooms && (
                <span>{listing.bedrooms} bedrooms</span>
              )}
              {listing.bathrooms && (
                <span>{listing.bathrooms} bathrooms</span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-6">{listing.description}</p>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map((amenity: string) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div key={amenity} className="flex items-center space-x-2 text-sm">
                        {IconComponent && <IconComponent className="w-4 h-4 text-muted-foreground" />}
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Booking Panel */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-foreground">${listing.pricePerNight}</span>
                    <span className="text-muted-foreground"> per night</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="font-medium text-foreground">{listing.rating}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{listing.reviewCount} reviews</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check-in</label>
                      <Input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        data-testid="input-checkin-modal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check-out</label>
                      <Input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        data-testid="input-checkout-modal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger data-testid="select-guests-modal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(listing.maxGuests)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} guest{i > 0 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Contact Options */}
                <div className="space-y-3 mb-6">
                  {listing.contactMethods?.whatsapp && (
                    <Button 
                      className="w-full bg-success text-white hover:bg-success/90"
                      onClick={() => handleContact('whatsapp')}
                      data-testid="button-contact-whatsapp-modal"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Contact via WhatsApp
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    {listing.contactMethods?.phone && (
                      <Button
                        variant="default"
                        onClick={() => handleContact('phone')}
                        data-testid="button-contact-phone-modal"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                    {listing.contactMethods?.phone && (
                      <Button
                        variant="outline"
                        onClick={() => handleContact('sms')}
                        data-testid="button-contact-sms-modal"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                    )}
                  </div>
                </div>

                {/* Send Message */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Send a message to the host..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    data-testid="textarea-message-modal"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    data-testid="button-send-message-modal"
                  >
                    Send Message
                  </Button>
                </div>

                {/* Host Info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">Host</h5>
                      <p className="text-sm text-muted-foreground">
                        {listing.isVerified ? 'Verified Host' : 'Host'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
