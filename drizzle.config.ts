import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // ✅ corretto
  dbCredentials: {
    url: "./sqlite.db", // ✅ percorso corretto per sqlite
  },
} satisfies Config;