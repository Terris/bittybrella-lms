import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("modules").collect();
  },
});

// export const getAllByCourseId = query({
//   args: {
//     courseId: v.id("courses"),
//   },
//   handler: async (ctx, { courseId }) => {
//     return await ctx.db
//       .query("modules")
//       .filter((q) => q.eq(q.field("courseId"), courseId))
//       .collect();
//   },
// });

export const get = query({
  args: {
    id: v.id("modules"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { title, description }) => {
    return await ctx.db.insert("modules", {
      title,
      description,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("modules"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { id, title, description }) => {
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
    });
    return await ctx.db.get(id);
  },
});
