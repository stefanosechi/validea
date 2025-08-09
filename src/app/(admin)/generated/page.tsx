import { db } from "@/db";
import { generations } from "@/db/schema";

export default async function GeneratedPage() {
  const data = await db.select().from(generations);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generazioni salvate</h1>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="border p-4 rounded bg-white shadow">
            <p className="text-gray-600 text-sm mb-2">
              <strong>Prompt:</strong> {item.prompt}
            </p>
            <p className="text-gray-800">
              <strong>Risposta:</strong> {item.response}
            </p>
            <p className="text-xs text-gray-400 mt-2">{item.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}