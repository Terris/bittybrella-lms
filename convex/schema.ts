import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    isAdmin: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"]),
  tracking: defineTable({
    event: v.string(),
    userId: v.string(),
    originatedFrom: v.string(),
    metaData: v.optional(v.any()),
  }),
  courses: defineTable({
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
    moduleIds: v.array(v.id("modules")),
  }),
  modules: defineTable({
    title: v.string(),
    description: v.string(),
    moduleSectionIds: v.optional(v.array(v.id("moduleSections"))),
  }),
  moduleSections: defineTable({
    moduleId: v.id("modules"),
    type: v.string(),
    title: v.string(),
    content: v.optional(v.string()),
  }),
  courseModules: defineTable({
    courseId: v.id("courses"),
    moduleId: v.id("modules"),
    order: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_moduleId", ["moduleId"]),
});
