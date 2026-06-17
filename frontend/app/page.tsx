import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-6xl font-bold mb-6">
         BugHunter
      </h1>

      <p className="text-xl text-gray-300 mb-12">
        AI-Powered Code Review & Repository Analysis Platform
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <Link
          href="/analyze"
          className="bg-slate-800 p-8 rounded-xl hover:scale-105 transition shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">
            Analyze Code
          </h2>

          <p>
            Detect bugs, security issues and performance problems.
          </p>
        </Link>

        <Link
          href="/fixes"
          className="bg-slate-800 p-8 rounded-xl hover:scale-105 transition shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">
            Fix Suggestions
          </h2>

          <p>
            Generate AI-powered code improvements.
          </p>
        </Link>

        <Link
          href="/repository"
          className="bg-slate-800 p-8 rounded-xl hover:scale-105 transition shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-3">
            Repository Analysis
          </h2>

          <p>
            Analyze entire GitHub repositories.
          </p>
        </Link>
      </div>
    </main>
  );
}