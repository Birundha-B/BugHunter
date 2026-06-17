"use client";

import { useState } from "react";
import axios from "axios";

interface Finding {
  file: string;
  issue: string;
  severity: string;
}

export default function RepositorySecurityPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [score, setScore] = useState<number | null>(null);
  const [critical, setCritical] = useState(0);
  const [high, setHigh] = useState(0);
  const [repository, setRepository] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);

  const scanRepository = async () => {
    try {
      setLoading(true);
      setError("");

      setScore(null);
      setFindings([]);

      const parts = repoUrl
        .replace("https://github.com/", "")
        .replace(".git", "")
        .split("/");

      if (parts.length < 2) {
        setError("Invalid GitHub URL");
        return;
      }

      const owner = parts[0];
      const repo = parts[1];

      const response = await axios.post(
        "http://bughunter-68jr.onrender.com/repository-security-scan",
        {
          owner,
          repo,
        }
      );

      setRepository(response.data.repository);
      setScore(response.data.security_score);
      setCritical(response.data.critical);
      setHigh(response.data.high);
      setFindings(response.data.findings || []);
    } catch (err) {
      console.error(err);
      setError("Failed to scan repository.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          Repository Security Scanner
        </h1>

        <div className="bg-slate-800 p-6 rounded-xl">

          <input
            type="text"
            placeholder="Paste GitHub Repository URL"
            value={repoUrl}
            onChange={(e) =>
              setRepoUrl(e.target.value)
            }
            className="w-full p-4 rounded-lg text-black"
          />

          <button
            onClick={scanRepository}
            disabled={loading}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? "Scanning..."
              : "Scan Repository Security"}
          </button>

        </div>

        {error && (
          <div className="mt-6 bg-red-900 p-4 rounded-xl">
            {error}
          </div>
        )}

        {score !== null && (

          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-gray-400">
                  Security Score
                </h3>

                <p className="text-4xl font-bold">
                  {score}
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-gray-400">
                  Critical Issues
                </h3>

                <p className="text-4xl font-bold text-red-500">
                  {critical}
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-gray-400">
                  High Issues
                </h3>

                <p className="text-4xl font-bold text-yellow-500">
                  {high}
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-gray-400">
                  Status
                </h3>

                <p className="text-3xl font-bold text-green-500">
                  {score >= 90
                    ? "Secure"
                    : "Review Needed"}
                </p>
              </div>

            </div>

            <div className="mt-8 bg-slate-800 p-6 rounded-xl">

              <h2 className="text-3xl font-bold mb-6">
                Findings
              </h2>

              {findings.length === 0 ? (
                <div className="bg-green-500/20 border border-green-500 p-4 rounded-lg">
                  ✅ No security issues found.
                </div>
              ) : (
                <div className="space-y-4">

                  {findings.map(
                    (finding, index) => (
                      <div
                        key={index}
                        className="border border-red-500 p-4 rounded-lg"
                      >
                        <p>
                          <strong>File:</strong>{" "}
                          {finding.file}
                        </p>

                        <p>
                          <strong>Issue:</strong>{" "}
                          {finding.issue}
                        </p>

                        <p>
                          <strong>Severity:</strong>{" "}
                          {finding.severity}
                        </p>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </>
        )}

      </div>
    </main>
  );
}