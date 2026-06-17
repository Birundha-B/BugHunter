import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        🐞 BugHunter
      </h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>

        <Link href="/analyze">
          Analyze Code
        </Link>

        <Link href="/fixes">
          Fix Suggestions
        </Link>

        <Link href="/security">
  Security Scanner
</Link>
<Link href="/repository-security">
  Repo Security
</Link>

        <Link href="/repository">
          Repository Analysis
        </Link>
      </div>
    </nav>
  );
}