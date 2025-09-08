import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, setupAuthRoutes, isAuthenticated } from "./supabaseAuth";
import bcrypt from 'bcryptjs';
import { 
  insertListingSchema, 
  insertBookingSchema, 
  insertMessageSchema,
  insertReviewSchema,
  insertServiceSchema,
  insertUiComponentSchema,
  insertComponentUsageSchema,
  createGuestUserSchema,
  type CreateGuestUser,
} from "@shared/schema";
import { z } from "zod";

// Guest signup schema with validation
const guestSignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  setupAuthRoutes(app);

  // Guest signup endpoint (local authentication)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const validatedData = guestSignupSchema.parse(req.body);
      
      // Check if a completed user already exists with this email
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser && existingUser.onboardingStep >= 4) {
        return res.status(400).json({ 
          error: "User already exists", 
          message: "An account with this email already exists" 
        });
      }
      
      // If user exists but hasn't completed onboarding, delete the incomplete record
      if (existingUser && existingUser.onboardingStep < 4) {
        await storage.deleteUser(existingUser.id);
      }
      
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
      
      // Create user data
      const [firstName, ...lastNameParts] = validatedData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const userData: CreateGuestUser = {
        email: validatedData.email,
        firstName,
        lastName,
        role: 'guest',
        signupMethod: 'local',
        onboardingStep: 1,
      };
      
      // Create user in database
      const newUser = await storage.createGuestUser(userData, passwordHash);
      
      // Return user without sensitive data
      const { passwordHash: _, ...userResponse } = newUser;
      
      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: userResponse
      });
      
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors
        });
      }
      
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to create account"
      });
    }
  });
  
  // Update onboarding step endpoint
  app.patch('/api/user/:userId/onboarding', async (req, res) => {
    try {
      const { userId } = req.params;
      const { step } = req.body;
      
      if (!step || typeof step !== 'number') {
        return res.status(400).json({
          error: "Invalid step",
          message: "Step must be a number"
        });
      }
      
      const updatedUser = await storage.updateUserOnboardingStep(userId, step);
      
      // Return user without sensitive data
      const { passwordHash: _, ...userResponse } = updatedUser;
      
      res.json({
        success: true,
        user: userResponse
      });
      
    } catch (error) {
      console.error("Update onboarding step error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to update onboarding step"
      });
    }
  });
  
  // Get user endpoint
  app.get('/api/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({
          error: "User not found"
        });
      }
      
      // Return user without sensitive data
      const { passwordHash: _, ...userResponse } = user;
      
      res.json({
        success: true,
        user: userResponse
      });
      
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to fetch user"
      });
    }
  });

  // User contact routes  
  app.patch('/api/user/:userId/contact', async (req, res) => {
    try {
      const { userId } = req.params;
      const { phoneNumber, city, address } = req.body;
      
      const updatedUser = await storage.updateUserContact(userId, {
        phoneNumber,
        city, 
        address
      });
      
      // Return user without sensitive data
      const { passwordHash: _, ...userResponse } = updatedUser;
      
      res.json({
        success: true,
        user: userResponse
      });
      
    } catch (error) {
      console.error("Save user contact error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to save user contact information"
      });
    }
  });

  // User preferences routes
  app.post('/api/user/:userId/preferences', async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = req.body;
      
      const userPrefs = await storage.createUserPreferences(userId, preferences);
      
      res.json({
        success: true,
        preferences: userPrefs
      });
      
    } catch (error) {
      console.error("Save user preferences error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to save user preferences"
      });
    }
  });

  app.get('/api/user/:userId/preferences', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const preferences = await storage.getUserPreferences(userId);
      
      res.json({
        success: true,
        preferences: preferences || null
      });
      
    } catch (error) {
      console.error("Get user preferences error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to get user preferences"
      });
    }
  });

  // Listing routes
  app.get('/api/listings', async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        propertyType: req.query.propertyType as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        maxGuests: req.query.maxGuests ? parseInt(req.query.maxGuests as string) : undefined,
      };
      
      const listings = await storage.getListings(filters);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get('/api/listings/search', async (req, res) => {
    try {
      const query = req.query.q as string || '';
      const filters = {
        city: req.query.city as string,
        propertyType: req.query.propertyType ? (req.query.propertyType as string).split(',') : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };
      
      const listings = await storage.searchListings(query, filters);
      res.json(listings);
    } catch (error) {
      console.error("Error searching listings:", error);
      res.status(500).json({ message: "Failed to search listings" });
    }
  });

  app.get('/api/listings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementViewCount(id);
      const listing = await storage.getListing(id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post('/api/listings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role === 'guest') {
        return res.status(403).json({ message: "Only hosts can create listings" });
      }

      const listingData = insertListingSchema.parse({
        ...req.body,
        hostId: userId,
      });
      
      const listing = await storage.createListing(listingData);
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid listing data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  app.put('/api/listings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const listing = await storage.getListing(id);
      if (!listing || listing.hostId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this listing" });
      }

      const updatedListing = await storage.updateListing(id, req.body);
      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  app.delete('/api/listings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const listing = await storage.getListing(id);
      if (!listing || listing.hostId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this listing" });
      }

      await storage.deleteListing(id);
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  // Host listings
  app.get('/api/host/listings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const listings = await storage.getListingsByHost(userId);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching host listings:", error);
      res.status(500).json({ message: "Failed to fetch host listings" });
    }
  });

  // Booking routes
  app.get('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const role = req.query.role as "guest" | "host" || "guest";
      const bookings = await storage.getBookings(userId, role);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post('/api/bookings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        guestId: userId,
      });
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.put('/api/bookings/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.claims.sub;
      
      const booking = await storage.getBooking(id);
      if (!booking || booking.hostId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }

      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Message routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: userId,
      });
      
      const message = await storage.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Review routes
  app.get('/api/listings/:id/reviews', async (req, res) => {
    try {
      const { id } = req.params;
      const reviews = await storage.getReviews(id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: userId,
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Wishlist routes
  app.get('/api/wishlist', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wishlistIds = await storage.getWishlist(userId);
      res.json(wishlistIds);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post('/api/wishlist/:listingId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingId } = req.params;
      await storage.addToWishlist(userId, listingId);
      res.json({ message: "Added to wishlist" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete('/api/wishlist/:listingId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { listingId } = req.params;
      await storage.removeFromWishlist(userId, listingId);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post('/api/services', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const serviceData = insertServiceSchema.parse({
        ...req.body,
        providerId: userId,
      });
      
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Report routes
  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportData = {
        ...req.body,
        reporterId: userId,
      };
      
      await storage.createReport(reportData);
      res.status(201).json({ message: "Report submitted successfully" });
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to submit report" });
    }
  });

  // Analytics routes
  app.post('/api/analytics/track', async (req, res) => {
    try {
      const event = {
        ...req.body,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
      };
      
      await storage.trackEvent(event);
      res.json({ message: "Event tracked" });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  // Admin routes (protected)
  app.get('/api/admin/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // User role update (admin only)
  app.put('/api/admin/users/:id/role', isAuthenticated, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      const adminUser = await storage.getUser(adminUserId);
      
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { role } = req.body;
      
      const targetUser = await storage.getUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user role logic would go here
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // UI Components routes
  app.get('/api/ui-components', async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        isPublic: req.query.isPublic ? req.query.isPublic === 'true' : undefined,
      };
      
      const components = await storage.getUIComponents(filters);
      res.json(components);
    } catch (error) {
      console.error("Error fetching UI components:", error);
      res.status(500).json({ message: "Failed to fetch UI components" });
    }
  });

  app.get('/api/ui-components/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const component = await storage.getUIComponent(id);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      console.error("Error fetching UI component:", error);
      res.status(500).json({ message: "Failed to fetch UI component" });
    }
  });

  app.get('/api/ui-components/name/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const component = await storage.getUIComponentByName(name);
      
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      
      res.json(component);
    } catch (error) {
      console.error("Error fetching UI component by name:", error);
      res.status(500).json({ message: "Failed to fetch UI component" });
    }
  });

  app.post('/api/ui-components', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only allow admins to create UI components
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const componentData = insertUiComponentSchema.parse({
        ...req.body,
        createdBy: userId,
        updatedBy: userId,
      });
      
      const component = await storage.createUIComponent(componentData);
      res.status(201).json(component);
    } catch (error) {
      console.error("Error creating UI component:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid component data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create UI component" });
    }
  });

  app.put('/api/ui-components/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only allow admins to update UI components
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const componentData = {
        ...req.body,
        updatedBy: userId,
      };
      
      const component = await storage.updateUIComponent(id, componentData);
      res.json(component);
    } catch (error) {
      console.error("Error updating UI component:", error);
      res.status(500).json({ message: "Failed to update UI component" });
    }
  });

  app.delete('/api/ui-components/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only allow admins to delete UI components
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      await storage.deleteUIComponent(id);
      res.json({ message: "Component deleted successfully" });
    } catch (error) {
      console.error("Error deleting UI component:", error);
      res.status(500).json({ message: "Failed to delete UI component" });
    }
  });

  // Component usage tracking
  app.post('/api/ui-components/track-usage', async (req, res) => {
    try {
      const usageData = insertComponentUsageSchema.parse(req.body);
      const usage = await storage.trackComponentUsage(usageData);
      res.status(201).json(usage);
    } catch (error) {
      console.error("Error tracking component usage:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid usage data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track component usage" });
    }
  });

  app.get('/api/ui-components/:id/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only allow admins to view analytics
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const analytics = await storage.getComponentAnalytics(id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching component analytics:", error);
      res.status(500).json({ message: "Failed to fetch component analytics" });
    }
  });

  // OTP Storage (In production, use Redis or database)
  const otpStorage = new Map<string, { code: string; expires: number; phoneNumber: string }>();

  // Send OTP
  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { phoneNumber, userId } = req.body;
      
      if (!phoneNumber || !userId) {
        return res.status(400).json({ message: 'Phone number and user ID are required' });
      }
      
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 5-minute expiration
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      otpStorage.set(userId, { code: otpCode, expires, phoneNumber });
      
      // In production, send SMS here using Twilio or similar service
      console.log(`OTP for ${phoneNumber}: ${otpCode}`);
      
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully',
        // Include OTP in response for testing (remove in production)
        otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined
      });
      
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  });

  // Verify OTP
  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { phoneNumber, otpCode, userId } = req.body;
      
      if (!phoneNumber || !otpCode || !userId) {
        return res.status(400).json({ message: 'Phone number, OTP code, and user ID are required' });
      }
      
      const storedOTP = otpStorage.get(userId);
      
      if (!storedOTP) {
        return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
      }
      
      if (Date.now() > storedOTP.expires) {
        otpStorage.delete(userId);
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      }
      
      if (storedOTP.phoneNumber !== phoneNumber) {
        return res.status(400).json({ message: 'Phone number mismatch' });
      }
      
      if (storedOTP.code !== otpCode) {
        return res.status(400).json({ message: 'Invalid OTP code' });
      }
      
      // OTP is valid, update user verification status
      await storage.updateUserVerificationStatus(userId, 'phone', true);
      
      // Clean up OTP
      otpStorage.delete(userId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Phone number verified successfully' 
      });
      
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({ message: 'Failed to verify OTP' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
