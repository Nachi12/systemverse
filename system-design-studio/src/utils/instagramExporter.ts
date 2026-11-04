import { CarouselSlide, StoryboardScene } from "../types/lesson";

/**
 * Renders a 1080x1350 Portrait Carousel slide onto an HTML5 canvas and triggers a real PNG download.
 */
export async function exportCarouselSlidePng(
  slide: CarouselSlide,
  totalSlides: number,
  topicTitle: string
): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  bgGrad.addColorStop(0, "#0b1120");
  bgGrad.addColorStop(0.5, "#0f172a");
  bgGrad.addColorStop(1, "#070b14");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Outer border & subtle glow
  ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, 1020, 1290);

  // Decorative corner accents
  ctx.fillStyle = "#06b6d4";
  ctx.fillRect(24, 24, 40, 12);
  ctx.fillRect(24, 24, 12, 40);
  ctx.fillRect(1016, 24, 40, 12);
  ctx.fillRect(1044, 24, 12, 40);
  ctx.fillRect(24, 1314, 40, 12);
  ctx.fillRect(24, 1286, 12, 40);
  ctx.fillRect(1016, 1314, 40, 12);
  ctx.fillRect(1044, 1286, 12, 40);

  // Top header (Safe area: y=120)
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
  ctx.fillText("SYSTEM DESIGN STUDIO", 80, 130);

  // Slide Counter Pill
  ctx.fillStyle = "rgba(6, 182, 212, 0.2)";
  ctx.fillRect(800, 95, 190, 48);
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 2;
  ctx.strokeRect(800, 95, 190, 48);
  ctx.fillStyle = "#22d3ee";
  ctx.font = "bold 24px monospace";
  ctx.fillText(`SLIDE ${slide.slideNumber} / ${totalSlides}`, 825, 128);

  // Badge pill
  ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
  ctx.fillRect(80, 200, 420, 52);
  ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
  ctx.strokeRect(80, 200, 420, 52);
  ctx.fillStyle = "#c084fc";
  ctx.font = "bold 22px monospace";
  ctx.fillText(slide.badge.toUpperCase(), 105, 234);

  // Main Headline (large, readable)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  wrapText(ctx, slide.headline, 80, 340, 920, 74);

  // Main Idea Card
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(80, 480, 920, 160);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
  ctx.strokeRect(80, 480, 920, 160);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 24px monospace";
  ctx.fillText("THE CORE IDEA:", 115, 530);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "500 34px system-ui, -apple-system, sans-serif";
  wrapText(ctx, slide.mainIdea, 115, 580, 850, 46);

  // Bullet Points or Comparison Visual
  if (slide.visualType === "comparison" && slide.visualData) {
    const boxY = 700;
    // Left Box
    ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
    ctx.fillRect(80, boxY, 440, 360);
    ctx.strokeStyle = "rgba(168, 85, 247, 0.5)";
    ctx.strokeRect(80, boxY, 440, 360);
    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(slide.visualData.leftLabel || "Option A", 110, boxY + 60);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 34px monospace";
    wrapText(ctx, slide.visualData.leftValue || "", 110, boxY + 140, 380, 48);

    // Right Box
    ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
    ctx.fillRect(560, boxY, 440, 360);
    ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
    ctx.strokeRect(560, boxY, 440, 360);
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(slide.visualData.rightLabel || "Option B", 590, boxY + 60);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 34px monospace";
    wrapText(ctx, slide.visualData.rightValue || "", 590, boxY + 140, 380, 48);
  } else if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    let startY = 700;
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "400 32px system-ui, -apple-system, sans-serif";
    for (const bp of slide.bulletPoints) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(85, startY - 22, 16, 16);
      ctx.fillStyle = "#f1f5f9";
      const lines = wrapText(ctx, bp, 120, startY, 860, 44);
      startY += lines * 44 + 36;
    }
  }

  // Bottom Footer Bar (Safe area: y=1200)
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.fillRect(80, 1180, 920, 90);
  ctx.strokeStyle = "#334155";
  ctx.strokeRect(80, 1180, 920, 90);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText(slide.footerTakeaway, 115, 1235);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 22px monospace";
  ctx.fillText("@SystemDesignStudio", 700, 1235);

  // Convert to Blob and trigger real browser download
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanTitle = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `${cleanTitle}-slide-${slide.slideNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

/**
 * Renders a 1080x1920 9:16 vertical Reel Storyboard Scene onto an HTML5 canvas and triggers a real PNG download.
 */
export async function exportStoryboardScenePng(
  scene: StoryboardScene,
  totalScenes: number,
  topicTitle: string
): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  bgGrad.addColorStop(0, "#080c18");
  bgGrad.addColorStop(0.5, "#0d1527");
  bgGrad.addColorStop(1, "#05070e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Border
  ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, 1008, 1848);

  // Reel Header (Safe from top notch: y=180)
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 28px monospace";
  ctx.fillText("REEL STORYBOARD SCENE", 100, 180);

  // Scene & Time Pill
  ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
  ctx.fillRect(720, 140, 260, 56);
  ctx.strokeStyle = "#a855f7";
  ctx.lineWidth = 2;
  ctx.strokeRect(720, 140, 260, 56);
  ctx.fillStyle = "#e9d5ff";
  ctx.font = "bold 26px monospace";
  ctx.fillText(`SCENE ${scene.sceneNumber} (${scene.timestamp})`, 735, 178);

  // Topic Title Banner
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 32px system-ui";
  ctx.fillText(topicTitle.toUpperCase(), 100, 260);

  // Main On-Screen Visual Hook Text (Large text)
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(100, 320, 880, 240);
  ctx.strokeStyle = "rgba(6, 182, 212, 0.5)";
  ctx.strokeRect(100, 320, 880, 240);

  ctx.fillStyle = "#22d3ee";
  ctx.font = "bold 26px monospace";
  ctx.fillText("ON-SCREEN CAPTION / GRAPHIC:", 135, 375);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
  wrapText(ctx, scene.onScreenText, 135, 440, 800, 56);

  // Visual Scene Description
  ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
  ctx.fillRect(100, 620, 880, 420);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.strokeRect(100, 620, 880, 420);

  ctx.fillStyle = "#a855f7";
  ctx.font = "bold 26px monospace";
  ctx.fillText("VISUAL ACTION & CAMERA STAGING:", 135, 680);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "400 34px system-ui, -apple-system, sans-serif";
  wrapText(ctx, scene.visualDescription, 135, 750, 800, 48);

  // Spoken Narration Script Box
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.fillRect(100, 1100, 880, 560);
  ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
  ctx.strokeRect(100, 1100, 880, 560);

  ctx.fillStyle = "#22c55e";
  ctx.font = "bold 26px monospace";
  ctx.fillText("SPOKEN NARRATION SCRIPT (TELEPROMPTER):", 135, 1160);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "500 38px system-ui, -apple-system, sans-serif";
  wrapText(ctx, `"${scene.narration}"`, 135, 1240, 800, 54);

  // Bottom Safe Area Notice
  ctx.fillStyle = "#64748b";
  ctx.font = "bold 22px monospace";
  ctx.fillText("SAFE MARGIN ZONE (1080x1920) • @SystemDesignStudio", 100, 1740);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cleanTitle = topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      a.download = `${cleanTitle}-reel-scene-${scene.sceneNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  let lineCount = 1;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
      lineCount += 1;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return lineCount;
}

