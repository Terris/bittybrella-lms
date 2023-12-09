import { Doc, Id } from "../../../convex/_generated/dataModel";

export type AssessmentId = Id<"assessments">;

export type AssessmentDoc = Doc<"assessments">;
export interface AssessmentFormFields {
  title: string;
  description: string;
}
