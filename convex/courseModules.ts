import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { removeEmptyFromArray } from "./lib/utils";
import { getManyFrom } from "./lib/relationships";
import { validateIdentity } from "./lib/authorization";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const findById = query({
  args: {
    id: v.id("courseModules"),
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
    return removeEmptyFromArray(
      await getManyFrom(ctx.db, "courseModules", "courseId", courseId)
    );
  },
});

export const updateAllByCourseId = mutation({
  args: {
    courseId: v.id("courses"),
    moduleIds: v.array(v.id("modules")),
  },
  handler: async (ctx, { courseId, moduleIds }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    // get existing courseModules
    const existingCourseModules = removeEmptyFromArray(
      await getManyFrom(ctx.db, "courseModules", "courseId", courseId)
    );

    const courseModulesToDelete = existingCourseModules.filter(
      (cm) => !moduleIds.includes(cm.moduleId)
    );
    const deleteIds = courseModulesToDelete.map((cm) => cm._id);
    const courseModulesToKeep = existingCourseModules
      .filter((cm) => !deleteIds.includes(cm._id))
      .sort((a, b) => a.order - b.order);

    const lastModuleOrder = courseModulesToKeep.length;

    const courseModulesToCreate = moduleIds.filter(
      (id) => !existingCourseModules.find((cm) => cm.moduleId === id)
    );

    // Destroy the course modules to delete
    await Promise.all(courseModulesToDelete.map((cm) => ctx.db.delete(cm._id)));

    // Update the order of all courseModules to keep
    await Promise.all(
      courseModulesToKeep.map((cm, index) =>
        ctx.db.patch(cm._id, { order: index + 1 })
      )
    );

    await Promise.all(
      courseModulesToCreate.map((moduleId, index) =>
        ctx.db.insert("courseModules", {
          courseId,
          moduleId,
          order: lastModuleOrder + index + 1,
        })
      )
    );
    return true;
  },
});

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("courseModules")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await Promise.all(
      idsInOrder.map((courseModuleId, index) =>
        ctx.db.patch(courseModuleId, {
          order: index + 1,
        })
      )
    );
    return true;
  },
});
