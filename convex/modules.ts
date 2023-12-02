import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getManyFrom } from "./lib/relationships";
import { removeEmptyFromArray } from "./lib/utils";

export const all = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("modules").collect();
  },
});

export const findById = query({
  args: {
    id: v.id("modules"),
  },
  handler: async (ctx, { id }) => {
    const moduleRec = await ctx.db.get(id);
    const sections = removeEmptyFromArray(
      await getManyFrom(ctx.db, "moduleSections", "moduleId", id)
    ).sort((a, b) => a.order - b.order);
    return { ...moduleRec, sections };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, { title, description, isPublished }) => {
    return await ctx.db.insert("modules", {
      title,
      description,
      isPublished,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("modules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, title, description, isPublished }) => {
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
      isPublished: isPublished ?? existingCourse?.isPublished,
    });
    return await ctx.db.get(id);
  },
});
