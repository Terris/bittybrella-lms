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
  }),
  lessons: defineTable({
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
    draftLessonId: v.optional(v.id("lessons")),
  }),
  courseLessons: defineTable({
    courseId: v.id("courses"),
    lessonId: v.id("lessons"),
    order: v.number(),
  })
    .index("by_courseId", ["courseId"])
    .index("by_lessonId", ["lessonId"])
    .index("by_order", ["order"]),
  lessonSections: defineTable({
    lessonId: v.id("lessons"),
    type: v.string(),
    title: v.string(),
    content: v.string(),
    order: v.number(),
    assessmentId: v.optional(v.id("assessments")),
  })
    .index("by_lessonId", ["lessonId"])
    .index("by_order", ["order"])
    .index("by_assessmentId", ["assessmentId"]),
  assessments: defineTable({
    title: v.string(),
    description: v.string(),
  }),
  assessmentQuestions: defineTable({
    assessmentId: v.id("assessments"),
    question: v.string(),
    options: v.array(
      v.object({
        text: v.string(),
        isCorrect: v.boolean(),
      })
    ),
    order: v.number(),
  })
    .index("by_assessmentId", ["assessmentId"])
    .index("by_order", ["order"]),
});
