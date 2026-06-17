"use client";

import { useState } from "react";
import axios from "axios";

export default function SecurityPage() {
  const [code, setCode] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scanSecurity = async () => {
    try {
      setLoading(true);
      setError("");
      setIssues([]);

      const response = await axios.post(
        "http://bughunter-68jr.onrender.com1:8000/security-scan",
        {
          code,
        }
      );

      setIssues(
        response.data.security_findings || []
      );

    } catch (err) {
      console.error(err);
      setError("Failed to scan code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          Security Scanner
        </h1>

        <textarea
          value={code}
          onChange={(e) =>
            setCode(e.target.value)
          }
          placeholder="Paste your source code here..."
          className="w-full h-80 p-4 rounded-lg border text-black"
        />

        <button
          onClick={scanSecurity}
          disabled={loading}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Scanning..."
            : "Scan Security"}
        </button>

        {error && (
          <div className="mt-6 bg-red-900 p-4 rounded-lg">
            {error}
          </div>
        )}

        {issues.length > 0 && (
          <div className="mt-8 bg-slate-800 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              Security Issues Found
            </h2>

            <ul className="space-y-3">

              {issues.map(
                (issue, index) => (
                  <li
                    key={index}
                    className="bg-red-500/20 border border-red-500 p-4 rounded-lg"
                  >
                    ⚠ {issue}
                  </li>
                )
              )}

            </ul>

          </div>
        )}

        {issues.length === 0 &&
          !loading &&
          code && (
            <div className="mt-8 bg-green-500/20 border border-green-500 p-4 rounded-lg">
              ✅ No security issues detected
            </div>
          )}

      </div>
    </main>
  );
}