import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Use Supabase database exclusively
const databaseUrl = process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DATABASE_URL must be set. Please add your Supabase connection string to secrets.",
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