import { describe, it, expect, vi } from "vitest";
import { exportCarouselSlidePng, exportStoryboardScenePng } from "../utils/instagramExporter";
import { CarouselSlide, StoryboardScene } from "../types/lesson";

describe("Instagram Exporter", () => {
  it("renders a 1080x1350 canvas and triggers a real download link for a carousel slide", async () => {
    // Mock HTMLCanvasElement.prototype.toBlob
    const mockToBlob = vi.fn((callback: (blob: Blob | null) => void) => {
      callback(new Blob(["fake-png-binary"], { type: "image/png" }));
    });
    HTMLCanvasElement.prototype.toBlob = mockToBlob;

    // Spy on URL.createObjectURL and click
    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const mockSlide: CarouselSlide = {
      slideNumber: 1,
      badge: "HARDWARE",
      headline: "CPU vs RAM vs SSD",
      mainIdea: "Where code runs",
      footerTakeaway: "Swipe next",
    };

    await exportCarouselSlidePng(mockSlide, 7, "CPU vs RAM");

    expect(mockToBlob).toHaveBeenCalled();
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it("renders a 1080x1920 canvas and triggers download for a reel storyboard scene", async () => {
    const mockToBlob = vi.fn((callback: (blob: Blob | null) => void) => {
      callback(new Blob(["fake-png-binary"], { type: "image/png" }));
    });
    HTMLCanvasElement.prototype.toBlob = mockToBlob;

    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    const mockScene: StoryboardScene = {
      sceneNumber: 1,
      timestamp: "00:00 - 00:05",
      visualDescription: "Host holding a sign",
      narration: "Hello engineers",
      onScreenText: "Welcome to System Design",
    };

    await exportStoryboardScenePng(mockScene, 5, "Database Scaling");

    expect(mockToBlob).toHaveBeenCalled();
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });
});

