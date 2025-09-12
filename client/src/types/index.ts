export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: string;
  pricePerNight: string;
  currency: string;
  location: string;
  city: string;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  maxGuests: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isVerified: boolean;
  rating: string;
  reviewCount: number;
  viewCount: number;
  tags: string[];
  contactMethods: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  phoneNumber?: string;
  role: string;
  isVerified: boolean;
  verificationStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  city?: string;
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  maxGuests?: number;
  amenities?: string[];
  checkIn?: string;
  checkOut?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  isRead: boolean;
  messageType: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  hostId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  reviewerId: string;
  hostId: string;
  bookingId?: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  priceType: string;
  price: string;
  location: string;
  images: string[];
  isActive: boolean;
  rating: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
