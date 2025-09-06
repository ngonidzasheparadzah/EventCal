import type { Express, RequestHandler } from "express";
import { supabaseAdmin } from "@shared/supabase";
import { storage } from "./storage";

export async function setupAuth(app: Express) {
  // Middleware to extract user from Supabase JWT token
  app.use(async (req: any, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        
        if (!error && user) {
          // Get or create user in our database
          let dbUser = await storage.getUserByAuthId(user.id);
          
          if (!dbUser) {
            // Create new user if doesn't exist
            dbUser = await storage.upsertUser({
              authId: user.id,
              email: user.email,
              firstName: user.user_metadata?.first_name || null,
              lastName: user.user_metadata?.last_name || null,
              profileImageUrl: user.user_metadata?.avatar_url || null,
              phoneNumber: user.phone || null,
              emailVerified: user.email_confirmed_at != null,
              phoneVerified: user.phone_confirmed_at != null,
              emailVerifiedAt: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
              phoneVerifiedAt: user.phone_confirmed_at ? new Date(user.phone_confirmed_at) : null,
              lastSignInAt: new Date(),
              rawUserMetaData: user.user_metadata || {},
              rawAppMetaData: user.app_metadata || {},
            });
          } else {
            // Update existing user verification status and sign-in time
            await storage.updateUserSignInTime(user.id);
            
            // Sync verification status if changed
            const emailVerified = user.email_confirmed_at != null;
            const phoneVerified = user.phone_confirmed_at != null;
            
            if (dbUser.emailVerified !== emailVerified) {
              await storage.updateUserVerificationStatus(user.id, 'email', emailVerified);
            }
            
            if (dbUser.phoneVerified !== phoneVerified) {
              await storage.updateUserVerificationStatus(user.id, 'phone', phoneVerified);
            }
            
            // Refresh user data after potential updates
            dbUser = await storage.getUserByAuthId(user.id) || dbUser;
          }
          
          req.user = {
            ...dbUser,
            supabaseUser: user
          };
        }
      } catch (error) {
        console.error('Auth middleware error:', error);
      }
    }
    
    next();
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
};

// Auth routes for frontend
export function setupAuthRoutes(app: Express) {
  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Sign up (handled by Supabase on frontend)
  app.post('/api/auth/signup', async (req, res) => {
    res.status(400).json({ 
      message: "Sign up should be handled by Supabase client on frontend" 
    });
  });

  // Sign in (handled by Supabase on frontend)
  app.post('/api/auth/signin', async (req, res) => {
    res.status(400).json({ 
      message: "Sign in should be handled by Supabase client on frontend" 
    });
  });

  // Sign out (handled by Supabase on frontend)
  app.post('/api/auth/signout', async (req, res) => {
    res.status(400).json({ 
      message: "Sign out should be handled by Supabase client on frontend" 
    });
  });
}