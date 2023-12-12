import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { getManyFrom, getManyVia } from "./lib/relationships";
import { validateIdentity } from "./lib/authorization";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("courses").collect();
  },
});

export const findById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, { title, description, isPublished }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
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
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
      isPublished:
        isPublished === undefined ? existingCourse?.isPublished : isPublished,
    });
    return true;
  },
});

export const deleteById = mutation({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const sectionToDelete = await ctx.db.get(id);
    if (!sectionToDelete) throw new Error("Course does not exist");

    // Delete all related courseLessons
    const courseLessonsToDelete = await ctx.db
      .query("courseLessons")
      .filter((q) => q.eq(q.field("courseId"), id))
      .collect();

    await asyncMap(courseLessonsToDelete, async (courseLesson) => {
      await ctx.db.delete(courseLesson._id);
    });

    // Finally, delete course
    await ctx.db.delete(id);
    return true;
  },
});
