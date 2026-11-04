import Link from "next/link";
import { Compass, ArrowLeft, BookOpen, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-theme-bg text-theme-text font-sans">
      <div className="max-w-lg w-full text-center space-y-6 p-8 border border-theme-border bg-theme-card">
        <div className="inline-flex items-center justify-center w-14 h-14 border border-theme-primary/30 bg-theme-bg text-theme-primary mb-2">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs text-theme-primary font-bold tracking-widest uppercase">
            STATUS 404 // NODE NOT FOUND
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-theme-text">
            Lesson Route Undefined
          </h1>
          <p className="text-sm text-theme-secondary font-sans leading-relaxed">
            The architectural lesson or route you are looking for does not exist in the SystemVerse curriculum or has been relocated.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          <Link
            href="/learn"
            className="w-full sm:w-auto px-5 py-2.5 bg-theme-primary hover:brightness-110 text-theme-bg font-bold tracking-wider uppercase transition flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Return to Roadmap</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 border border-theme-border hover:border-theme-primary bg-theme-cardElevated text-theme-text hover:text-theme-primary transition flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

