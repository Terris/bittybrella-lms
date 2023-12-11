/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.6.3.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as assessmentQuestions from "../assessmentQuestions.js";
import type * as assessments from "../assessments.js";
import type * as courseModules from "../courseModules.js";
import type * as courses from "../courses.js";
import type * as lib_authorization from "../lib/authorization.js";
import type * as lib_relationships from "../lib/relationships.js";
import type * as lib_utils from "../lib/utils.js";
import type * as moduleSections from "../moduleSections.js";
import type * as modules from "../modules.js";
import type * as tracking from "../tracking.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assessmentQuestions: typeof assessmentQuestions;
  assessments: typeof assessments;
  courseModules: typeof courseModules;
  courses: typeof courses;
  "lib/authorization": typeof lib_authorization;
  "lib/relationships": typeof lib_relationships;
  "lib/utils": typeof lib_utils;
  moduleSections: typeof moduleSections;
  modules: typeof modules;
  tracking: typeof tracking;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
