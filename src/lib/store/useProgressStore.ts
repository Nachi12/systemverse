import { create } from "zustand";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  xpReward: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  completedProjects: string[];
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  currentLessonId: string;
  isHydrated: boolean;
  
  // Actions
  initFromStorage: () => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, xpBonus?: number) => void;
  completeProject: (projectId: string, xpBonus?: number) => void;
  unlockAchievement: (achievementId: string) => void;
  setCurrentLesson: (lessonId: string) => void;
  updateDailyMission: (missionId: string, delta?: number) => void;
  resetProgress: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_request",
    title: "First Request",
    description: "Complete your first network request lifecycle simulation.",
    icon: "🌐",
    unlockedAt: null,
    xpReward: 100,
  },
  {
    id: "traffic_controller",
    title: "Traffic Controller",
    description: "Scale a load balancer to handle 10,000+ RPS without dropping requests.",
    icon: "🚦",
    unlockedAt: null,
    xpReward: 250,
  },
  {
    id: "cache_master",
    title: "Cache Master",
    description: "Achieve a 90%+ Redis cache hit rate to relieve database saturation.",
    icon: "⚡",
    unlockedAt: null,
    xpReward: 300,
  },
  {
    id: "database_architect",
    title: "Database Architect",
    description: "Successfully configure primary-replica replication and read-splitting.",
    icon: "🗄️",
    unlockedAt: null,
    xpReward: 400,
  },
  {
    id: "failure_survivor",
    title: "Chaos Engineer",
    description: "Survive a simulated primary server crash using health checks & failover.",
    icon: "🛡️",
    unlockedAt: null,
    xpReward: 500,
  },
  {
    id: "system_architect",
    title: "Grand Architect",
    description: "Complete an end-to-end flagship real-world architecture blueprint.",
    icon: "👑",
    unlockedAt: null,
    xpReward: 1000,
  },
];

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: "inspect_dns",
    title: "DNS Packet Inspector",
    description: "Step through the 7 phases of DNS & HTTP request resolution.",
    rewardXp: 75,
    completed: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "stress_test",
    title: "High-Load Stress Test",
    description: "Run the simulation engine past 5,000 requests per second.",
    rewardXp: 100,
    completed: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "quiz_champ",
    title: "Architecture Scholar",
    description: "Score 100% on any interactive lesson quiz.",
    rewardXp: 120,
    completed: false,
    progress: 0,
    maxProgress: 1,
  },
];

