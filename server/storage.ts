// Referenced from javascript_auth_all_persistance and javascript_database integrations
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
  uiComponents,
  componentUsage,
  type User,
  type InsertUser,
  type CreateGuestUser,
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
  type UiComponent,
  type InsertUiComponent,
  type ComponentUsage,
  type InsertComponentUsage,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, and, or, desc, asc, sql, ilike, gte, lte, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Referenced from javascript_auth_all_persistance integration
const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations (supports basic auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: { email: string; firstName: string; lastName: string; passwordHash: string; role: string; signupMethod: string; onboardingStep: number; isVerified: boolean; emailVerified: boolean; phoneVerified: boolean; }): Promise<User>;
  createGuestUser(userData: CreateGuestUser, passwordHash: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserOnboardingStep(userId: string, step: number): Promise<User>;
  
  // Legacy methods for existing compatibility
  getUserByAuthId(authId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserVerificationStatus(authId: string, type: 'email' | 'phone', verified: boolean): Promise<User>;
  updateUserSignInTime(authId: string): Promise<void>;
  
  // Public data operations (read-only views)
  getPublicListings(filters?: any): Promise<Listing[]>;
  getPublicServices(filters?: any): Promise<Service[]>;
  trackAnonymousEvent(eventData: { sessionId: string; eventType: string; eventData: any; page: string | null }): Promise<void>;
  
  // Listing operations
  getListings(filters?: any): Promise<Listing[]>;
  getListing(id: string): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing>;
  deleteListing(id: string): Promise<void>;
  getListingsByHost(hostId: string): Promise<Listing[]>;
  getUserListings(hostId: string): Promise<Listing[]>;
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
  
  // User Contact operations
  updateUserContact(userId: string, contactData: {
    phoneNumber?: string;
    city?: string;
    address?: string;
  }): Promise<User>;

  // User Preferences operations
  createUserPreferences(userId: string, preferences: {
    preferredAmenities?: string[];
    accommodationLookingFor?: string;
    roommatePreferences?: string[];
    hobbies?: string[];
    occupation?: string;
  }): Promise<UserPreferences>;
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  
  // UI Components operations
  getUIComponents(filters?: { category?: string; isActive?: boolean; isPublic?: boolean }): Promise<UiComponent[]>;
  getUIComponent(id: string): Promise<UiComponent | undefined>;
  getUIComponentByName(name: string): Promise<UiComponent | undefined>;
  createUIComponent(component: InsertUiComponent): Promise<UiComponent>;
  updateUIComponent(id: string, component: Partial<InsertUiComponent>): Promise<UiComponent>;
  deleteUIComponent(id: string): Promise<void>;
  incrementComponentUsage(id: string): Promise<void>;
  
  // Component usage tracking
  trackComponentUsage(usage: InsertComponentUsage): Promise<ComponentUsage>;
  getComponentAnalytics(componentId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Session store for authentication - referenced from javascript_auth_all_persistance integration
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ pool, createTableIfMissing: true });
  }

  // User operations (supports basic auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: { email: string; firstName: string; lastName: string; passwordHash: string; role: string; signupMethod: string; onboardingStep: number; isVerified: boolean; emailVerified: boolean; phoneVerified: boolean; }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.authId, authId));
    return user;
  }

  async createGuestUser(userData: CreateGuestUser, passwordHash: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        passwordHash,
        signupMethod: 'local',
        onboardingStep: 1,
        role: 'guest',
      })
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async updateUserOnboardingStep(userId: string, step: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        onboardingStep: step,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.authId,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserVerificationStatus(authId: string, type: 'email' | 'phone', verified: boolean): Promise<User> {
    const updateData: any = { updatedAt: new Date() };
    
    if (type === 'email') {
      updateData.emailVerified = verified;
      updateData.emailVerifiedAt = verified ? new Date() : null;
    } else if (type === 'phone') {
      updateData.phoneVerified = verified;
      updateData.phoneVerifiedAt = verified ? new Date() : null;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.authId, authId))
      .returning();
    return user;
  }

  async updateUserSignInTime(authId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        lastSignInAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.authId, authId));
  }

  // User Contact operations
  async updateUserContact(userId: string, contactData: {
    phoneNumber?: string;
    city?: string;
    address?: string;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        phoneNumber: contactData.phoneNumber,
        city: contactData.city,
        address: contactData.address,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // User Preferences operations
  async createUserPreferences(userId: string, preferences: {
    preferredAmenities?: string[];
    accommodationLookingFor?: string;
    roommatePreferences?: string[];
    hobbies?: string[];
    occupation?: string;
  }): Promise<UserPreferences> {
    const [userPrefs] = await db
      .insert(userPreferences)
      .values({
        userId,
        preferredAmenities: preferences.preferredAmenities || [],
        accommodationLookingFor: preferences.accommodationLookingFor,
        roommatePreferences: preferences.roommatePreferences || [],
        hobbies: preferences.hobbies || [],
        occupation: preferences.occupation,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          preferredAmenities: preferences.preferredAmenities || [],
          accommodationLookingFor: preferences.accommodationLookingFor,
          roommatePreferences: preferences.roommatePreferences || [],
          hobbies: preferences.hobbies || [],
          occupation: preferences.occupation,
        }
      })
      .returning();
    return userPrefs;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [userPrefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return userPrefs;
  }

  // Listing operations
  // Public data methods (read-only views for unauthenticated users)
  async getPublicListings(filters?: any): Promise<Listing[]> {
    // Query the listings table for public access
    const whereClauses = [];
    const params = [];
    let paramIndex = 1;
    
    if (filters?.city) {
      whereClauses.push(`city ILIKE $${paramIndex}`);
      params.push(`%${filters.city}%`);
      paramIndex++;
    }
    if (filters?.propertyType) {
      whereClauses.push(`property_type = $${paramIndex}`);
      params.push(filters.propertyType);
      paramIndex++;
    }
    if (filters?.minPrice !== undefined) {
      whereClauses.push(`price_per_night >= $${paramIndex}`);
      params.push(filters.minPrice);
      paramIndex++;
    }
    if (filters?.maxPrice !== undefined) {
      whereClauses.push(`price_per_night <= $${paramIndex}`);
      params.push(filters.maxPrice);
      paramIndex++;
    }
    if (filters?.maxGuests !== undefined) {
      whereClauses.push(`max_guests >= $${paramIndex}`);
      params.push(filters.maxGuests);
      paramIndex++;
    }
    
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const query = `SELECT * FROM listings ${whereClause} ORDER BY created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows as Listing[];
  }

  async getPublicServices(filters?: any): Promise<Service[]> {
    // Query the services table for public access
    const whereClauses = [];
    const params = [];
    let paramIndex = 1;
    
    if (filters?.category) {
      whereClauses.push(`category = $${paramIndex}`);
      params.push(filters.category);
      paramIndex++;
    }
    if (filters?.location) {
      whereClauses.push(`location = $${paramIndex}`);
      params.push(filters.location);
      paramIndex++;
    }
    
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const query = `SELECT * FROM services ${whereClause} ORDER BY created_at DESC`;
    
    const result = await pool.query(query, params);
    return result.rows as Service[];
  }

  async trackAnonymousEvent(eventData: { sessionId: string; eventType: string; eventData: any; page: string | null }): Promise<void> {
    // Insert into anonymous_events table
    await pool.query(`
      INSERT INTO anonymous_events (session_id, event_type, event_data, page) 
      VALUES ($1, $2, $3, $4)
    `, [eventData.sessionId, eventData.eventType, JSON.stringify(eventData.eventData), eventData.page]);
  }

  // Create anonymous session for tracking
  async createAnonymousSession(sessionData: { fingerprint?: string; userAgent?: string; ip?: string }): Promise<{ sessionId: string }> {
    const result = await pool.query(`
      INSERT INTO anonymous_sessions (fingerprint, user_agent, ip_address) 
      VALUES ($1, $2, $3)
      RETURNING id
    `, [sessionData.fingerprint || null, sessionData.userAgent || null, sessionData.ip || null]);
    
    return { sessionId: result.rows[0].id };
  }

  // Get user bookings (for authenticated app routes)
  async getUserBookings(userId: string): Promise<Booking[]> {
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.guestId, userId))
      .orderBy(desc(bookings.createdAt));
    return userBookings;
  }

  // Get user messages (for authenticated app routes)
  async getUserMessages(userId: string): Promise<Message[]> {
    const userMessages = await db
      .select()
      .from(messages)
      .where(or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      ))
      .orderBy(desc(messages.createdAt));
    return userMessages;
  }

  async getListings(filters?: any): Promise<Listing[]> {
    const conditions = [eq(listings.isActive, true)];
    
    if (filters?.city) {
      conditions.push(eq(listings.city, filters.city));
    }
    if (filters?.propertyType) {
      conditions.push(eq(listings.propertyType, filters.propertyType));
    }
    if (filters?.minPrice) {
      conditions.push(gte(listings.pricePerNight, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(listings.pricePerNight, filters.maxPrice));
    }
    if (filters?.maxGuests) {
      conditions.push(gte(listings.maxGuests, filters.maxGuests));
    }
    
    return await db.select().from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.createdAt));
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

  async getUserListings(hostId: string): Promise<Listing[]> {
    return await this.getListingsByHost(hostId);
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
      if (!acc[conv.conversationId] || (conv.lastMessageTime && (!acc[conv.conversationId].lastMessageTime || conv.lastMessageTime > acc[conv.conversationId].lastMessageTime))) {
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
          rating: result[0].avgRating ? sql`${result[0].avgRating}::decimal` : null,
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
    const conditions = [
      eq(listings.isActive, true),
      sql`(${listings.title} ILIKE ${`%${query}%`} OR ${listings.description} ILIKE ${`%${query}%`} OR ${listings.location} ILIKE ${`%${query}%`})`
    ];

    if (filters?.city) {
      conditions.push(eq(listings.city, filters.city));
    }
    if (filters?.propertyType && filters.propertyType.length > 0) {
      conditions.push(inArray(listings.propertyType, filters.propertyType));
    }
    if (filters?.minPrice) {
      conditions.push(gte(listings.pricePerNight, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(listings.pricePerNight, filters.maxPrice));
    }

    return await db.select().from(listings)
      .where(and(...conditions))
      .orderBy(desc(listings.rating), desc(listings.createdAt));
  }

  // UI Components operations
  async getUIComponents(filters?: { category?: string; isActive?: boolean; isPublic?: boolean }): Promise<UiComponent[]> {
    const conditions = [];
    if (filters?.category) {
      conditions.push(eq(uiComponents.category, filters.category));
    }
    if (filters?.isActive !== undefined) {
      conditions.push(eq(uiComponents.isActive, filters.isActive));
    }
    if (filters?.isPublic !== undefined) {
      conditions.push(eq(uiComponents.isPublic, filters.isPublic));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(uiComponents)
        .where(and(...conditions))
        .orderBy(desc(uiComponents.createdAt));
    } else {
      return await db.select().from(uiComponents)
        .orderBy(desc(uiComponents.createdAt));
    }
  }

  async getUIComponent(id: string): Promise<UiComponent | undefined> {
    const [component] = await db.select().from(uiComponents).where(eq(uiComponents.id, id));
    return component;
  }

  async getUIComponentByName(name: string): Promise<UiComponent | undefined> {
    const [component] = await db.select().from(uiComponents).where(eq(uiComponents.name, name));
    return component;
  }

  async createUIComponent(component: InsertUiComponent): Promise<UiComponent> {
    const [newComponent] = await db.insert(uiComponents).values(component).returning();
    return newComponent;
  }

  async updateUIComponent(id: string, component: Partial<InsertUiComponent>): Promise<UiComponent> {
    const [updatedComponent] = await db
      .update(uiComponents)
      .set({ ...component, updatedAt: new Date() })
      .where(eq(uiComponents.id, id))
      .returning();
    return updatedComponent;
  }

  async deleteUIComponent(id: string): Promise<void> {
    await db.delete(uiComponents).where(eq(uiComponents.id, id));
  }

  async incrementComponentUsage(id: string): Promise<void> {
    await db
      .update(uiComponents)
      .set({ usageCount: sql`${uiComponents.usageCount} + 1` })
      .where(eq(uiComponents.id, id));
  }

  // Component usage tracking
  async trackComponentUsage(usage: InsertComponentUsage): Promise<ComponentUsage> {
    const [newUsage] = await db.insert(componentUsage).values(usage).returning();
    
    // Increment component usage count
    if (usage.componentId) {
      await this.incrementComponentUsage(usage.componentId);
    }
    
    return newUsage;
  }

  async getComponentAnalytics(componentId: string): Promise<any> {
    const usageStats = await db
      .select({
        totalUsage: sql<number>`count(*)`,
        uniqueUsers: sql<number>`count(distinct ${componentUsage.userId})`,
        avgPerformance: sql<number>`avg((${componentUsage.performanceMetrics}->>'loadTime')::float)`,
        topPages: sql<string[]>`array_agg(distinct ${componentUsage.page})`,
        recentUsage: sql<number>`count(*) filter (where ${componentUsage.createdAt} >= now() - interval '7 days')`,
      })
      .from(componentUsage)
      .where(eq(componentUsage.componentId, componentId));

    return usageStats[0] || {
      totalUsage: 0,
      uniqueUsers: 0,
      avgPerformance: 0,
      topPages: [],
      recentUsage: 0,
    };
  }
}

export const storage = new DatabaseStorage();
