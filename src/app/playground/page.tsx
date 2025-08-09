'use client';

import { useState } from 'react';

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.result || 'Nessuna risposta');
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4">Validatore di Idee Startup</h1>

      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={5}
        placeholder="Scrivi qui la tua idea di startup..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        disabled={loading}
      >
        {loading ? 'Generazione in corso...' : 'Genera'}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}