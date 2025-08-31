
import { db } from "./server/db";
import { users, listings, services } from "./shared/schema";

async function seedData() {
  console.log("🌱 Seeding placeholder data...\n");

  try {
    // Create a host user
    console.log("1. Creating host user...");
    const [hostUser] = await db.insert(users).values({
      id: "host-001",
      email: "host@example.com",
      firstName: "John",
      lastName: "Smith",
      profileImageUrl: "https://api.placeholder.com/150x150",
      phoneNumber: "+263771234567",
      role: "host",
      isVerified: true,
      verificationStatus: "verified"
    }).returning();
    console.log(`✅ Created host: ${hostUser.firstName} ${hostUser.lastName} (${hostUser.email})`);

    // Create a service provider user
    console.log("\n2. Creating service provider user...");
    const [serviceProvider] = await db.insert(users).values({
      id: "provider-001", 
      email: "provider@example.com",
      firstName: "Mary",
      lastName: "Johnson",
      profileImageUrl: "https://api.placeholder.com/150x150",
      phoneNumber: "+263771234568",
      role: "host", // Service providers can also be hosts
      isVerified: true,
      verificationStatus: "verified"
    }).returning();
    console.log(`✅ Created service provider: ${serviceProvider.firstName} ${serviceProvider.lastName} (${serviceProvider.email})`);

    // Create a property listing for the host
    console.log("\n3. Creating property listing...");
    const [listing] = await db.insert(listings).values({
      id: "listing-001",
      hostId: hostUser.id,
      title: "Cozy 2-Bedroom Apartment in Harare",
      description: "Beautiful apartment with modern amenities, perfect for students and professionals. Located in a safe neighborhood with easy access to transport.",
      propertyType: "apartment",
      pricePerNight: "45.00",
      currency: "USD",
      location: "Harare, Zimbabwe",
      city: "Harare",
      address: "123 Main Street, Avondale, Harare",
      latitude: "-17.8292",
      longitude: "31.0522", 
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "parking", "security", "water_backup"],
      images: [
        "https://api.placeholder.com/600x400",
        "https://api.placeholder.com/600x400", 
        "https://api.placeholder.com/600x400"
      ],
      isActive: true,
      isVerified: true,
      rating: "4.7",
      reviewCount: 23,
      viewCount: 156,
      tags: ["student_friendly", "wifi", "secure"],
      contactMethods: {
        whatsapp: "+263771234567",
        phone: "+263771234567",
        email: "host@example.com"
      }
    }).returning();
    console.log(`✅ Created listing: ${listing.title}`);

    // Create a service for the service provider
    console.log("\n4. Creating service...");
    const [service] = await db.insert(services).values({
      id: "service-001",
      providerId: serviceProvider.id,
      title: "Professional Cleaning Service",
      description: "Comprehensive cleaning service for apartments, boarding houses, and homes. Includes deep cleaning, regular maintenance, and move-in/move-out cleaning.",
      category: "cleaning",
      priceType: "per_service",
      price: "25.00",
      location: "Harare, Zimbabwe",
      images: [
        "https://api.placeholder.com/600x400",
        "https://api.placeholder.com/600x400"
      ],
      isActive: true,
      rating: "4.9",
      reviewCount: 47
    }).returning();
    console.log(`✅ Created service: ${service.title}`);

    console.log("\n🎉 Sample data seeded successfully!");
    console.log("\n📊 Data Summary:");
    console.log(`   • Host User ID: ${hostUser.id}`);
    console.log(`   • Service Provider ID: ${serviceProvider.id}`);
    console.log(`   • Listing ID: ${listing.id}`);
    console.log(`   • Service ID: ${service.id}`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

// Run the seeding
seedData().catch(console.error);
