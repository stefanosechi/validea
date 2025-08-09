import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { generations, sections } from "@/db/schema";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
        content: `You are a startup strategy analyst. When a user submits a startup idea, your task is to generate a professional and comprehensive validation report.

Follow this exact structure and formatting. Each section must contain detailed, analytical content (at least 100–150 words per section):

1. Executive Summary
2. Problem & Market Gap
3. Solution Overview
4. Product Features & Differentiators
5. Target Market & Customer Segments
6. Market Size (TAM, SAM, SOM)
7. Competitor Analysis (Direct & Indirect)
8. Revenue & Monetization Strategy
9. Business Model Canvas (brief overview)
10. Go-To-Market Strategy
11. MVP Development Roadmap
12. Technical Stack & Scalability Considerations
13. Hiring & Team Building Plan
14. Financial Projections (Revenue, CAC, LTV, Break-even)
15. Risk Assessment & Mitigation Plans
16. AI/ML Integration Opportunities (if applicable)
17. Investor Readiness Score & Pitch Suggestions
18. Next Recommended Actions

Respond in clean and professional business English using clear markdown-style formatting (e.g., numbered sections and indented bullet points). Never skip a section — even if the content is assumed or speculative.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices?.[0]?.message?.content ?? "Nessuna risposta";

  // 1. Salva l'idea principale
  const ideaId = uuidv4();
  await db.insert(generations).values({
    id: ideaId,
    prompt,
    response: aiResponse,
  });

  // 2. Estrai le sezioni e sotto-sezioni
  const lines = aiResponse.split("\n").filter((line) => line.trim() !== "");

  let currentSection = "";
  let currentSubsection = "";
  const sectionsToInsert = [];

  for (const line of lines) {
    const sectionMatch = line.match(/^(\d+)\.\s+(.*):$/);       // es. "1. Business Overview:"
    const subsectionMatch = line.match(/^\s*-\s+(.*):$/);       // es. "- Summary:"
    
    if (sectionMatch) {
      currentSection = sectionMatch[2].trim();
      currentSubsection = ""; // reset
    } else if (subsectionMatch) {
      currentSubsection = subsectionMatch[1].trim();
    } else if (currentSection) {
    sectionsToInsert.push({
      id: uuidv4(),
      ideaId,
      section: currentSection,
      subsection: currentSubsection || "default",
      content: line.trim(),
      });
    }
  }

  // 3. Salva le sezioni nel DB
  if (sectionsToInsert.length > 0) {
    await db.insert(sections).values(sectionsToInsert);
  }

  return Response.json({ result: aiResponse });
}