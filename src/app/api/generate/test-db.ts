import { db } from "@/db";
import { generations, sections } from "@/db/schema";

async function getGenerations() {
  const allIdeas = await db.select().from(generations);
  const allSections = await db.select().from(sections);
  console.log("IDEAS:", allIdeas);
  console.log("SECTIONS:", allSections);
}

getGenerations();