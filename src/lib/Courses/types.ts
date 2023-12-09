import { Doc, Id } from "../../../convex/_generated/dataModel";

export type CourseId = Id<"courses">;
export type CourseDoc = Doc<"courses">;

export interface CourseFormFields {
  title: string;
  description: string;
  isPublished: boolean;
}
