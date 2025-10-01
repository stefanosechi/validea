export type SectionRow = {
  id: string;
  generationId: string;
  section: string;
  subsection: string;
  content: string;
  createdAt?: string | null;
};

export async function fetchSections(ideaId: string): Promise<SectionRow[]> {
  const res = await fetch(`/api/sections?ideaId=${ideaId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load sections");
  const data = await res.json();
  return data.sections as SectionRow[];
}