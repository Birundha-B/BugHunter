"use client";

import { useState } from "react";
import axios from "axios";

export default function FixesPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateFixes = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/suggest-fixes",
        {
          code,
        }
      );

      setResult(response.data.fixes);
    } catch (error) {
      console.error(error);
      setResult("Error generating fixes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          AI Fix Suggestions
        </h1>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 p-4 rounded-lg text-black"
          />

          <button
            onClick={generateFixes}
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            {loading
              ? "Generating Fixes..."
              : "Generate Fixes"}
          </button>

        </div>

        {result && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Suggested Fixes
            </h2>

            <pre className="whitespace-pre-wrap text-sm">
              {result}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}