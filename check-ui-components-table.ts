
import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function checkUIComponentsTable() {
  try {
    console.log("Checking if ui_components table exists...");
    
    // Check if table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ui_components'
      );
    `);
    
    if (tableExists.rows[0]?.exists) {
      console.log("✅ ui_components table EXISTS");
      
      // Get table structure
      console.log("\n📋 Table structure:");
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'ui_components' 
        ORDER BY ordinal_position;
      `);
      
      columns.rows.forEach((col: any) => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : '(nullable)'}`);
      });
      
      // Check if there are any records
      const count = await db.execute(sql`SELECT COUNT(*) as count FROM ui_components;`);
      console.log(`\n📊 Records in table: ${count.rows[0]?.count || 0}`);
      
      // Show sample records if any exist
      if (parseInt(count.rows[0]?.count || '0') > 0) {
        console.log("\n🔍 Sample records:");
        const samples = await db.execute(sql`
          SELECT id, name, display_name, category, component_type, is_active, created_at 
          FROM ui_components 
          LIMIT 5;
        `);
        
        samples.rows.forEach((record: any, index: number) => {
          console.log(`${index + 1}. ${record.display_name || record.name} (${record.category}/${record.component_type})`);
          console.log(`   ID: ${record.id}, Active: ${record.is_active}, Created: ${record.created_at}`);
        });
      }
      
    } else {
      console.log("❌ ui_components table DOES NOT EXIST");
      console.log("\n💡 You need to run database migrations to create the table.");
      console.log("Run: npx drizzle-kit push");
    }
    
    // Also check component_usage table
    const usageTableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'component_usage'
      );
    `);
    
    if (usageTableExists.rows[0]?.exists) {
      console.log("\n✅ component_usage table also EXISTS");
    } else {
      console.log("\n❌ component_usage table DOES NOT EXIST");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking tables:", error);
    process.exit(1);
  }
}

checkUIComponentsTable();
