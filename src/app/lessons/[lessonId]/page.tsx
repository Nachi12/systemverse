import { redirect } from "next/navigation";

export default function LegacyLessonRedirect({
  params,
}: {
  params: { lessonId: string };
}) {
  redirect(`/learn/${params.lessonId}`);
}
