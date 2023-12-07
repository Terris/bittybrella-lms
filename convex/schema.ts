import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    isAdmin: v.optional(v.boolean()),
    roles: v.optional(v.array(v.string())),
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
  }),
  modules: defineTable({
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
    draftModuleId: v.optional(v.id("modules")),
  }),
  courseModules: defineTable({
    courseId: v.id("courses"),
    moduleId: v.id("modules"),
    order: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_moduleId", ["moduleId"])
    .index("by_order", ["order"]),
  moduleSections: defineTable({
    moduleId: v.id("modules"),
    type: v.string(),
    title: v.string(),
    order: v.number(),
    contentId: v.optional(
      v.union(v.id("article"), v.id("video"), v.id("assessment"))
    ),
  })
    .index("by_moduleId", ["moduleId"])
    .index("by_order", ["order"]),
  articles: defineTable({
    title: v.string(),
    content: v.string(),
  }),
  assessments: defineTable({
    title: v.string(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(
          v.object({
            text: v.string(),
            isCorrect: v.boolean(),
          })
        ),
      })
    ),
  }),
});
