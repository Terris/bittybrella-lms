import { Doc, Id } from "../../../convex/_generated/dataModel";

export type ModuleId = Id<"modules">;
export type ModuleDoc = Doc<"modules">;
export interface ModuleFormFields {
  title: string;
  description: string;
  isPublished: boolean;
}
