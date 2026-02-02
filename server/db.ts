import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create drizzle instance with schema
export const db = drizzle(pool, { schema });

// Export pool for session store
export { pool };
