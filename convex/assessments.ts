import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { validateIdentity } from "./lib/authorization";

/* ADMIN ONLY
======================================= */
export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("assessments").collect();
  },
});

export type FindAssessmentByIdResult = Doc<"assessments"> & {
  questionCount: number;
};

export const findById = query({
  args: { id: v.id("assessments") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const assessment = await ctx.db.get(id);
    if (!assessment) throw new Error("Assessment does not exist.");
    return assessment;
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
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("assessments"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { id, title, description }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingAssessment = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingAssessment?.title,
      description: description ?? existingAssessment?.description,
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

    await asyncMap(
      moduleSectionsWithThisAssessment,
      async (moduleSection) =>
        await ctx.db.patch(moduleSection._id, { assessmentId: undefined })
    );

    // Remove all related assessmentQuestions
    const asessmentQuestionsToDelete = await ctx.db
      .query("assessmentQuestions")
      .filter((q) => q.eq(q.field("assessmentId"), id))
      .collect();
    await asyncMap(
      asessmentQuestionsToDelete,
      async (assessmentQuestion) => await ctx.db.delete(assessmentQuestion._id)
    );

    // Finally, delete assessment
    await ctx.db.delete(id);
  },
});
