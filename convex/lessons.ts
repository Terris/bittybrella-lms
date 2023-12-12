import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "convex-helpers";
import { getAll } from "./lib/relationships";
import { validateIdentity } from "./lib/authorization";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("lessons").collect();
  },
});

export const findById = query({
  args: {
    id: v.id("lessons"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const findManyById = query({
  args: {
    ids: v.array(v.id("lessons")),
  },
  handler: async (ctx, { ids }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await getAll(ctx.db, ids);
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
    await ctx.db.insert("lessons", {
      title,
      description,
      isPublished,
    });
    return true;
  },
});

export const update = mutation({
  args: {
    id: v.id("lessons"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, title, description, isPublished }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const existingCourse = await ctx.db.get(id);
    await ctx.db.patch(id, {
      title: title ?? existingCourse?.title,
      description: description ?? existingCourse?.description,
      isPublished: isPublished ?? existingCourse?.isPublished,
    });
    return true;
  },
});

export const deleteById = mutation({
  args: { id: v.id("lessons") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const lessonToDelete = await ctx.db.get(id);
    if (!lessonToDelete) throw new Error("Lesson does not exist");

    // Delete all lesson sections
    const lessonSectionsToDelete = await ctx.db
      .query("lessonSections")
      .filter((q) => q.eq(q.field("lessonId"), lessonToDelete._id))
      .collect();

    await asyncMap(lessonSectionsToDelete, async (section) => {
      await ctx.db.delete(section._id);
    });

    // Update order of courseLessons for every course that uses this lesson
    const relatedCourseLessons = await ctx.db
      .query("courseLessons")
      .filter((q) => q.eq(q.field("lessonId"), lessonToDelete._id))
      .collect();
    // == creat a map of courses to update
    const relatedCourseLessonUpdateMap = relatedCourseLessons.map((cm) => ({
      courseId: cm.courseId,
      order: cm.order,
    }));
    // ==== for every mapped course, update all its courseLesson order fields
    await asyncMap(relatedCourseLessonUpdateMap, async (courseMapItem) => {
      // we only need to update order fields that are greater than the deleted lesson's order field
      const courseLessonsToReOrder = await ctx.db
        .query("courseLessons")
        .filter((q) =>
          q.and(
            q.eq(q.field("courseId"), courseMapItem.courseId),
            q.gt(q.field("order"), courseMapItem.order) //gt = greaterThan
          )
        )
        .collect();
      // update the order field for each resulting courseLesson
      await asyncMap(courseLessonsToReOrder, async (cm) => {
        await ctx.db.patch(cm._id, {
          order: cm.order - 1,
        });
      });
    });

    // delete all courseLessons related by lessonId
    await asyncMap(relatedCourseLessons, async (cm) => {
      await ctx.db.delete(cm._id);
    });

    // Finally, delete the lesson
    await ctx.db.delete(id);
    return true;
  },
});
