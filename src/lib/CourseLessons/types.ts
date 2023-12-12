import { Doc, Id } from "../../../convex/_generated/dataModel";
import { LessonId } from "../Lessons";

export type CourseLessonId = Id<"courseLessons">;
export type CourseLessonDoc = Doc<"courseLessons">;

export interface CourseLessonFormFields {
  lessonIds: LessonId[];
}
