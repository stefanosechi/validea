// SERVER COMPONENT
import React from "react";

type SectionRow = {
  id: string;
  generationId: string; // alias di ideaId nel DB
  section: string;      // es: "Target Market & Customer Segments"
  subsection: string;
  content: string;
};

async function getSections(ideaId: string): Promise<SectionRow[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/sections?ideaId=${ideaId}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.sections ?? []) as SectionRow[];
}

export default async function BusinessViabilityPage({
  searchParams,
}: {
  searchParams?: { ideaId?: string };
}) {
  const ideaId = searchParams?.ideaId ?? "";

  if (!ideaId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Business Viability</h1>
        <p className="text-gray-600">
          Seleziona un’idea dalla sidebar per vedere il contenuto.
        </p>
      </div>
    );
  }

  const sections = await getSections(ideaId);

  // Parti che valutano la "sostenibilità/viabilità" del business
  const targetTitles = new Set<string>([
    "Target Market & Customer Segments",
    "Market Size (TAM, SAM, SOM)",
    "Revenue & Monetization Strategy",
    "Business Model Canvas (brief overview)",
    "Risk Assessment & Mitigation Plans",
  ]);

  const toShow = sections.filter((s) => targetTitles.has(s.section));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Business Viability</h1>

      {toShow.length === 0 ? (
        <p className="text-gray-600">Nessun contenuto trovato per questa idea.</p>
      ) : (
        toShow.map((row) => (
          <section key={row.id} className="rounded-xl border p-5">
            <h2 className="text-lg font-semibold">{row.section}</h2>
            <article className="prose dark:prose-invert whitespace-pre-wrap mt-3">
              {row.content}
            </article>
          </section>
        ))
      )}
    </div>
  );
}