
import { db } from "./server/db";
import { users, listings, bookings, messages, reviews, wishlist } from "./shared/schema";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  console.log("🔍 Checking database connection and schema...\n");
  
  try {
    // Test basic connection
    console.log("1. Testing database connection...");
    const result = await db.execute(sql`SELECT NOW() as current_time`);
    console.log("✅ Database connected successfully");
    console.log(`   Current time: ${result[0].current_time}\n`);
    
    // Check if tables exist
    console.log("2. Checking table existence...");
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log("📊 Existing tables:");
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });
    console.log();
    
    // Count records in each main table
    console.log("3. Checking record counts...");
    
    try {
      const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
      console.log(`👥 Users: ${userCount[0].count}`);
    } catch (e) {
      console.log("👥 Users table: Not found or empty");
    }
    
    try {
      const listingCount = await db.execute(sql`SELECT COUNT(*) as count FROM listings`);
      console.log(`🏠 Listings: ${listingCount[0].count}`);
    } catch (e) {
      console.log("🏠 Listings table: Not found or empty");
    }
    
    try {
      const bookingCount = await db.execute(sql`SELECT COUNT(*) as count FROM bookings`);
      console.log(`📅 Bookings: ${bookingCount[0].count}`);
    } catch (e) {
      console.log("📅 Bookings table: Not found or empty");
    }
    
    try {
      const messageCount = await db.execute(sql`SELECT COUNT(*) as count FROM messages`);
      console.log(`💬 Messages: ${messageCount[0].count}`);
    } catch (e) {
      console.log("💬 Messages table: Not found or empty");
    }
    
    try {
      const reviewCount = await db.execute(sql`SELECT COUNT(*) as count FROM reviews`);
      console.log(`⭐ Reviews: ${reviewCount[0].count}`);
    } catch (e) {
      console.log("⭐ Reviews table: Not found or empty");
    }
    
    console.log();
    
    // Check database configuration
    console.log("4. Database configuration:");
    console.log(`   Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
    console.log(`   Supabase URL: ${process.env.SUPABASE_DATABASE_URL ? 'Set' : 'Not set'}`);
    
    // Check recent activity
    console.log("\n5. Recent database activity:");
    try {
      const recentUsers = await db.execute(sql`
        SELECT id, email, "firstName", "lastName", "createdAt" 
        FROM users 
        ORDER BY "createdAt" DESC 
        LIMIT 5
      `);
      
      if (recentUsers.length > 0) {
        console.log("   Recent users:");
        recentUsers.forEach((user: any) => {
          console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.createdAt}`);
        });
      } else {
        console.log("   No users found");
      }
    } catch (e) {
      console.log("   Could not fetch recent users");
    }
    
    try {
      const recentListings = await db.execute(sql`
        SELECT id, title, "propertyType", city, "createdAt" 
        FROM listings 
        ORDER BY "createdAt" DESC 
        LIMIT 5
      `);
      
      if (recentListings.length > 0) {
        console.log("\n   Recent listings:");
        recentListings.forEach((listing: any) => {
          console.log(`   - ${listing.title} (${listing.propertyType}) in ${listing.city} - ${listing.createdAt}`);
        });
      } else {
        console.log("\n   No listings found");
      }
    } catch (e) {
      console.log("\n   Could not fetch recent listings");
    }
    
  } catch (error) {
    console.error("❌ Database check failed:");
    console.error(error);
    
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        console.log("\n💡 Possible issues:");
        console.log("   - Check if DATABASE_URL or SUPABASE_DATABASE_URL is set correctly");
        console.log("   - Verify database server is running");
        console.log("   - Check network connectivity");
      }
    }
  }
  
  console.log("\n✅ Database check complete!");
}

// Run the check
checkDatabase().catch(console.error);
