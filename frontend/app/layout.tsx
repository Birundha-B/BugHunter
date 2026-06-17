import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "BugHunter",
  description: "AI-Powered Code Review Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}