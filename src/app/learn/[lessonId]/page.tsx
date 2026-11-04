import { notFound } from "next/navigation";
import { getLessonById, CURRICULUM_STAGES } from "@/lib/curriculum/curriculumData";
import { LessonClientView } from "./LessonClientView";
import { Metadata } from "next";

interface LessonPageProps {
  params: {
    lessonId: string;
  };
}

export function generateStaticParams() {
  const params: { lessonId: string }[] = [];
  for (const stage of CURRICULUM_STAGES) {
    for (const lesson of stage.lessons) {
      params.push({ lessonId: lesson.id });
    }
  }
  return params;
}

export function generateMetadata({ params }: LessonPageProps): Metadata {
  const lesson = getLessonById(params.lessonId);
  if (!lesson) {
    return {
      title: "Lesson Not Found | SYSTEMVERSE",
    };
  }

  return {
    title: `${lesson.title} | SYSTEMVERSE Architecture Lab`,
    description: lesson.shortSummary,
  };
}

export default function LessonDetailPage({ params }: LessonPageProps) {
  const lesson = getLessonById(params.lessonId);

  // If lesson is not in curriculum or LESSON_DETAILS, render 404
  if (!lesson) {
    notFound();
  }

  // Find previous and next lesson in curriculum
  let prevLessonId: string | null = null;
  let nextLessonId: string | null = null;

  for (let s = 0; s < CURRICULUM_STAGES.length; s++) {
    const stage = CURRICULUM_STAGES[s];
    const idx = stage.lessons.findIndex((l) => l.id === lesson.id);
    if (idx !== -1) {
      if (idx > 0) {
        prevLessonId = stage.lessons[idx - 1].id;
      } else if (s > 0) {
        const prevStage = CURRICULUM_STAGES[s - 1];
        if (prevStage.lessons.length > 0) {
          prevLessonId = prevStage.lessons[prevStage.lessons.length - 1].id;
        }
      }

      if (idx + 1 < stage.lessons.length) {
        nextLessonId = stage.lessons[idx + 1].id;
      } else if (s + 1 < CURRICULUM_STAGES.length && CURRICULUM_STAGES[s + 1].lessons.length > 0) {
        nextLessonId = CURRICULUM_STAGES[s + 1].lessons[0].id;
      }
      break;
    }
  }

  return (
    <LessonClientView
      lesson={lesson}
      prevLessonId={prevLessonId}
      nextLessonId={nextLessonId}
    />
  );
}
