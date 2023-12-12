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
    return await ctx.db.query("modules").collect();
  },
});

export const findById = query({
  args: {
    id: v.id("modules"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const findManyById = query({
  args: {
    ids: v.array(v.id("modules")),
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
    await ctx.db.insert("modules", {
      title,
      description,
      isPublished,
    });
    return true;
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
  args: { id: v.id("modules") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const moduleToDelete = await ctx.db.get(id);
    if (!moduleToDelete) throw new Error("Section does not exist");

    // Delete all module sections
    const sectionsToDelete = await ctx.db
      .query("moduleSections")
      .filter((q) => q.eq(q.field("moduleId"), moduleToDelete._id))
      .collect();

    await asyncMap(sectionsToDelete, async (section) => {
      await ctx.db.delete(section._id);
    });

    // Update order of courseModules for every related course
    const relatedCourseModules = await ctx.db
      .query("courseModules")
      .filter((q) => q.eq(q.field("moduleId"), moduleToDelete._id))
      .collect();

    const relatedCourseModuleUpdateMap = relatedCourseModules.map((cm) => ({
      courseId: cm.courseId,
      order: cm.order,
    }));

    // for every course, update all its courseModule order fields
    await asyncMap(relatedCourseModuleUpdateMap, async (cm) => {
      const courseModulesToReOrder = await ctx.db
        .query("courseModules")
        .filter((q) =>
          q.and(
            q.eq(q.field("courseId"), cm.courseId),
            q.gt(q.field("order"), cm.order)
          )
        )
        .collect();
      await asyncMap(courseModulesToReOrder, async (cm) => {
        await ctx.db.patch(cm._id, {
          order: cm.order - 1,
        });
      });
    });

    // delete all courseModules related by moduleId
    await asyncMap(relatedCourseModules, async (cm) => {
      await ctx.db.delete(cm._id);
    });

    // Finally, delete the module
    await ctx.db.delete(id);
    return true;
  },
});
