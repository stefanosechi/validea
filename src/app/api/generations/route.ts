import { db } from "@/db";
import { generations } from "@/db/schema";

export async function GET() {
  const results = await db.select().from(generations).orderBy(generations.createdAt);
  return new Response(JSON.stringify(results), { status: 200 });
}