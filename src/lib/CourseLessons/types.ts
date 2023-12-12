import { Doc, Id } from "../../../convex/_generated/dataModel";
import { LessonDoc, LessonId } from "@/lib/Lessons";

export type CourseLessonId = Id<"courseLessons">;
export type CourseLessonDoc = Doc<"courseLessons">;

export type CourseLessonWithLessonDoc = CourseLessonDoc & { lesson: LessonDoc };

export interface CourseLessonFormFields {
  lessonIds: LessonId[];
}
