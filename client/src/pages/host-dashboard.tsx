import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";
import { Listing } from "@/types";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  MessageCircle,
  TrendingUp,
  Users,
  Home
} from "lucide-react";

const PROPERTY_TYPES = [
  { value: "boarding_house", label: "Boarding House" },
  { value: "private_room", label: "Private Room" },
  { value: "lodge", label: "Lodge" },
  { value: "hotel", label: "Hotel" },
  { value: "apartment", label: "Apartment" },
  { value: "guesthouse", label: "Guesthouse" }
];

const ZIMBABWE_CITIES = [
  "Harare", "Bulawayo", "Gweru", "Mutare", "Kwekwe", "Kadoma", 
  "Masvingo", "Chinhoyi", "Marondera", "Hwange"
];

export default function HostDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    propertyType: "",
    pricePerNight: "",
    location: "",
    city: "",
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [] as string[],
    contactMethods: {
      phone: "",
      whatsapp: "",
      email: ""
    }
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["/api/host/listings"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings", "host"],
    enabled: isAuthenticated,
    retry: false,
  });

  const createListingMutation = useMutation({
    mutationFn: async (listingData: any) => {
      await apiRequest("POST", "/api/listings", listingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/host/listings"] });
      toast({ title: "Listing created successfully!" });
      setIsCreating(false);
      setNewListing({
        title: "",
        description: "",
        propertyType: "",
        pricePerNight: "",
        location: "",
        city: "",
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        contactMethods: { phone: "", whatsapp: "", email: "" }
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Failed to create listing", variant: "destructive" });
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await apiRequest("PUT", `/api/listings/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/host/listings"] });
      toast({ title: "Listing updated successfully!" });
      setEditingListing(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Failed to update listing", variant: "destructive" });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/host/listings"] });
      toast({ title: "Listing deleted successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Failed to delete listing", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleCreateListing = () => {
    if (!newListing.title || !newListing.description || !newListing.propertyType || 
        !newListing.pricePerNight || !newListing.city) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createListingMutation.mutate({
      ...newListing,
      pricePerNight: parseFloat(newListing.pricePerNight)
    });
  };

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setNewListing({
      title: listing.title,
      description: listing.description,
      propertyType: listing.propertyType,
      pricePerNight: listing.pricePerNight,
      location: listing.location,
      city: listing.city,
      maxGuests: listing.maxGuests,
      bedrooms: listing.bedrooms || 1,
      bathrooms: listing.bathrooms || 1,
      amenities: listing.amenities || [],
      contactMethods: listing.contactMethods || { phone: "", whatsapp: "", email: "" }
    });
  };

  const handleUpdateListing = () => {
    if (!editingListing) return;
    
    updateListingMutation.mutate({
      id: editingListing.id,
      data: {
        ...newListing,
        pricePerNight: parseFloat(newListing.pricePerNight)
      }
    });
  };

  const stats = {
    totalListings: listings.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum: number, booking: any) => sum + parseFloat(booking.totalPrice || 0), 0),
    totalViews: listings.reduce((sum: number, listing: Listing) => sum + listing.viewCount, 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Host Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and bookings</p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            data-testid="button-create-listing"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalListings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" data-testid="tab-listings">My Listings</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {isCreating || editingListing ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingListing ? 'Edit Listing' : 'Create New Listing'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        value={newListing.title}
                        onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                        placeholder="Beautiful room in city center"
                        data-testid="input-listing-title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type *</label>
                      <Select
                        value={newListing.propertyType}
                        onValueChange={(value) => setNewListing({...newListing, propertyType: value})}
                      >
                        <SelectTrigger data-testid="select-property-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      value={newListing.description}
                      onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                      placeholder="Describe your property..."
                      data-testid="textarea-listing-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Night *</label>
                      <Input
                        type="number"
                        value={newListing.pricePerNight}
                        onChange={(e) => setNewListing({...newListing, pricePerNight: e.target.value})}
                        placeholder="25"
                        data-testid="input-listing-price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Select
                        value={newListing.city}
                        onValueChange={(value) => setNewListing({...newListing, city: value, location: value})}
                      >
                        <SelectTrigger data-testid="select-listing-city">
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
                      <label className="block text-sm font-medium mb-2">Max Guests</label>
                      <Input
                        type="number"
                        value={newListing.maxGuests}
                        onChange={(e) => setNewListing({...newListing, maxGuests: parseInt(e.target.value)})}
                        min="1"
                        data-testid="input-listing-guests"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp</label>
                      <Input
                        value={newListing.contactMethods.whatsapp}
                        onChange={(e) => setNewListing({
                          ...newListing, 
                          contactMethods: {...newListing.contactMethods, whatsapp: e.target.value}
                        })}
                        placeholder="+263771234567"
                        data-testid="input-listing-whatsapp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={newListing.contactMethods.phone}
                        onChange={(e) => setNewListing({
                          ...newListing, 
                          contactMethods: {...newListing.contactMethods, phone: e.target.value}
                        })}
                        placeholder="+263771234567"
                        data-testid="input-listing-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={newListing.contactMethods.email}
                        onChange={(e) => setNewListing({
                          ...newListing, 
                          contactMethods: {...newListing.contactMethods, email: e.target.value}
                        })}
                        placeholder="contact@example.com"
                        data-testid="input-listing-email"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsCreating(false);
                        setEditingListing(null);
                      }}
                      data-testid="button-cancel-listing"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingListing ? handleUpdateListing : handleCreateListing}
                      disabled={createListingMutation.isPending || updateListingMutation.isPending}
                      data-testid="button-save-listing"
                    >
                      {editingListing ? 'Update Listing' : 'Create Listing'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listingsLoading ? (
                  [...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-muted rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded mb-4"></div>
                        <div className="h-6 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : listings.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No listings yet</h3>
                      <p className="text-muted-foreground mb-4">Start by creating your first property listing</p>
                      <Button onClick={() => setIsCreating(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Listing
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  listings.map((listing: Listing) => (
                    <Card key={listing.id} data-testid={`listing-card-${listing.id}`}>
                      <img 
                        src={listing.images?.[0] || '/api/placeholder/400/200'} 
                        alt={listing.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{listing.propertyType.replace('_', ' ')}</Badge>
                          <span className="text-sm text-muted-foreground">{listing.viewCount} views</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{listing.city}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-foreground">${listing.pricePerNight}/night</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Rating: {listing.rating}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setLocation(`/property/${listing.id}`)}
                            data-testid={`button-view-${listing.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditListing(listing)}
                            data-testid={`button-edit-${listing.id}`}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteListingMutation.mutate(listing.id)}
                            disabled={deleteListingMutation.isPending}
                            data-testid={`button-delete-${listing.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">Bookings will appear here once guests start booking your properties</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">Booking #{booking.id.slice(0, 8)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{booking.guests} guests</span>
                          <span className="font-bold text-foreground">${booking.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No messages yet</h3>
                  <p className="text-muted-foreground">Messages from guests will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
