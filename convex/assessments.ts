import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "./lib/relationships";

/* ADMIN ONLY
======================================= */
export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("assessments").collect();
  },
});

export const findById = query({
  args: { id: v.id("assessments") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { title, description }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.insert("assessments", {
      title,
      description,
      questions: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("assessments"),
    title: v.string(),
    description: v.string(),
    questions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          options: v.array(
            v.object({
              text: v.string(),
              isCorrect: v.boolean(),
            })
          ),
        })
      )
    ),
  },
  handler: async (ctx, { id, title, description, questions }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingAssessment = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingAssessment?.title,
      description: description ?? existingAssessment?.description,
      questions: questions ?? existingAssessment?.questions,
    });
    return await ctx.db.get(id);
  },
});

export const deleteById = mutation({
  args: { id: v.id("assessments") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const assessmentToDelete = await ctx.db.get(id);
    if (!assessmentToDelete) throw new Error("Assessment does not exist");

    // Remove this assessment id from all related moduleSections
    const moduleSectionsWithThisAssessment = await ctx.db
      .query("moduleSections")
      .filter((q) => q.eq(q.field("assessmentId"), id))
      .collect();

    await asyncMap(moduleSectionsWithThisAssessment, async (moduleSection) => {
      await ctx.db.patch(moduleSection._id, { assessmentId: undefined });
    });

    // Finally, delete assessment
    await ctx.db.delete(id);
  },
});
