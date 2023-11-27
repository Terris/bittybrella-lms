import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { notEmpty } from "./lib/utils";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("modules").collect();
  },
});

export const get = query({
  args: {
    id: v.id("modules"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getWithSections = query({
  args: { id: v.id("modules") },
  handler: async (ctx, { id }) => {
    const theModule = await ctx.db.get(id);
    if (theModule?.moduleSectionIds === undefined)
      return { ...theModule, sections: undefined };
    const moduleSections = await Promise.all(
      (theModule?.moduleSectionIds).map((sectionId) => ctx.db.get(sectionId))
    );
    const filteredModuleSections: Doc<"moduleSections">[] =
      moduleSections.filter(notEmpty);

    return { ...theModule, sections: filteredModuleSections };
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
    title: v.optional(v.string()),
    description: v.optional(v.string()),
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
