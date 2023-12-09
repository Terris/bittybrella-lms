import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { removeEmptyFromArray } from "./lib/utils";
import { getManyFrom } from "./lib/relationships";

export const findByAssessmentId = query({
  args: {
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, { assessmentId }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const assessmentQuestions = await getManyFrom(
      ctx.db,
      "assessmentQuestions",
      "assessmentId",
      assessmentId
    );
    return removeEmptyFromArray(assessmentQuestions).sort(
      (a, b) => a.order - b.order
    );
  },
});

export const create = mutation({
  args: {
    assessmentId: v.id("assessments"),
    question: v.string(),
    options: v.array(
      v.object({
        text: v.string(),
        isCorrect: v.boolean(),
      })
    ),
  },
  handler: async (ctx, { assessmentId, question, options }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingAssessmentQuestions = await getManyFrom(
      ctx.db,
      "assessmentQuestions",
      "assessmentId",
      assessmentId
    );
    const newAssessmentQuestionId = await ctx.db.insert("assessmentQuestions", {
      assessmentId,
      question: question ?? "Blank question",
      options,
      order: existingAssessmentQuestions.length + 1,
    });
    return await ctx.db.get(newAssessmentQuestionId);
  },
});

export const update = mutation({
  args: {
    id: v.id("assessmentQuestions"),
    question: v.string(),
    options: v.array(
      v.object({
        text: v.string(),
        isCorrect: v.boolean(),
      })
    ),
    order: v.number(),
  },
  handler: async (ctx, { id, question, options, order }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingAssessmentQuestion = await ctx.db.get(id);
    if (!existingAssessmentQuestion) {
      throw new Error("Assessment question does not exist.");
    }
    await ctx.db.patch(id, {
      question: question || existingAssessmentQuestion?.question,
      options: options ?? existingAssessmentQuestion?.options,
      order: order ?? existingAssessmentQuestion?.order,
    });
    return await ctx.db.get(id);
  },
});

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("assessmentQuestions")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await Promise.all(
      idsInOrder.map((id, index) =>
        ctx.db.patch(id, {
          order: index + 1,
        })
      )
    );
    return true;
  },
});
