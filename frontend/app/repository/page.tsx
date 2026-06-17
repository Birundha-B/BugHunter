"use client";

import { useState } from "react";
import axios from "axios";

export default function RepositoryPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [report, setReport] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractRepoInfo = () => {
    const parts = repoUrl
      .replace("https://github.com/", "")
      .split("/");

    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1],
    };
  };

  const analyzeRepository = async () => {
    try {
      setLoading(true);
      setError("");
      setReport("");
      setFiles([]);

      const repoInfo = extractRepoInfo();

      if (!repoInfo) {
        setError("Invalid GitHub Repository URL");
        return;
      }

      const response = await axios.post(
        "http:////bughunter-68jr.onrender.com/analyze-repository",
        {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setFiles(
        response.data.analyzed_files || []
      );

      setReport(
        response.data.analysis || ""
      );

    } catch (err) {

      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.message
        );
      } else {
        setError("Unknown Error");
      }

    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {

      const repoInfo = extractRepoInfo();

      if (!repoInfo) {
        setError("Invalid GitHub Repository URL");
        return;
      }

      const response = await axios.post(
        "http://bughunter-68jr.onrender.com/analyze-repository-pdf",
        {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "BugHunter_Report.pdf"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      console.error(err);

      setError(
        "Failed to download PDF report."
      );
    }
  };

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          Repository Analysis
        </h1>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <input
            type="text"
            placeholder="https://github.com/owner/repository"
            value={repoUrl}
            onChange={(e) =>
              setRepoUrl(e.target.value)
            }
            className="w-full p-4 rounded-lg text-black"
          />

          <div className="flex gap-4 mt-4">

            <button
              onClick={analyzeRepository}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Repository"}
            </button>

            <button
              onClick={downloadPdf}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
            >
              Download PDF Report
            </button>

          </div>

        </div>

        {error && (
          <div className="mt-8 bg-red-900 rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-3">
              Error
            </h2>

            <p>{error}</p>

          </div>
        )}

        {files.length > 0 && (

          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-gray-400">
                  Files Analyzed
                </p>

                <h3 className="text-3xl font-bold">
                  {files.length}
                </h3>
              </div>

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-gray-400">
                  AI Model
                </p>

                <h3 className="text-3xl font-bold">
                  Gemini
                </h3>
              </div>

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-gray-400">
                  Repository
                </p>

                <h3 className="text-xl font-bold break-all">
                  {
                    repoUrl
                      .split("/")
                      .slice(-1)[0]
                  }
                </h3>
              </div>

              <div className="bg-slate-800 rounded-xl p-5">
                <p className="text-gray-400">
                  Status
                </p>

                <h3 className="text-green-400 text-2xl font-bold">
                  Complete
                </h3>
              </div>

            </div>

            <div className="mt-8 bg-slate-800 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-4">
                Files Analyzed
              </h2>

              <ul className="list-disc pl-6 space-y-2">

                {files.map(
                  (file, index) => (
                    <li key={index}>
                      {file}
                    </li>
                  )
                )}

              </ul>

            </div>

          </>
        )}

        {report && (

          <div className="mt-8 bg-slate-800 rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-4">
              Repository Report
            </h2>

            <div className="bg-slate-900 p-5 rounded-lg max-h-[800px] overflow-y-auto">

              <pre className="whitespace-pre-wrap text-sm leading-7">
                {report}
              </pre>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}