import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateLessonSection = mutation({
  args: {
    id: v.id("lessonSections"),
    type: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, type, title, content, order }) => {
    const existingSection = await ctx.db.get(id);
    if (!existingSection) throw new Error("Section does not exist");
    await ctx.db.patch(id, {
      content: content ?? existingSection?.content,
    });
    return true;
  },
});
