import {
  users,
  listings,
  bookings,
  messages,
  reviews,
  wishlist,
  reports,
  services,
  analytics,
  userPreferences,
  type User,
  type UpsertUser,
  type Listing,
  type InsertListing,
  type Booking,
  type InsertBooking,
  type Message,
  type InsertMessage,
  type Review,
  type InsertReview,
  type Service,
  type InsertService,
  type Analytics,
  type UserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, ilike, gte, lte, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (compatible with Supabase Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByAuthId(authId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Listing operations
  getListings(filters?: any): Promise<Listing[]>;
  getListing(id: string): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing>;
  deleteListing(id: string): Promise<void>;
  getListingsByHost(hostId: string): Promise<Listing[]>;
  incrementViewCount(id: string): Promise<void>;
  
  // Booking operations
  getBookings(userId: string, role: "guest" | "host"): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  
  // Message operations
  getConversations(userId: string): Promise<any[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Review operations
  getReviews(listingId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateListingRating(listingId: string): Promise<void>;
  
  // Wishlist operations
  addToWishlist(userId: string, listingId: string): Promise<void>;
  removeFromWishlist(userId: string, listingId: string): Promise<void>;
  getWishlist(userId: string): Promise<string[]>;
  
  // Report operations
  createReport(report: any): Promise<void>;
  getReports(): Promise<any[]>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Analytics operations
  trackEvent(event: Partial<Analytics>): Promise<void>;
  
  // Search operations
  searchListings(query: string, filters?: any): Promise<Listing[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (compatible with Supabase Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.authId, authId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Listing operations
  async getListings(filters?: any): Promise<Listing[]> {
    let query = db.select().from(listings).where(eq(listings.isActive, true));
    
    if (filters?.city) {
      query = query.where(eq(listings.city, filters.city));
    }
    if (filters?.propertyType) {
      query = query.where(eq(listings.propertyType, filters.propertyType));
    }
    if (filters?.minPrice) {
      query = query.where(gte(listings.pricePerNight, filters.minPrice));
    }
    if (filters?.maxPrice) {
      query = query.where(lte(listings.pricePerNight, filters.maxPrice));
    }
    if (filters?.maxGuests) {
      query = query.where(gte(listings.maxGuests, filters.maxGuests));
    }
    
    return await query.orderBy(desc(listings.createdAt));
  }

  async getListing(id: string): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(listing: InsertListing): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  async updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing> {
    const [updatedListing] = await db
      .update(listings)
      .set({ ...listing, updatedAt: new Date() })
      .where(eq(listings.id, id))
      .returning();
    return updatedListing;
  }

  async deleteListing(id: string): Promise<void> {
    await db.update(listings).set({ isActive: false }).where(eq(listings.id, id));
  }

  async getListingsByHost(hostId: string): Promise<Listing[]> {
    return await db.select().from(listings)
      .where(eq(listings.hostId, hostId))
      .orderBy(desc(listings.createdAt));
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(listings)
      .set({ viewCount: sql`${listings.viewCount} + 1` })
      .where(eq(listings.id, id));
  }

  // Booking operations
  async getBookings(userId: string, role: "guest" | "host"): Promise<Booking[]> {
    const field = role === "guest" ? bookings.guestId : bookings.hostId;
    return await db.select().from(bookings)
      .where(eq(field, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  // Message operations
  async getConversations(userId: string): Promise<any[]> {
    const conversations = await db
      .select({
        conversationId: messages.conversationId,
        otherUserId: sql`CASE WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId} ELSE ${messages.senderId} END`,
        lastMessage: messages.content,
        lastMessageTime: messages.createdAt,
        listingId: messages.listingId,
      })
      .from(messages)
      .where(sql`${messages.senderId} = ${userId} OR ${messages.receiverId} = ${userId}`)
      .orderBy(desc(messages.createdAt));
    
    // Group by conversation and get latest message
    const grouped = conversations.reduce((acc, conv) => {
      if (!acc[conv.conversationId] || conv.lastMessageTime > acc[conv.conversationId].lastMessageTime) {
        acc[conv.conversationId] = conv;
      }
      return acc;
    }, {} as any);
    
    return Object.values(grouped);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
  }

  // Review operations
  async getReviews(listingId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(eq(reviews.listingId, listingId), eq(reviews.isVisible, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    await this.updateListingRating(review.listingId);
    return newReview;
  }

  async updateListingRating(listingId: string): Promise<void> {
    const result = await db
      .select({
        avgRating: sql`AVG(${reviews.rating})`,
        count: sql`COUNT(*)`,
      })
      .from(reviews)
      .where(and(eq(reviews.listingId, listingId), eq(reviews.isVisible, true)));

    if (result[0]) {
      await db
        .update(listings)
        .set({
          rating: result[0].avgRating,
          reviewCount: Number(result[0].count),
        })
        .where(eq(listings.id, listingId));
    }
  }

  // Wishlist operations
  async addToWishlist(userId: string, listingId: string): Promise<void> {
    await db.insert(wishlist).values({ userId, listingId }).onConflictDoNothing();
  }

  async removeFromWishlist(userId: string, listingId: string): Promise<void> {
    await db.delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.listingId, listingId)));
  }

  async getWishlist(userId: string): Promise<string[]> {
    const items = await db.select({ listingId: wishlist.listingId })
      .from(wishlist)
      .where(eq(wishlist.userId, userId));
    return items.map(item => item.listingId);
  }

  // Report operations
  async createReport(report: any): Promise<void> {
    await db.insert(reports).values(report);
  }

  async getReports(): Promise<any[]> {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return await db.select().from(services)
      .where(eq(services.isActive, true))
      .orderBy(desc(services.createdAt));
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  // Analytics operations
  async trackEvent(event: Partial<Analytics>): Promise<void> {
    await db.insert(analytics).values(event as any);
  }

  // Search operations
  async searchListings(query: string, filters?: any): Promise<Listing[]> {
    let dbQuery = db.select().from(listings)
      .where(and(
        eq(listings.isActive, true),
        sql`(${listings.title} ILIKE ${`%${query}%`} OR ${listings.description} ILIKE ${`%${query}%`} OR ${listings.location} ILIKE ${`%${query}%`})`
      ));

    if (filters?.city) {
      dbQuery = dbQuery.where(eq(listings.city, filters.city));
    }
    if (filters?.propertyType && filters.propertyType.length > 0) {
      dbQuery = dbQuery.where(inArray(listings.propertyType, filters.propertyType));
    }
    if (filters?.minPrice) {
      dbQuery = dbQuery.where(gte(listings.pricePerNight, filters.minPrice));
    }
    if (filters?.maxPrice) {
      dbQuery = dbQuery.where(lte(listings.pricePerNight, filters.maxPrice));
    }

    return await dbQuery.orderBy(desc(listings.rating), desc(listings.createdAt));
  }
}

export const storage = new DatabaseStorage();
