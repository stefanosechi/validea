import React from "react";
type SectionRow={id:string;generationId:string;section:string;subsection:string;content:string;};
async function getSections(i:string){const b=process.env.NEXT_PUBLIC_BASE_URL??"";const r=await fetch(`${b}/api/sections?ideaId=${i}`,{cache:"no-store"});if(!r.ok)return[];return (await r.json()).sections as SectionRow[];}
export default async function Page({searchParams}:{searchParams?:{ideaId?:string}}){
  const i=searchParams?.ideaId??""; if(!i) return <div className="p-6"><h1 className="text-2xl font-semibold">Google/Text ad copy</h1><p className="text-gray-600">Seleziona un’idea.</p></div>;
  const s=await getSections(i); const t=new Set(["Go-To-Market Strategy","Revenue & Monetization Strategy","Next Recommended Actions"]); const rows=s.filter(x=>t.has(x.section));
  return (<div className="p-6 space-y-6"><h1 className="text-2xl font-semibold">Google/Text ad copy</h1>{rows.length?rows.map(r=>(
    <section key={r.id} className="rounded-xl border p-5"><h2 className="text-lg font-semibold">{r.section}</h2><article className="prose dark:prose-invert whitespace-pre-wrap mt-3">{r.content}</article></section>
  )):<p className="text-gray-600">Nessun contenuto trovato.</p>}</div>);
}
