import { Router } from "express";
import { storage } from "./storage";
import { hashPassword } from "./auth";
import { 
  insertListingSchema,
  checkEmailSchema,
  completeSignupSchema,
  type CreateGuestUser,
} from "@shared/schema";

const router = Router();

// Public routes - no authentication required
// These routes serve public data and handle signup

// Get public listings (read-only view)
router.get('/listings', async (req, res) => {
  try {
    const listings = await storage.getPublicListings();
    res.json({ success: true, data: listings });
  } catch (error) {
    console.error("Get public listings error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch listings"
    });
  }
});

// Get public services (read-only view)
router.get('/services', async (req, res) => {
  try {
    const services = await storage.getPublicServices();
    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Get public services error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to fetch services"
    });
  }
});

// Check email availability (public endpoint for signup)
router.post('/check-email', async (req, res) => {
  try {
    const validationResult = checkEmailSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors
      });
    }
    
    const { email } = validationResult.data;
    
    // Check if user exists with this email
    const existingUser = await storage.getUserByEmail(email);
    
    res.json({
      success: true,
      exists: !!existingUser
    });
    
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to check email availability"
    });
  }
});

// Complete guest signup (public endpoint)
router.post('/complete-signup', async (req, res) => {
  try {
    const validationResult = completeSignupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationResult.error.errors
      });
    }
    
    const { fullName, email, password, phoneNumber, city, address, preferences } = validationResult.data;
    
    console.log('Processing signup for email:', email);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        message: "An account with this email already exists"
      });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Split full name into first and last name
    const [firstName, ...lastNameParts] = fullName.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    // Create user data - only include provided optional fields
    const userData: CreateGuestUser = {
      email,
      firstName,
      lastName,
      role: 'guest',
      signupMethod: 'local',
      onboardingStep: 4, // Completed onboarding
      phoneNumber: phoneNumber || null,
      city: city || null,
      address: address || null,
    };
    
    // Create user in database permanently
    const newUser = await storage.createGuestUser(userData, hashedPassword);
    console.log('User account created successfully:', newUser.id);
    
    // Create user preferences only if any preferences were provided
    let preferencesCreated = false;
    if (preferences && typeof preferences === 'object') {
      // Check if any preferences actually have values
      const hasValidPreferences = 
        (preferences.preferredAmenities && preferences.preferredAmenities.length > 0) ||
        (preferences.accommodationLookingFor && preferences.accommodationLookingFor.trim().length > 0) ||
        (preferences.roommatePreferences && preferences.roommatePreferences.length > 0) ||
        (preferences.hobbies && preferences.hobbies.length > 0) ||
        (preferences.occupation && preferences.occupation.trim().length > 0);
      
      if (hasValidPreferences) {
        await storage.createUserPreferences(newUser.id, {
          preferredAmenities: preferences.preferredAmenities || [],
          accommodationLookingFor: preferences.accommodationLookingFor?.trim() || undefined,
          roommatePreferences: preferences.roommatePreferences || [],
          hobbies: preferences.hobbies || [],
          occupation: preferences.occupation?.trim() || undefined,
        });
        preferencesCreated = true;
        console.log('User preferences created for user:', newUser.id);
      }
    }
    
    // Return user without sensitive data
    const { passwordHash: _, ...userResponse } = newUser;
    
    console.log('Account creation completed for:', email, 'with preferences:', preferencesCreated);
    
    res.json({
      success: true,
      user: userResponse,
      message: "Account created successfully and ready for use"
    });
    
  } catch (error) {
    console.error("Complete signup error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create account. Please try again."
    });
  }
});

// Track anonymous events (for non-authenticated users)
router.post('/track-event', async (req, res) => {
  try {
    const { sessionId, eventType, eventData, page } = req.body;
    
    if (!sessionId || !eventType) {
      return res.status(400).json({
        error: "Validation failed",
        message: "sessionId and eventType are required"
      });
    }
    
    await storage.trackAnonymousEvent({
      sessionId,
      eventType,
      eventData: eventData || {},
      page: page || null,
    });
    
    res.json({ success: true, message: "Event tracked" });
    
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to track event"
    });
  }
});

export { router as publicRoutes };