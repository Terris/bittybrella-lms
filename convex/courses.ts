import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { notEmpty } from "../lib/utils";
import { Doc } from "./_generated/dataModel";

export const get = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getWithModules = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    const course = await ctx.db.get(id);
    if (course?.moduleIds === undefined)
      return { ...course, modules: undefined };
    const courseModules = await Promise.all(
      (course?.moduleIds).map((moduleId) => ctx.db.get(moduleId))
    );
    const filteredCourseModules: Doc<"modules">[] =
      courseModules.filter(notEmpty);

    return { ...course, modules: filteredCourseModules };
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").order("desc").take(100);
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
  },
  handler: async (ctx, { id, title, description, isPublished }) => {
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
      isPublished:
        isPublished === undefined ? existingCourse?.isPublished : isPublished,
    });
    return await ctx.db.get(id);
  },
});
