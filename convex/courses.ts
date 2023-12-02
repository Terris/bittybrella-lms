import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap, getManyFrom, getManyVia } from "./lib/relationships";
import { removeEmptyFromArray } from "./lib/utils";
import { validateIdentity } from "./lib/authorization";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const all = query({
  args: {},
  handler: async (ctx) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.query("courses").order("desc").take(100);
  },
});

export const findById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const course = await ctx.db.get(id);

    const courseModules = removeEmptyFromArray(
      await getManyFrom(ctx.db, "courseModules", "courseId", id)
    );

    const modules = removeEmptyFromArray(
      await getManyVia(ctx.db, "courseModules", "moduleId", "courseId", id)
    );

    const modulesWithSections = await asyncMap(modules, async (module) => {
      const moduleCourseModule = courseModules.find(
        (mcm) => mcm.moduleId === module._id
      );
      if (!moduleCourseModule) {
        throw new Error("Could not find moduleCourseModule");
      }
      const sections = removeEmptyFromArray(
        await getManyFrom(ctx.db, "moduleSections", "moduleId", module._id)
      );
      return {
        ...module,
        sections,
        order: moduleCourseModule.order,
        courseModuleId: moduleCourseModule._id,
      };
    });
    return {
      ...course,
      something: "test",
      modules: modulesWithSections.sort((a, b) => a.order - b.order),
    };
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
    return await ctx.db.get(id);
  },
});
