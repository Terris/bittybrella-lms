import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getManyFrom } from "./lib/relationships";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";
import { asyncMapWithIndex } from "./lib/utils";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const findById = query({
  args: {
    id: v.id("courseLessons"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const findByCourseId = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await getManyFrom(ctx.db, "courseLessons", "courseId", courseId);
  },
});

export const findByCourseIdWithLessons = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, { courseId }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const courseLessons = await getManyFrom(
      ctx.db,
      "courseLessons",
      "courseId",
      courseId
    );
    const sortedCourseLessons = courseLessons.sort((a, b) => a.order - b.order);
    return await asyncMap(sortedCourseLessons, async (cm) => {
      const lesson = await ctx.db.get(cm.lessonId);
      return { ...cm, lesson };
    });
  },
});

// on the client a user can attach and remove courseLessons
// in one subission
export const updateAllByCourseId = mutation({
  args: {
    courseId: v.id("courses"),
    lessonIds: v.array(v.id("lessons")),
  },
  handler: async (ctx, { courseId, lessonIds }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    // get existing courseLessons
    const existingCourseLessons = await getManyFrom(
      ctx.db,
      "courseLessons",
      "courseId",
      courseId
    );

    const courseLessonsToDelete = existingCourseLessons.filter(
      (cm) => !lessonIds.includes(cm.lessonId)
    );

    const deleteIds = courseLessonsToDelete.map((cm) => cm._id);

    const courseLessonsToKeep = existingCourseLessons
      .filter((cm) => !deleteIds.includes(cm._id))
      .sort((a, b) => a.order - b.order);

    const lastLessonOrder = courseLessonsToKeep.length;

    const courseLessonsToCreate = lessonIds.filter(
      (id) => !existingCourseLessons.find((cm) => cm.lessonId === id)
    );

    // Destroy the course Lessons to delete
    await asyncMap(courseLessonsToDelete, (cm) => ctx.db.delete(cm._id));

    // Update the order of all courseLessons to keep
    await asyncMapWithIndex(courseLessonsToKeep, (cm, index) => {
      return ctx.db.patch(cm._id, { order: index + 1 });
    });

    // Create the courseLessons
    await asyncMapWithIndex(courseLessonsToCreate, (lessonId, index) =>
      ctx.db.insert("courseLessons", {
        courseId,
        lessonId,
        order: lastLessonOrder + index + 1,
      })
    );
    return true;
  },
});

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("courseLessons")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await asyncMapWithIndex(idsInOrder, async (courseLessonId, index) =>
      ctx.db.patch(courseLessonId, {
        order: index + 1,
      })
    );
    return true;
  },
});
