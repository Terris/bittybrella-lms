import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const defaultSectionTitle = "Untitled section";

export const get = query({
  args: {
    id: v.id("moduleSections"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    moduleId: v.id("modules"),
    type: v.string(),
  },
  handler: async (ctx, { moduleId, type }) => {
    const existingModule = await ctx.db.get(moduleId);
    if (!existingModule) throw new Error("Module does not exist");
    const existingModuleSections = existingModule.moduleSectionIds ?? [];
    const newModuleSectionId = await ctx.db.insert("moduleSections", {
      moduleId,
      type,
      title: defaultSectionTitle,
      content: "",
    });

    return await ctx.db.patch(moduleId, {
      moduleSectionIds: [...existingModuleSections, newModuleSectionId],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("moduleSections"),
    type: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { id, type, title, content }) => {
    const existingSection = await ctx.db.get(id);
    const newTitle = title?.length
      ? title
      : existingSection?.title.length
      ? existingSection.title
      : defaultSectionTitle;
    await ctx.db.patch(id, {
      type: type || existingSection?.type || "text",
      title: newTitle,
      content: content ?? existingSection?.content,
    });
    return await ctx.db.get(id);
  },
});
