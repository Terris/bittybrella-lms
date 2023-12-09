import { Doc, Id } from "../../../convex/_generated/dataModel";
import { ModuleId } from "../Modules";

export type CourseModuleId = Id<"courseModules">;
export type CourseModuelDoc = Doc<"courseModules">;

export interface CourseModuleFormFields {
  moduleIds: ModuleId[];
}
