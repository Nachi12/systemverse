import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/Navbar";

export const metadata: Metadata = {
  title: "SYSTEMVERSE — Visual System Design & Architecture Laboratory",
  description:
    "An editorial, interactive engineering laboratory for learning System Design. Experiment with live distributed simulations, network request flows, and scalable infrastructure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-theme-bg text-theme-text antialiased selection:bg-theme-primary selection:text-theme-bg font-sans">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
