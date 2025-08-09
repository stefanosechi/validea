import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabella principale delle generazioni (idee generate dall'utente)
export const generations = sqliteTable('generations', {
  id: text('id').primaryKey(),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

// Tabella delle sezioni collegate a ciascuna idea (es: Business Overview, ecc.)
export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  generationId: text("generation_id").notNull(), // 🔄 campo corretto
  section: text("section").notNull(),           // es. "Business Overview"
  subsection: text("subsection").notNull(),     // es. "User Pain Points"
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});