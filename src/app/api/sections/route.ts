import { NextRequest } from "next/server";
import { db } from "@/db";
import { sections } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ideaId = searchParams.get("ideaId");
  const titles = searchParams.get("titles"); // opzionale, es: ?titles=Executive%20Summary,Problem%20&%20Market%20Gap

  if (!ideaId) {
    return new Response(JSON.stringify({ error: "Missing ideaId" }), { status: 400 });
  }

  let query = db.select().from(sections).where(eq(sections.generationId, ideaId));

  if (titles) {
    const arr = titles.split(",").map((t) => t.trim());
    query = db.select().from(sections).where(
      inArray(sections.section, arr)
    );
  }

  const rows = await query;
  return Response.json({ sections: rows });
}