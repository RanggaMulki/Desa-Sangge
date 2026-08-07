import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// drizzle-kit jalan di luar Next.js, jadi .env.local tidak dimuat otomatis.
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL belum diisi. Buat .env.local (lihat docs/SETUP.md), " +
      "lalu tempel connection string dari Neon.",
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
