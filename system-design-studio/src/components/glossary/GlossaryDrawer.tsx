import React, { useState } from "react";
import { GLOSSARY_TERMS } from "../../data/glossary";
import { GlossaryTerm } from "../../types/lesson";
import { BookOpen, X, Search, Sparkles } from "lucide-react";

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

export function GlossaryDrawer({ isOpen, onClose, initialTerm }: GlossaryDrawerProps) {
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = ["All", "Hardware", "Performance", "Database", "Architecture", "Distributed Systems"];

  const filteredTerms = GLOSSARY_TERMS.filter((t) => {
    const matchesSearch =
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.technicalDetails.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-studio-950/95 backdrop-blur-xl border-l border-studio-700 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-4 border-b border-studio-800 flex items-center justify-between bg-studio-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">System Design Glossary</h3>
            <p className="text-[11px] text-slate-400">Plain English definitions for complex jargon</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-studio-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-studio-800 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search term (e.g. latency, sharding, replica)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-studio-900 border border-studio-750 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1 text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-accent-cyan text-studio-950 font-bold"
                  : "bg-studio-850 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTerms.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No terms found matching &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredTerms.map((t) => (
            <div
              key={t.term}
              className="p-3.5 rounded-2xl bg-studio-900/80 border border-studio-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{t.term}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-accent-cyan border border-studio-700">
                  {t.category}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {t.simpleDefinition}
              </p>

              <div className="pt-2 border-t border-studio-850 text-[11px] text-slate-400 leading-relaxed font-mono">
                <span className="text-accent-purple font-semibold">Technical Detail: </span>
                {t.technicalDetails}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

