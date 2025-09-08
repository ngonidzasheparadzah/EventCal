import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Support both Neon and Supabase databases - prioritize working database
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or SUPABASE_DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure WebSocket for serverless environments
if (typeof globalThis !== 'undefined' && !globalThis.WebSocket) {
  import('@neondatabase/serverless').then(({ neonConfig }) => {
    neonConfig.webSocketConstructor = ws;
  });
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });