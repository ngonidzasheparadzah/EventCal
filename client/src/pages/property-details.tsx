import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Listing, Review } from "@/types";
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
  ArrowLeft,
  Heart,
  Share2
} from "lucide-react";

export default function PropertyDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");

  const { data: listing, isLoading } = useQuery({
    queryKey: ["/api/listings", id],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/listings", id, "reviews"],
    enabled: !!id,
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ["/api/wishlist"],
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Added to wishlist!" });
    },
    onError: () => {
      toast({ title: "Failed to add to wishlist", variant: "destructive" });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({ title: "Removed from wishlist" });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      await apiRequest("POST", "/api/messages", messageData);
    },
    onSuccess: () => {
      toast({ title: "Message sent!" });
      setMessage("");
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
            <div className="h-96 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-6"></div>
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property not found</h1>
          <Button onClick={() => setLocation('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.includes(id);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : listing.rating;

  const handleContact = (method: 'whatsapp' | 'phone' | 'sms') => {
    const contact = listing.contactMethods;
    if (method === 'whatsapp' && contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp.replace('+', '')}?text=Hi, I'm interested in your property: ${listing.title}`, '_blank');
    } else if (method === 'phone' && contact.phone) {
      window.location.href = `tel:${contact.phone}`;
    } else if (method === 'sms' && contact.phone) {
      window.location.href = `sms:${contact.phone}?body=Hi, I'm interested in your property: ${listing.title}`;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const conversationId = `${listing.hostId}-${id}`;
    sendMessageMutation.mutate({
      conversationId,
      receiverId: listing.hostId,
      listingId: id,
      content: message,
    });
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': UtensilsCrossed,
    'Security': Shield,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => window.history.back()}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Title and Actions */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{listing.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent fill-current" />
                <span className="font-medium">{averageRating}</span>
                <span>·</span>
                <span>{reviews.length} reviews</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => isInWishlist ? removeFromWishlistMutation.mutate() : addToWishlistMutation.mutate()}
              data-testid="button-wishlist"
            >
              <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current text-destructive' : ''}`} />
              Save
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img 
            src={listing.images?.[0] || '/api/placeholder/800/600'} 
            alt={listing.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            {listing.images?.slice(1, 5).map((image: string, index: number) => (
              <img 
                key={index}
                src={image || '/api/placeholder/400/300'} 
                alt={`${listing.title} ${index + 2}`}
                className="w-full h-32 md:h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{listing.propertyType.replace('_', ' ')}</Badge>
                {listing.isVerified && (
                  <Badge className="bg-success text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Up to {listing.maxGuests} guests</span>
                </div>
                {listing.bedrooms && (
                  <span className="text-sm text-muted-foreground">{listing.bedrooms} bedrooms</span>
                )}
                {listing.bathrooms && (
                  <span className="text-sm text-muted-foreground">{listing.bathrooms} bathrooms</span>
                )}
              </div>
              
              <p className="text-muted-foreground mb-6">{listing.description}</p>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

            {/* Reviews */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">
                Reviews ({reviews.length})
              </h3>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review: Review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-accent fill-current' : 'text-muted'}`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-foreground">${listing.pricePerNight}</span>
                    <span className="text-muted-foreground"> per night</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-accent fill-current" />
                    <span className="font-medium text-foreground">{averageRating}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{reviews.length} reviews</span>
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
                        data-testid="input-checkin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Check-out</label>
                      <Input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        data-testid="input-checkout"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger data-testid="select-guests">
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
                      data-testid="button-contact-whatsapp"
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
                        data-testid="button-contact-phone"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                    {listing.contactMethods?.phone && (
                      <Button
                        variant="outline"
                        onClick={() => handleContact('sms')}
                        data-testid="button-contact-sms"
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
                    data-testid="textarea-message"
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    data-testid="button-send-message"
                  >
                    {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
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
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
