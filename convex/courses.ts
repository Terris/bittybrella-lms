import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap, getManyFrom, getManyVia } from "./lib/relationships";
import { notEmpty, removeEmptyFromArray } from "./lib/utils";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").order("desc").take(100);
  },
});

export const get = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const course = await ctx.db.get(id);
    const modules = removeEmptyFromArray(
      await getManyVia(ctx.db, "courseModules", "moduleId", "courseId", id)
    );
    const modulesWithSections = await asyncMap(modules, async (module) => {
      const sections = removeEmptyFromArray(
        await getManyFrom(ctx.db, "moduleSections", "moduleId", module._id)
      );
      return { ...module, sections };
    });
    return { ...course, modules: modulesWithSections };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, { title, description, isPublished }) => {
    return await ctx.db.insert("courses", {
      title,
      description,
      isPublished,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("courses"),
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
    moduleIds: v.optional(v.array(v.id("modules"))),
  },
  handler: async (ctx, { id, title, description, isPublished, moduleIds }) => {
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
      isPublished:
        isPublished === undefined ? existingCourse?.isPublished : isPublished,
    });
    // TODO: update courseModule docs
    return await ctx.db.get(id);
  },
});
