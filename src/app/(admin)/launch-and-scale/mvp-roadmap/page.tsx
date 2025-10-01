import React from "react";

type SectionRow={id:string;generationId:string;section:string;subsection:string;content:string;};
async function getSections(ideaId:string){const b=process.env.NEXT_PUBLIC_BASE_URL??"";const r=await fetch(`${b}/api/sections?ideaId=${ideaId}`,{cache:"no-store"});if(!r.ok)return[];return (await r.json()).sections as SectionRow[];}

export default async function Page({searchParams}:{searchParams?:{ideaId?:string}}){
  const ideaId=searchParams?.ideaId??"";
  if(!ideaId) return <div className="p-6"><h1 className="text-2xl font-semibold">MVP Roadmap</h1><p className="text-gray-600">Seleziona un’idea dalla sidebar.</p></div>;
  const sections=await getSections(ideaId);
  const target=new Set(["MVP Development Roadmap"]);
  const rows=sections.filter(s=>target.has(s.section));
  return (<div className="p-6 space-y-6"><h1 className="text-2xl font-semibold">MVP Roadmap</h1>{rows.length?rows.map(r=>(
    <section key={r.id} className="rounded-xl border p-5"><h2 className="text-lg font-semibold">{r.section}</h2><article className="prose dark:prose-invert whitespace-pre-wrap mt-3">{r.content}</article></section>
  )):<p className="text-gray-600">Nessun contenuto trovato.</p>}</div>);
}