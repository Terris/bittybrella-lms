/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.7.1.
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
import type * as courseLessons from "../courseLessons.js";
import type * as courses from "../courses.js";
import type * as http from "../http.js";
import type * as internal_ from "../internal.js";
import type * as lessonSections from "../lessonSections.js";
import type * as lessons from "../lessons.js";
import type * as lib_authorization from "../lib/authorization.js";
import type * as lib_relationships from "../lib/relationships.js";
import type * as lib_utils from "../lib/utils.js";
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
  courseLessons: typeof courseLessons;
  courses: typeof courses;
  http: typeof http;
  internal: typeof internal_;
  lessonSections: typeof lessonSections;
  lessons: typeof lessons;
  "lib/authorization": typeof lib_authorization;
  "lib/relationships": typeof lib_relationships;
  "lib/utils": typeof lib_utils;
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
