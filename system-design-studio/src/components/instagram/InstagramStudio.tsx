import React, { useState } from "react";
import { EducationalLesson, CarouselSlide, StoryboardScene } from "../../types/lesson";
import { exportCarouselSlidePng, exportStoryboardScenePng } from "../../utils/instagramExporter";
import { 
  Instagram, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Film, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Share2
} from "lucide-react";

interface InstagramStudioProps {
  lesson: EducationalLesson;
}

export function InstagramStudio({ lesson }: InstagramStudioProps) {
  const [activeTab, setActiveTab] = useState<"carousel" | "reel">("carousel");
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const { instagram } = lesson;
  const slides = instagram.carouselSlides;
  const currentSlide: CarouselSlide | undefined = slides[currentSlideIdx];

  const handleCopyCaption = () => {
    const fullCaption = `${instagram.captionCopy}\n\n${instagram.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleExportCurrentSlide = async () => {
    if (!currentSlide) return;
    setIsExporting(true);
    await exportCarouselSlidePng(currentSlide, slides.length, lesson.title);
    setIsExporting(false);
  };

  const handleExportAllSlides = async () => {
    setIsExporting(true);
    for (const slide of slides) {
      await exportCarouselSlidePng(slide, slides.length, lesson.title);
      // Small pause between browser download events
      await new Promise((r) => setTimeout(r, 400));
    }
    setIsExporting(false);
  };

  const handleExportScene = async (scene: StoryboardScene) => {
    setIsExporting(true);
    await exportStoryboardScenePng(scene, instagram.reelScript.scenes.length, lesson.title);
    setIsExporting(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-studio-900 border border-studio-700 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-studio-750 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Instagram Creator Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                EXPORT READY
              </span>
            </h3>
            <p className="text-xs text-slate-400">Generate high-engagement educational Carousels (1080×1350) and Reels (1080×1920).</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-studio-950 border border-studio-800">
          <button
            onClick={() => setActiveTab("carousel")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "carousel"
                ? "bg-accent-cyan text-studio-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Carousel (1080×1350)</span>
          </button>
          <button
            onClick={() => setActiveTab("reel")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === "reel"
                ? "bg-accent-purple text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reel Script &amp; Storyboard</span>
          </button>
        </div>
      </div>

      {/* Hook & Caption Toolbar */}
      <div className="p-4 rounded-2xl bg-studio-950 border border-studio-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase text-accent-cyan tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> High-Engagement Hook
          </span>
          <button
            onClick={handleCopyCaption}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCaption ? "Caption Copied!" : "Copy Caption & Tags"}</span>
          </button>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed">{instagram.hook}</p>
      </div>

      {/* Mode A: Carousel Studio */}
      {activeTab === "carousel" && (
        <div className="space-y-6">
          {slides.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No carousel slides defined for this upcoming lesson yet.
            </div>
          ) : (
            <>
              {/* Carousel Slide Navigator & Export Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
                    disabled={currentSlideIdx === 0}
                    className="p-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 disabled:opacity-30 text-slate-300 border border-studio-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    Slide {currentSlideIdx + 1} of {slides.length}
                  </span>
                  <button
                    onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
                    disabled={currentSlideIdx === slides.length - 1}
                    className="p-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 disabled:opacity-30 text-slate-300 border border-studio-700"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportCurrentSlide}
                    disabled={isExporting}
                    className="px-3.5 py-1.5 rounded-xl bg-studio-850 hover:bg-studio-800 text-accent-cyan border border-accent-cyan/40 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Slide {currentSlide?.slideNumber} PNG</span>
                  </button>

                  <button
                    onClick={handleExportAllSlides}
                    disabled={isExporting}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-accent-cyan to-brand-500 hover:from-accent-cyan/90 hover:to-brand-500/90 text-studio-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-accent-cyan/20 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExporting ? "Exporting..." : "Download All Slides (PNG)"}</span>
                  </button>
                </div>
              </div>

              {/* 4:5 Aspect Ratio Live Carousel Slide Mockup Preview */}
              {currentSlide && (
                <div className="max-w-sm mx-auto aspect-[4/5] rounded-3xl bg-gradient-to-b from-slate-900 via-studio-950 to-studio-900 border-2 border-accent-cyan/40 p-6 flex flex-col justify-between shadow-2xl relative select-none">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>SYSTEM DESIGN STUDIO</span>
                      <span className="px-2 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan font-bold">
                        {currentSlide.slideNumber} / {slides.length}
                      </span>
                    </div>

                    <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/40">
                      {currentSlide.badge}
                    </span>

                    <h4 className="text-xl font-extrabold text-white leading-tight">
                      {currentSlide.headline}
                    </h4>

                    <div className="p-3.5 rounded-xl bg-studio-900/90 border border-studio-750 text-xs space-y-1">
                      <span className="text-[10px] font-mono font-bold text-accent-cyan block">
                        THE MAIN IDEA:
                      </span>
                      <p className="text-slate-200 leading-snug">{currentSlide.mainIdea}</p>
                    </div>

                    {/* Bullet Points */}
                    {currentSlide.bulletPoints && (
                      <ul className="space-y-2 text-xs text-slate-300">
                        {currentSlide.bulletPoints.map((bp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-accent-cyan font-bold">&bull;</span>
                            <span className="leading-snug">{bp}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Comparison visual */}
                    {currentSlide.visualType === "comparison" && currentSlide.visualData && (
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-studio-900 border border-accent-purple/40">
                          <span className="text-accent-purple font-bold block">{currentSlide.visualData.leftLabel}</span>
                          <span className="text-[11px] text-slate-200 mt-1 block whitespace-pre-line">{currentSlide.visualData.leftValue}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-studio-900 border border-accent-cyan/40">
                          <span className="text-accent-cyan font-bold block">{currentSlide.visualData.rightLabel}</span>
                          <span className="text-[11px] text-slate-200 mt-1 block whitespace-pre-line">{currentSlide.visualData.rightValue}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Slide Footer */}
                  <div className="pt-3 border-t border-studio-800 flex items-center justify-between text-[11px]">
                    <span className="text-accent-cyan font-bold">{currentSlide.footerTakeaway}</span>
                    <span className="text-slate-500 font-mono">@SystemDesignStudio</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Mode B: Reel Script & Storyboard Studio */}
      {activeTab === "reel" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-studio-750">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/40">
                Target: {instagram.reelScript.totalDuration}
              </span>
              <span className="text-slate-400">Hook window: {instagram.reelScript.hookDuration}</span>
            </div>
            <span className="text-xs text-slate-400">Click download to export 1080×1920 Storyboard Frame PNG</span>
          </div>

          {/* Scenes Grid */}
          <div className="space-y-4">
            {instagram.reelScript.scenes.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-4 rounded-2xl bg-studio-950 border border-studio-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-accent-purple">
                      SCENE 0{scene.sceneNumber}
                    </span>
                    <span className="text-xs font-mono text-slate-400">({scene.timestamp})</span>
                  </div>
                  <button
                    onClick={() => handleExportScene(scene)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-studio-850 hover:bg-studio-800 text-accent-cyan border border-studio-700 flex items-center gap-1 font-mono"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export 1080×1920 PNG</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* On screen text */}
                  <div className="p-3 rounded-xl bg-studio-900 border border-accent-cyan/30">
                    <span className="text-[10px] font-mono uppercase text-accent-cyan font-bold block mb-1">
                      On-Screen Text Graphic:
                    </span>
                    <p className="text-white font-semibold whitespace-pre-line">{scene.onScreenText}</p>
                  </div>

                  {/* Visual action */}
                  <div className="p-3 rounded-xl bg-studio-900 border border-studio-750">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                      Camera &amp; Visual Action:
                    </span>
                    <p className="text-slate-300">{scene.visualDescription}</p>
                  </div>
                </div>

                {/* Spoken Narration Script */}
                <div className="p-3 rounded-xl bg-studio-900/80 border border-brand-500/30 text-xs">
                  <span className="text-[10px] font-mono uppercase text-brand-500 font-bold block mb-1">
                    Spoken Narration (Teleprompter):
                  </span>
                  <p className="text-slate-200 italic">&ldquo;{scene.narration}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reel Call-To-Action & Audience Question */}
          <div className="p-4 rounded-2xl bg-studio-850 border border-studio-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-accent-amber font-bold uppercase block">
                Ending Audience Question (Boosts Comments):
              </span>
              <p className="text-white font-semibold mt-0.5">{instagram.reelScript.audienceQuestion}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block">Outro CTA:</span>
              <span className="text-accent-cyan font-semibold">{instagram.reelScript.callToAction}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

