import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const track = mutation({
  args: {
    event: v.string(),
    userId: v.id("users"),
    originatedFrom: v.string(),
    metaData: v.optional(v.any()),
  },
  handler: async (ctx, { event, userId, originatedFrom, metaData }) => {
    return await ctx.db.insert("tracking", {
      event,
      userId,
      originatedFrom,
      metaData,
    });
  },
});
