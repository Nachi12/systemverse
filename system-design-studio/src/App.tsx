import React, { useState, useEffect } from "react";
import { LESSONS } from "./data/lessons";
import { EducationalLesson } from "./types/lesson";
import { CpuRamSsdDemo } from "./components/demonstrations/CpuRamSsdDemo";
import { DatabaseScalingDemo } from "./components/demonstrations/DatabaseScalingDemo";
import { HldVsLldDemo } from "./components/demonstrations/HldVsLldDemo";
import { InstagramStudio } from "./components/instagram/InstagramStudio";
import { LessonQuiz } from "./components/quiz/LessonQuiz";
import { GlossaryDrawer } from "./components/glossary/GlossaryDrawer";
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Instagram, 
  AlertOctagon, 
  Lightbulb, 
  Layers, 
  Compass, 
  Award,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export function App() {
  const [selectedLessonId, setSelectedLessonId] = useState<string>("cpu-ram-ssd");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"teach" | "demo" | "quiz" | "instagram">("teach");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("studio_completed_lessons");
      if (stored) {
        setCompletedLessonIds(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const handleMarkComplete = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      const updated = [...completedLessonIds, lessonId];
      setCompletedLessonIds(updated);
      try {
        localStorage.setItem("studio_completed_lessons", JSON.stringify(updated));
      } catch {
        // fallback
      }
    }
  };

  const currentLesson: EducationalLesson =
    LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  const modules = [
    "All",
    "Module 1: Computer & Server Fundamentals",
    "Module 2: How a Web Request Works",
    "Module 4: Database Scaling",
    "Module 5: Architecture Components",
    "Module 7 & 8: High-Level vs Low-Level Design",
  ];

  const filteredLessons = LESSONS.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.shortSummary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === "All" || l.moduleName === selectedModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="min-h-screen bg-studio-950 text-slate-100 flex flex-col font-sans">
      {/* Top Main Navigation */}
      <header className="sticky top-0 z-40 bg-studio-900/90 backdrop-blur-md border-b border-studio-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-cyan via-accent-purple to-brand-500 flex items-center justify-center text-studio-950 font-black shadow-lg shadow-accent-cyan/20">
              SD
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-wide text-white flex items-center gap-2">
                <span>System Design Learning Studio</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-500 border border-brand-500/40">
                  INSTAGRAM CREATOR
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Beginner-Friendly Architecture &bull; 8-Step Pedagogical Method
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-studio-850 border border-studio-750 text-xs font-mono">
              <Award className="w-3.5 h-3.5 text-accent-amber" />
              <span>
                {completedLessonIds.length} / {LESSONS.filter((l) => l.status === "complete").length} Mastered
              </span>
            </div>

            {/* Glossary Button */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-studio-850 hover:bg-studio-800 text-accent-cyan border border-studio-750 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glossary</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body: Sidebar Library + Active Lesson Studio */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Searchable Topic Library (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-3xl bg-studio-900 border border-studio-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-accent-cyan" /> Topic Library
              </h2>
              <span className="text-[10px] font-mono text-slate-500">Recommended Order</span>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search topics, RAM, scaling..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-studio-950 border border-studio-750 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
              />
            </div>

            {/* Module Filter Pills */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-studio-950 border border-studio-750 text-xs text-slate-300 focus:outline-none focus:border-accent-cyan"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Lessons List */}
          <div className="space-y-2.5">
            {filteredLessons.map((lesson) => {
              const isSelected = lesson.id === selectedLessonId;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? "bg-studio-850 border-accent-cyan/60 shadow-lg shadow-accent-cyan/10"
                      : "bg-studio-900/70 border-studio-800 hover:border-studio-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-800 text-slate-400">
                      {lesson.moduleName.split(":")[0]}
                    </span>
                    {lesson.status === "complete" ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-500 border border-brand-500/30">
                        {isDone ? "MASTERED ✅" : "COMPLETE LESSON"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-studio-800 text-slate-500 border border-studio-750">
                        UPCOMING
                      </span>
                    )}
                  </div>

                  <h3 className={`text-xs font-bold leading-snug ${isSelected ? "text-white" : "text-slate-300"}`}>
                    {lesson.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {lesson.shortSummary}
                  </p>

                  <div className="pt-2 border-t border-studio-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.estimatedMinutes} min
                    </span>
                    <span className="text-accent-cyan flex items-center gap-0.5">
                      Open Studio <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson & Creator Studio Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Lesson Header Card */}
          <div className="p-6 rounded-3xl bg-studio-900 border border-studio-750 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-accent-cyan">
                {currentLesson.moduleName}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {currentLesson.estimatedMinutes} mins
                </span>
                {completedLessonIds.includes(currentLesson.id) && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-500 border border-brand-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {currentLesson.title}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentLesson.shortSummary}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-studio-800">
              <button
                onClick={() => setActiveTab("teach")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "teach"
                    ? "bg-accent-cyan text-studio-950 font-extrabold shadow-md"
                    : "bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-750"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>1. Concept &amp; Analogy</span>
              </button>

              <button
                onClick={() => setActiveTab("demo")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "demo"
                    ? "bg-accent-purple text-white font-extrabold shadow-md"
                    : "bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-750"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2. Visual Demo</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "quiz"
                    ? "bg-brand-500 text-studio-950 font-extrabold shadow-md"
                    : "bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-750"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>3. Lesson Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab("instagram")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === "instagram"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold shadow-md"
                    : "bg-studio-850 hover:bg-studio-800 text-pink-300 border border-studio-750"
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>4. Instagram Studio</span>
              </button>
            </div>
          </div>

          {/* Tab 1: 8-Step Pedagogical Explanation */}
          {activeTab === "teach" && (
            <div className="space-y-6 animate-fadeIn">
              {/* 1. Simple Definition */}
              <div className="p-5 rounded-2xl bg-studio-900 border border-studio-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-accent-cyan tracking-wider block">
                  1. Plain English Definition
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentLesson.simpleDefinition}
                </p>
              </div>

              {/* 2. Familiar Analogy */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-studio-900 via-studio-850 to-studio-900 border border-accent-cyan/30 space-y-3 shadow-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{currentLesson.analogy.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-accent-cyan font-bold tracking-wider">
                      2. Familiar Analogy
                    </span>
                    <h3 className="text-base font-bold text-white">{currentLesson.analogy.title}</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentLesson.analogy.story}
                </p>
              </div>

              {/* 3. Accurate Technical Explanation */}
              <div className="p-5 rounded-2xl bg-studio-900 border border-studio-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-accent-purple tracking-wider block">
                  3. Accurate Technical Depth
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                  {currentLesson.technicalExplanation}
                </p>
              </div>

              {/* 4 & 5. When Useful & Trade-offs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* When Useful */}
                <div className="p-5 rounded-2xl bg-studio-900 border border-brand-500/30 space-y-2">
                  <span className="text-xs font-bold text-brand-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 4. When Is This Useful?
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentLesson.whenToUse.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-brand-500 font-bold">&bull;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trade-offs */}
                <div className="p-5 rounded-2xl bg-studio-900 border border-accent-amber/30 space-y-2">
                  <span className="text-xs font-bold text-accent-amber flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" /> 5. Limitations &amp; Trade-Offs
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentLesson.limitationsAndTradeoffs.map((l, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent-amber font-bold">&bull;</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6. Common Misconception (Anti-Fallacy) */}
              <div className="p-5 rounded-2xl bg-accent-rose/10 border border-accent-rose/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-accent-rose">
                  <ShieldAlert className="w-4 h-4" />
                  <span>6. Common Architectural Misconception (Myth vs Reality)</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-studio-950/80 border border-studio-800 text-rose-300">
                    <span className="font-bold">❌ Myth: </span>
                    {currentLesson.commonMisconception.myth}
                  </div>
                  <div className="p-2.5 rounded-xl bg-studio-950/80 border border-studio-800 text-emerald-300">
                    <span className="font-bold">✅ Reality: </span>
                    {currentLesson.commonMisconception.reality}
                  </div>
                </div>
              </div>

              {/* Educational Reference Attribution */}
              <div className="p-4 rounded-xl bg-studio-900/60 border border-studio-800 text-xs text-slate-400 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Reference &amp; Practical Teaching Attribution:
                </span>
                <p>
                  Topic selection inspired by <strong>{currentLesson.referenceCitation.mentor}</strong> ({currentLesson.referenceCitation.channelName}) on &ldquo;{currentLesson.referenceCitation.topicConcept}&rdquo;.
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentLesson.referenceCitation.note} Explanations, interactive simulations, and Instagram carousels are original creations.
                </p>
              </div>

              {/* Complete Lesson CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleMarkComplete(currentLesson.id)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-studio-950 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Lesson Mastered</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Visual Demonstration */}
          {activeTab === "demo" && (
            <div className="space-y-4 animate-fadeIn">
              {currentLesson.interactiveDemoId === "cpu-ram-ssd" && <CpuRamSsdDemo />}
              {currentLesson.interactiveDemoId === "database-scaling" && <DatabaseScalingDemo />}
              {currentLesson.interactiveDemoId === "hld-vs-lld" && <HldVsLldDemo />}
              {currentLesson.interactiveDemoId !== "cpu-ram-ssd" &&
                currentLesson.interactiveDemoId !== "database-scaling" &&
                currentLesson.interactiveDemoId !== "hld-vs-lld" && (
                  <div className="p-8 rounded-2xl bg-studio-900 border border-studio-800 text-center text-xs text-slate-400">
                    Interactive simulation demo for &quot;{currentLesson.title}&quot; is scheduled in the next module release.
                  </div>
                )}
            </div>
          )}

          {/* Tab 3: Interactive Lesson Quiz */}
          {activeTab === "quiz" && (
            <div className="space-y-4 animate-fadeIn">
              {currentLesson.quiz.length > 0 ? (
                <LessonQuiz
                  questions={currentLesson.quiz}
                  lessonId={currentLesson.id}
                  onComplete={() => handleMarkComplete(currentLesson.id)}
                />
              ) : (
                <div className="p-8 rounded-2xl bg-studio-900 border border-studio-800 text-center text-xs text-slate-400">
                  Quiz for this upcoming module will be activated upon publication.
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Instagram Creator Mode */}
          {activeTab === "instagram" && (
            <div className="space-y-4 animate-fadeIn">
              <InstagramStudio lesson={currentLesson} />
            </div>
          )}
        </div>
      </div>

      {/* Glossary Drawer */}
      <GlossaryDrawer isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </div>
  );
}
export default App;

