import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  role: varchar("role").notNull().default("guest"), // guest, host, admin
  isVerified: boolean("is_verified").notNull().default(false),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property types enum
export const propertyTypeEnum = pgEnum("property_type", [
  "boarding_house",
  "private_room", 
  "lodge",
  "hotel",
  "apartment",
  "guesthouse"
]);

// Property listings
export const listings = pgTable("listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  location: varchar("location").notNull(),
  city: varchar("city").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  amenities: jsonb("amenities").default([]),
  images: jsonb("images").default([]),
  isActive: boolean("is_active").notNull().default(true),
  isVerified: boolean("is_verified").notNull().default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.0"),
  reviewCount: integer("review_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  tags: jsonb("tags").default([]),
  contactMethods: jsonb("contact_methods").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  guestId: varchar("guest_id").notNull().references(() => users.id),
  hostId: varchar("host_id").notNull().references(() => users.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out").notNull(),
  guests: integer("guests").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  listingId: varchar("listing_id").references(() => listings.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  messageType: varchar("message_type").notNull().default("text"), // text, image, booking_request
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  reviewerId: varchar("reviewer_id").notNull().references(() => users.id),
  hostId: varchar("host_id").notNull().references(() => users.id),
  bookingId: varchar("booking_id").references(() => bookings.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wishlist
export const wishlist = pgTable("wishlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports/Flags
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id").notNull().references(() => users.id),
  targetType: varchar("target_type").notNull(), // listing, user, message
  targetId: varchar("target_id").notNull(),
  reason: varchar("reason").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("pending"), // pending, reviewed, resolved, dismissed
  createdAt: timestamp("created_at").defaultNow(),
});

// Services (future feature)
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(), // cleaning, moving, tours, etc.
  priceType: varchar("price_type").notNull(), // per_service, per_hour, per_day
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  location: varchar("location").notNull(),
  images: jsonb("images").default([]),
  isActive: boolean("is_active").notNull().default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.0"),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics tracking
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(), // search, view, click, conversion
  eventData: jsonb("event_data").default({}),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences for roommate matching (future feature)
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  age: integer("age"),
  gender: varchar("gender"),
  occupation: varchar("occupation"),
  lifestyle: jsonb("lifestyle").default({}), // smoking, pets, etc.
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  preferredLocations: jsonb("preferred_locations").default([]),
  isLookingForRoommate: boolean("is_looking_for_roommate").notNull().default(false),
  profileVisibility: varchar("profile_visibility").notNull().default("private"), // public, private
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookingsAsGuest: many(bookings, { relationName: "guest" }),
  bookingsAsHost: many(bookings, { relationName: "host" }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  reviews: many(reviews),
  wishlist: many(wishlist),
  services: many(services),
  preferences: many(userPreferences),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  host: one(users, {
    fields: [listings.hostId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
  wishlist: many(wishlist),
  messages: many(messages),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  listing: one(listings, {
    fields: [bookings.listingId],
    references: [listings.id],
  }),
  guest: one(users, {
    fields: [bookings.guestId],
    references: [users.id],
    relationName: "guest",
  }),
  host: one(users, {
    fields: [bookings.hostId],
    references: [users.id],
    relationName: "host",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  listing: one(listings, {
    fields: [messages.listingId],
    references: [listings.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  listing: one(listings, {
    fields: [reviews.listingId],
    references: [listings.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  phoneNumber: true,
});

export const insertListingSchema = createInsertSchema(listings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
  viewCount: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  reviewCount: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof upsertUserSchema._type;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = typeof insertListingSchema._type;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof insertBookingSchema._type;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof insertMessageSchema._type;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof insertReviewSchema._type;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof insertServiceSchema._type;
export type Analytics = typeof analytics.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
