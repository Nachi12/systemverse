"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgressStore, calculateLevel } from "@/lib/store/useProgressStore";
import { 
  Bot,
  Layers,
  Terminal,
  Activity
} from "lucide-react";
import { ArchitectAiDrawer } from "@/components/tutor/ArchitectAiDrawer";

export function Navbar() {
  const pathname = usePathname();
  const { xp, streak, initFromStorage } = useProgressStore();
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initFromStorage();
    setMounted(true);
  }, [initFromStorage]);

  const levelInfo = calculateLevel(xp);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Learn", href: "/learn" },
    { label: "Playground", href: "/playground" },
    { label: "Practice", href: "/practice" },
    { label: "Progress", href: "/progress" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-theme-border bg-theme-bg/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Logo & Architectural Masthead */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-6 h-6 border border-theme-primary flex items-center justify-center bg-theme-card text-theme-primary font-mono text-[10px] font-bold group-hover:bg-theme-primary group-hover:text-theme-bg transition duration-150">
                SV
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-theme-text group-hover:text-theme-primary transition">
                  SYSTEMVERSE
                </span>
                <span className="hidden sm:inline-block ml-2 text-[9px] font-mono tracking-widest text-theme-muted uppercase">
                  SYS // ARCHITECTURE LAB
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors relative ${
                      isActive
                        ? "text-theme-primary font-semibold"
                        : "text-theme-muted hover:text-theme-text"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-14px] left-3 right-3 h-[2px] bg-theme-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status / Telemetry & AI Trigger */}
          <div className="flex items-center space-x-3">
            {/* Level & Streak Indicators */}
            <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-theme-muted border border-theme-border px-2.5 py-1 bg-theme-card">
              <span>LVL {mounted ? levelInfo.level : 1}</span>
              <span className="text-theme-border">•</span>
              <span className="text-theme-primary">{mounted ? xp : 150} XP</span>
              <span className="text-theme-border">•</span>
              <span className="text-theme-accent">{mounted ? streak : 1}D STREAK</span>
            </div>

            {/* AI Tutor Drawer Button */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-text hover:text-theme-primary text-xs font-mono transition"
            >
              <Terminal className="w-3.5 h-3.5 text-theme-primary" />
              <span className="hidden sm:inline">AI TUTOR</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="md:hidden flex items-center space-x-2 px-4 py-2 border-t border-theme-border overflow-x-auto scrollbar-none bg-theme-card text-xs font-mono">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-0.5 whitespace-nowrap uppercase tracking-wider ${
                  isActive
                    ? "text-theme-primary font-bold border-b border-theme-primary"
                    : "text-theme-muted hover:text-theme-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Persistent AI Drawer */}
      <ArchitectAiDrawer
        currentTopic={pathname.replace(/^\//, "") || "what-happens-when-website-loads"}
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />
    </>
  );
}
