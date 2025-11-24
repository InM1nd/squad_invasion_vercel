import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned. Use Supabase connection string.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql", // Supabase uses PostgreSQL under the hood
  dbCredentials: {
    url: process.env.DATABASE_URL, // Supabase connection string
  },
});
