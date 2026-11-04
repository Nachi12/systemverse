import "@testing-library/jest-dom";

// Mock localStorage for jsdom
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock URL.createObjectURL and revokeObjectURL
if (typeof URL.createObjectURL === "undefined") {
  URL.createObjectURL = (blob: Blob) => `blob:mock-${blob.size}`;
}
if (typeof URL.revokeObjectURL === "undefined") {
  URL.revokeObjectURL = () => {};
}

// Mock HTML5 Canvas 2D context for jsdom
HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  if (contextId === "2d") {
    return {
      fillRect: () => {},
      strokeRect: () => {},
      fillText: () => {},
      measureText: (text: string) => ({ width: text.length * 8 }),
      createLinearGradient: () => ({
        addColorStop: () => {},
      }),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 1,
      font: "",
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
} as unknown as typeof HTMLCanvasElement.prototype.getContext;