const persist = (state: ProgressState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "systemverse_progress",
        JSON.stringify({
          xp: state.xp,
          streak: state.streak,
          lastActiveDate: state.lastActiveDate,
          completedLessons: state.completedLessons,
          completedProjects: state.completedProjects,
          achievements: state.achievements,
          dailyMissions: state.dailyMissions,
          currentLessonId: state.currentLessonId,
        })
      );
    } catch (err) {
      console.error("Failed to persist progress", err);
    }
  }
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  xp: 150,
  streak: 1,
  lastActiveDate: "",
  completedLessons: [],
  completedProjects: [],
  achievements: INITIAL_ACHIEVEMENTS,
  dailyMissions: INITIAL_MISSIONS,
  currentLessonId: "what-happens-when-website-loads",
  isHydrated: false,

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("systemverse_progress");
      if (stored) {
        const saved = JSON.parse(stored);
        const today = new Date().toISOString().split("T")[0];
        let streak = saved.streak ?? 1;
        if (saved.lastActiveDate && saved.lastActiveDate !== today) {
          const lastDate = new Date(saved.lastActiveDate);
          const diffDays = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
        }

        set({
          xp: saved.xp ?? 150,
          streak,
          lastActiveDate: today,
          completedLessons: saved.completedLessons ?? [],
          completedProjects: saved.completedProjects ?? [],
          achievements: saved.achievements ?? INITIAL_ACHIEVEMENTS,
          dailyMissions: saved.dailyMissions ?? INITIAL_MISSIONS,
          currentLessonId: saved.currentLessonId ?? "what-happens-when-website-loads",
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  addXp: (amount: number) => {
    set((state) => {
      const next = { ...state, xp: state.xp + amount };
      persist(next);
      return next;
    });
  },

  completeLesson: (lessonId: string, xpBonus = 150) => {
    set((state) => {
      const isNew = !state.completedLessons.includes(lessonId);
      const nextCompleted = isNew ? [...state.completedLessons, lessonId] : state.completedLessons;
      const nextXp = isNew ? state.xp + xpBonus : state.xp;
      const next = {
        ...state,
        completedLessons: nextCompleted,
        xp: nextXp,
      };
      persist(next);
      return next;
    });
  },

  completeProject: (projectId: string, xpBonus = 350) => {
    set((state) => {
      const isNew = !state.completedProjects.includes(projectId);
      const nextProjects = isNew ? [...state.completedProjects, projectId] : state.completedProjects;
      const nextXp = isNew ? state.xp + xpBonus : state.xp;
      const next = {
        ...state,
        completedProjects: nextProjects,
        xp: nextXp,
      };
      persist(next);
      return next;
    });
  },

  unlockAchievement: (achievementId: string) => {
    set((state) => {
      const ach = state.achievements.find((a) => a.id === achievementId);
      if (ach && !ach.unlockedAt) {
        const updatedAchievements = state.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlockedAt: new Date().toISOString() } : a
        );
        const next = {
          ...state,
          achievements: updatedAchievements,
          xp: state.xp + ach.xpReward,
        };
        persist(next);
        return next;
      }
      return state;
    });
  },

  setCurrentLesson: (lessonId: string) => {
    set((state) => {
      const next = { ...state, currentLessonId: lessonId };
      persist(next);
      return next;
    });
  },

  updateDailyMission: (missionId: string, delta = 1) => {
    set((state) => {
      const updatedMissions = state.dailyMissions.map((m) => {
        if (m.id === missionId && !m.completed) {
          const nextProgress = Math.min(m.maxProgress, m.progress + delta);
          const isDone = nextProgress >= m.maxProgress;
          if (isDone) {
            state.addXp(m.rewardXp);
          }
          return {
            ...m,
            progress: nextProgress,
            completed: isDone,
          };
        }
        return m;
      });
      const next = { ...state, dailyMissions: updatedMissions };
      persist(next);
      return next;
    });
  },

  resetProgress: () => {
    const resetState: ProgressState = {
      ...get(),
      xp: 0,
      completedLessons: [],
      completedProjects: [],
      achievements: INITIAL_ACHIEVEMENTS,
      dailyMissions: INITIAL_MISSIONS,
      currentLessonId: "what-happens-when-website-loads",
    };
    persist(resetState);
    set(resetState);
  },
}));

export function calculateLevel(xp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const levels = [
    { level: 1, title: "Curious Tinkerer", xpRequired: 0 },
    { level: 2, title: "Junior Network Explorer", xpRequired: 200 },
    { level: 3, title: "Traffic Engineer", xpRequired: 500 },
    { level: 4, title: "Data Tier Craftsman", xpRequired: 900 },
    { level: 5, title: "Cache Optimizer", xpRequired: 1400 },
    { level: 6, title: "Distributed Apprentice", xpRequired: 2000 },
    { level: 7, title: "Event Stream Pioneer", xpRequired: 2800 },
    { level: 8, title: "Resilience Champion", xpRequired: 3800 },
    { level: 9, title: "High-Scale Architect", xpRequired: 5000 },
    { level: 10, title: "Principal System Architect", xpRequired: 6500 },
  ];

  let currentLevel = levels[0];
  let nextLevel = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xpRequired) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1] || { level: levels[i].level + 1, title: "Legendary Architect", xpRequired: levels[i].xpRequired + 2000 };
    } else {
      break;
    }
  }

  const range = nextLevel.xpRequired - currentLevel.xpRequired;
  const currentLevelProgress = Math.max(0, xp - currentLevel.xpRequired);
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / range) * 100));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentLevelXp: currentLevelProgress,
    nextLevelXp: range,
    progressPercent,
  };
}
