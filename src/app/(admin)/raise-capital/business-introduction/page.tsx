import React from "react";

type SectionRow = { id: string; generationId: string; section: string; subsection: string; content: string };

async function getSections(ideaId: string): Promise<SectionRow[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/sections?ideaId=${ideaId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()).sections as SectionRow[];
}

export default async function BusinessViabilityPage({ searchParams }: { searchParams?: { ideaId?: string } }) {
  const ideaId = searchParams?.ideaId ?? "";
  if (!ideaId) return <div className="p-6">Seleziona un’idea dalla sidebar.</div>;

  const sections = await getSections(ideaId);
  const target = new Set([
    "Executive Summary",
    "Problem & Market Gap",
    "Solution Overview",
    "Product Features & Differentiators",
    "Revenue & Monetization Strategy",
    "Risk Assessment & Mitigation Plans",
  ]);
  const toShow = sections.filter(s => target.has(s.section));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Business Viability</h1>
      {toShow.length === 0 ? (
        <p>Nessun contenuto trovato per questa idea.</p>
      ) : (
        toShow.map(r => (
          <section key={r.id} className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">{r.section}</h2>
            <article className="prose dark:prose-invert whitespace-pre-wrap mt-2">{r.content}</article>
          </section>
        ))
      )}
    </div>
  );
}