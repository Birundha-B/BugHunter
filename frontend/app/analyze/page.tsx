"use client";

import { useState } from "react";
import axios from "axios";

export default function AnalyzePage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        {
          code,
        }
      );

      setResult(response.data.analysis);
    } catch (error) {
      setResult("Error analyzing code.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          Analyze Code
        </h1>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 p-4 rounded-lg text-black"
          />

          <button
            onClick={analyzeCode}
            disabled={loading}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Code"}
          </button>

        </div>

        {result && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Analysis Report
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