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
import { many, one } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// User storage table (supports both local signup and Supabase Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number"),
  // Local authentication fields
  passwordHash: varchar("password_hash"), // For local signup
  // User role and verification
  role: varchar("role").notNull().default("guest"), // guest, host, admin
  isVerified: boolean("is_verified").notNull().default(false),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  // Supabase Auth fields (optional for local signup)
  authId: varchar("auth_id").unique(), // maps to Supabase auth.users.id (optional)
  emailVerified: boolean("email_verified").notNull().default(false),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  emailVerifiedAt: timestamp("email_verified_at"),
  phoneVerifiedAt: timestamp("phone_verified_at"),
  lastSignInAt: timestamp("last_sign_in_at"),
  // Additional metadata
  rawUserMetaData: jsonb("raw_user_meta_data").default({}),
  rawAppMetaData: jsonb("raw_app_meta_data").default({}),
  // Signup source tracking
  signupMethod: varchar("signup_method").notNull().default("local"), // local, supabase, google, etc.
  onboardingStep: integer("onboarding_step").notNull().default(1), // Track signup progress
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

// Dynamic UI Components for reusability
export const uiComponents = pgTable("ui_components", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(), // e.g., "property-card-featured", "hero-banner-home"
  displayName: varchar("display_name").notNull(), // Human-readable name
  description: text("description"), // What this component does
  category: varchar("category").notNull(), // card, banner, form, layout, etc.
  componentType: varchar("component_type").notNull(), // react, html, custom
  version: varchar("version").notNull().default("1.0.0"), // Semantic versioning
  isActive: boolean("is_active").notNull().default(true),
  isPublic: boolean("is_public").notNull().default(false), // Available to all users
  // JSON configuration for the component
  config: jsonb("config").notNull(), // Component props, styling, structure
  // HTML/React template (if applicable)
  template: text("template"), // JSX/HTML template string
  // CSS styling configuration
  styles: jsonb("styles").default({}), // Tailwind classes, custom CSS
  // Component behavior and interactions
  interactions: jsonb("interactions").default({}), // Click handlers, animations
  // Responsive configuration
  responsive: jsonb("responsive").default({}), // Mobile, tablet, desktop variants
  // A/B testing and variants
  variants: jsonb("variants").default([]), // Different versions for testing
  // Usage tracking
  usageCount: integer("usage_count").notNull().default(0),
  // Creator and permissions
  createdBy: varchar("created_by").references(() => users.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  // Metadata
  tags: jsonb("tags").default([]), // For categorization and search
  dependencies: jsonb("dependencies").default([]), // Required other components
  previewImage: varchar("preview_image"), // Screenshot or preview URL
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Component usage tracking for analytics
export const componentUsage = pgTable("component_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  componentId: varchar("component_id").notNull().references(() => uiComponents.id),
  userId: varchar("user_id").references(() => users.id), // null for anonymous usage
  page: varchar("page").notNull(), // Where component was used
  context: jsonb("context").default({}), // Additional context data
  performanceMetrics: jsonb("performance_metrics").default({}), // Load time, render time
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments table for booking transactions
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  paymentIntentId: varchar("payment_intent_id").notNull(), // Stripe Payment Intent ID
  status: varchar("status").notNull(), // succeeded, pending, failed
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").notNull().default("USD"),
  paymentMethod: varchar("payment_method"), // e.g., 'card', 'paypal'
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Availability table for listing bookings
export const availability = pgTable("availability", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  date: timestamp("date").notNull(), // The specific date
  isAvailable: boolean("is_available").notNull().default(true),
  bookedByUserId: varchar("booked_by_user_id").references(() => users.id), // If booked, which user
  bookingId: varchar("booking_id").references(() => bookings.id), // Link to the booking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Verification documents for user or listing verification
export const verificationDocuments = pgTable("verification_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Link to user if user verification
  listingId: varchar("listing_id").references(() => listings.id), // Link to listing if listing verification
  documentType: varchar("document_type").notNull(), // e.g., 'id_card', 'passport', 'utility_bill'
  documentUrl: varchar("document_url").notNull(), // URL to the stored document
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  rejectionReason: text("rejection_reason"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table for user alerts
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // e.g., 'new_message', 'booking_request', 'review_received'
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support tickets for customer service
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").notNull().default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority").notNull().default("medium"), // low, medium, high
  assignedToUserId: varchar("assigned_to_user_id").references(() => users.id), // Optional: if assigned to an agent
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Promotions and discounts table
export const promotions = pgTable("promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").notNull().unique(),
  description: text("description"),
  discountType: varchar("discount_type").notNull(), // percentage, fixed_amount
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  usageLimit: integer("usage_limit"), // Total number of times the promo can be used
  usedCount: integer("used_count").notNull().default(0), // Number of times used
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Amenities table to list available amenities for listings
export const amenities = pgTable("amenities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(), // e.g., Wifi, Parking, Pool
  description: text("description"),
  icon: varchar("icon"), // Optional: icon name or URL
  createdAt: timestamp("created_at").defaultNow(),
});

// Property images table to store multiple images per listing
export const propertyImages = pgTable("property_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull().references(() => listings.id),
  imageUrl: varchar("image_url").notNull(), // URL to the image
  altText: varchar("alt_text"), // Accessibility text
  isPrimary: boolean("is_primary").notNull().default(false), // If this is the main image
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved searches table for users
export const savedSearches = pgTable("saved_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  searchQuery: jsonb("search_query").notNull(), // Store search parameters as JSON
  name: varchar("name"), // Optional: user-given name for the search
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
  createdComponents: many(uiComponents, { relationName: "creator" }),
  updatedComponents: many(uiComponents, { relationName: "updater" }),
  componentUsage: many(componentUsage),
  payments: many(payments),
  availability: many(availability),
  verificationDocuments: many(verificationDocuments),
  notifications: many(notifications),
  supportTickets: many(supportTickets),
  savedSearches: many(savedSearches),
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
  propertyImages: many(propertyImages),
  availability: many(availability),
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
  payments: many(payments),
  availability: many(availability),
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

export const uiComponentsRelations = relations(uiComponents, ({ one, many }) => ({
  creator: one(users, {
    fields: [uiComponents.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  updater: one(users, {
    fields: [uiComponents.updatedBy],
    references: [users.id],
    relationName: "updater",
  }),
  usage: many(componentUsage),
}));

export const componentUsageRelations = relations(componentUsage, ({ one }) => ({
  component: one(uiComponents, {
    fields: [componentUsage.componentId],
    references: [uiComponents.id],
  }),
  user: one(users, {
    fields: [componentUsage.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  listing: one(listings, {
    fields: [availability.listingId],
    references: [listings.id],
  }),
  bookedByUser: one(users, {
    fields: [availability.bookedByUserId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [availability.bookingId],
    references: [bookings.id],
  }),
}));

export const verificationDocumentsRelations = relations(verificationDocuments, ({ one }) => ({
  user: one(users, {
    fields: [verificationDocuments.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [verificationDocuments.listingId],
    references: [listings.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  assignedToUser: one(users, {
    fields: [supportTickets.assignedToUserId],
    references: [users.id],
  }),
}));

export const promotionsRelations = relations(promotions, ({ /* many */ }) => ({
  // No direct relations defined here, but could be linked to bookings or orders
}));

export const amenitiesRelations = relations(amenities, ({ /* many */ }) => ({
  // Many-to-many relationship with listings would typically be handled by a join table
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  listing: one(listings, {
    fields: [propertyImages.listingId],
    references: [listings.id],
  }),
}));

export const savedSearchesRelations = relations(savedSearches, ({ one }) => ({
  user: one(users, {
    fields: [savedSearches.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: true, // Don't expose password hash in API
});

export const createGuestUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  signupMethod: true,
  onboardingStep: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  phoneNumber: true,
  authId: true,
  emailVerified: true,
  phoneVerified: true,
  emailVerifiedAt: true,
  phoneVerifiedAt: true,
  lastSignInAt: true,
  rawUserMetaData: true,
  rawAppMetaData: true,
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

export const insertUiComponentSchema = createInsertSchema(uiComponents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  usageCount: true,
});

export const insertComponentUsageSchema = createInsertSchema(componentUsage).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAvailabilitySchema = createInsertSchema(availability).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVerificationDocumentSchema = createInsertSchema(verificationDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
  usedCount: true,
});

export const insertAmenitySchema = createInsertSchema(amenities).omit({
  id: true,
  createdAt: true,
});

export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
  id: true,
  createdAt: true,
});

export const insertSavedSearchSchema = createInsertSchema(savedSearches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof insertUserSchema._type;
export type CreateGuestUser = typeof createGuestUserSchema._type;
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
export type UiComponent = typeof uiComponents.$inferSelect;
export type InsertUiComponent = typeof insertUiComponentSchema._type;
export type ComponentUsage = typeof componentUsage.$inferSelect;
export type InsertComponentUsage = typeof insertComponentUsageSchema._type;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof insertPaymentSchema._type;
export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = typeof insertAvailabilitySchema._type;
export type VerificationDocument = typeof verificationDocuments.$inferSelect;
export type InsertVerificationDocument = typeof insertVerificationDocumentSchema._type;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof insertNotificationSchema._type;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof insertSupportTicketSchema._type;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof insertPromotionSchema._type;
export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = typeof insertAmenitySchema._type;
export type PropertyImage = typeof propertyImages.$inferSelect;
export type InsertPropertyImage = typeof insertPropertyImageSchema._type;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type InsertSavedSearch = typeof insertSavedSearchSchema._type;