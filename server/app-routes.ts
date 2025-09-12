import { Router } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./auth";
import { 
  insertListingSchema,
  insertBookingSchema,
  insertMessageSchema,
  insertReviewSchema,
  insertServiceSchema,
  insertUiComponentSchema,
  insertComponentUsageSchema,
} from "@shared/schema";

const router = Router();

// Apply authentication middleware to all app routes
router.use(isAuthenticated);

// Authenticated user routes - require valid user session

// Get current authenticated user
router.get('/user', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authenticated user found"
      });
    }

    // Return user without sensitive data
    const { passwordHash: _, ...userResponse } = req.user;
    res.json({ 
      success: true, 
      user: userResponse 
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user data"
    });
  }
});

// Get user preferences (authenticated only)
router.get('/user/preferences', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const preferences = await storage.getUserPreferences(req.user.id);
    res.json({ 
      success: true, 
      data: preferences 
    });

  } catch (error) {
    console.error("Get user preferences error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user preferences"
    });
  }
});

// Update user onboarding step (authenticated only)
router.patch('/user/:userId/onboarding', async (req, res) => {
  try {
    const { userId } = req.params;
    const { step } = req.body;
    
    // Ensure user can only update their own onboarding
    if (req.user?.id !== userId) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Can only update your own onboarding"
      });
    }
    
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
      user: userResponse,
      message: "Onboarding step updated successfully"
    });
    
  } catch (error) {
    console.error("Update onboarding step error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update onboarding step"
    });
  }
});

// Get user's listings (host only)
router.get('/listings', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }
    
    const listings = await storage.getUserListings(req.user.id);
    res.json({ 
      success: true, 
      data: listings 
    });

  } catch (error) {
    console.error("Get user listings error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user listings"
    });
  }
});

// Create new listing (host only)
router.post('/listings', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const validationResult = insertListingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors
      });
    }

    const listingData = {
      ...validationResult.data,
      hostId: req.user.id,
    };

    const newListing = await storage.createListing(listingData);

    res.status(201).json({
      success: true,
      data: newListing,
      message: "Listing created successfully"
    });

  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create listing"
    });
  }
});

// Get user bookings (authenticated only)
router.get('/bookings', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const bookings = await storage.getUserBookings(req.user.id);
    res.json({ 
      success: true, 
      data: bookings 
    });

  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user bookings"
    });
  }
});

// Create booking (authenticated only)
router.post('/bookings', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const validationResult = insertBookingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors
      });
    }

    const bookingData = {
      ...validationResult.data,
      guestId: req.user.id,
    };

    const newBooking = await storage.createBooking(bookingData);

    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Booking created successfully"
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create booking"
    });
  }
});

// Get user messages (authenticated only)
router.get('/messages', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const messages = await storage.getUserMessages(req.user.id);
    res.json({ 
      success: true, 
      data: messages 
    });

  } catch (error) {
    console.error("Get user messages error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user messages"
    });
  }
});

// Send message (authenticated only)
router.post('/messages', async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User ID required"
      });
    }

    const validationResult = insertMessageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors
      });
    }

    const messageData = {
      ...validationResult.data,
      senderId: req.user.id,
    };

    const newMessage = await storage.createMessage(messageData);

    res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to send message"
    });
  }
});

export { router as appRoutes };