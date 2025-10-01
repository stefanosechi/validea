// src/app/api/generate/route.ts
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { generations, sections } from "@/db/schema";

/**
 * POST /api/generate
 * Body: { prompt: string }
 * Effetti:
 *  - Chiama il modello per generare il report strutturato
 *  - Salva l'idea in `generations`
 *  - Parsifica il testo in sezioni a blocchi e salva in `sections` (una row per sezione)
 * Ritorna: { result, ideaId, sectionsSaved }
 */
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 500,
    });
  }

  // 1) Chiamata al modello
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
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const aiResponse: string =
    data?.choices?.[0]?.message?.content ?? "No response";

  // 2) Salva l'idea principale in `generations`
  const ideaId = uuidv4();
  await db.insert(generations).values({
    id: ideaId,
    prompt,
    response: aiResponse,
  });

  // 3) Parsifica il report in SEZIONI a blocchi (una row per sezione)
  //    - Titolo sezione: "1. **Executive Summary**" (tolleriamo grassetto/2 asterischi e due punti)
  //    - Il contenuto accumulato fino alla prossima sezione diventa `content`
  const lines = aiResponse.split("\n");

  const sectionTitle = /^\s*(\d+)\.\s+\*{0,2}(.+?)\*{0,2}\s*:?\s*$/;
  let currentSection = "";
  let buffer: string[] = [];

  const sectionsToInsert: {
    id: string;
    generationId: string; // <-- nome colonna ALLINEATO allo schema drizzle
    section: string;
    subsection: string;
    content: string;
  }[] = [];

  const flush = () => {
    if (!currentSection) return;
    const content = buffer
      .join("\n")
      .trim()
      // rimuove bullet iniziali mantenendo il testo
      .replace(/^\s*[-•]\s*/gm, "");
    if (content.length > 0) {
      sectionsToInsert.push({
        id: uuidv4(),
        generationId: ideaId, // <-- usa la colonna corretta
        section: currentSection,
        subsection: "default",
        content,
      });
    }
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    const m = line.match(sectionTitle);
    if (m) {
      // nuova sezione: salva la precedente
      flush();
      currentSection = m[2].trim();
    } else {
      if (currentSection) buffer.push(line);
    }
  }
  // salva l'ultima sezione
  flush();

  // 4) Salva le sezioni in `sections`
  if (sectionsToInsert.length > 0) {
    await db.insert(sections).values(sectionsToInsert);
  }

  // 5) Risposta
  return Response.json({
    result: aiResponse,
    ideaId,
    sectionsSaved: sectionsToInsert.length,
  });
}