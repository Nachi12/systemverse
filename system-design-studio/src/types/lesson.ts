export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CarouselSlide {
  slideNumber: number;
  badge: string;
  headline: string;
  mainIdea: string;
  bulletPoints?: string[];
  visualType?: "comparison" | "flow" | "architecture" | "checklist";
  visualData?: {
    leftLabel?: string;
    leftValue?: string;
    rightLabel?: string;
    rightValue?: string;
    flowSteps?: string[];
  };
  footerTakeaway: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  timestamp: string;
  visualDescription: string;
  narration: string;
  onScreenText: string;
  audioCue?: string;
}

export interface InstagramContent {
  hook: string;
  captionCopy: string;
  hashtags: string[];
  carouselSlides: CarouselSlide[];
  reelScript: {
    hookDuration: string;
    totalDuration: string;
    scenes: StoryboardScene[];
    callToAction: string;
    audienceQuestion: string;
  };
}

export interface EducationalLesson {
  id: string;
  moduleId: number;
  moduleName: string;
  title: string;
  shortSummary: string;
  estimatedMinutes: number;
  status: "complete" | "upcoming";
  
  // 8-part teaching methodology
  simpleDefinition: string;
  analogy: {
    title: string;
    story: string;
    icon: string;
  };
  technicalExplanation: string;
  whenToUse: string[];
  limitationsAndTradeoffs: string[];
  commonMisconception: {
    myth: string;
    reality: string;
  };
  quiz: QuizQuestion[];

  // Interactive Demo type
  interactiveDemoId: "cpu-ram-ssd" | "database-scaling" | "hld-vs-lld" | "request-journey" | "load-balancing";

  // Instagram Creator Mode
  instagram: InstagramContent;

  // Reference note
  referenceCitation: {
    mentor: string;
    channelName: string;
    topicConcept: string;
    note: string;
  };
}

export interface GlossaryTerm {
  term: string;
  simpleDefinition: string;
  technicalDetails: string;
  category: string;
}

