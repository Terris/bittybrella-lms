import { Doc, Id } from "../../../convex/_generated/dataModel";

export type LessonId = Id<"lessons">;
export type LessonDoc = Doc<"lessons">;
export interface LessonFormFields {
  title: string;
  description: string;
  isPublished: boolean;
}
