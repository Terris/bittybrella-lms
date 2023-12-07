import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("articles").order("desc").take(100);
  },
});

export const findById = query({
  args: {
    id: v.id("articles"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.insert("articles", {
      title,
      content: "",
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, content }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingSection = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title || existingSection?.title,
      content: content ?? existingSection?.content,
    });
    return await ctx.db.get(id);
  },
});

export const deleteById = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await ctx.db.delete(id);
  },
});
