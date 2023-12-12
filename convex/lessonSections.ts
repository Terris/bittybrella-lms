import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMapWithIndex } from "./lib/utils";
import { getManyFrom } from "./lib/relationships";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const findById = query({
  args: {
    id: v.id("lessonSections"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const findByLessonId = query({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, { lessonId }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const lessonSections = await getManyFrom(
      ctx.db,
      "lessonSections",
      "lessonId",
      lessonId
    );
    return lessonSections.sort((a, b) => a.order - b.order);
  },
});

const defaultSectionTitle = "Untitled section";

export const create = mutation({
  args: {
    lessonId: v.id("lessons"),
    type: v.string(),
  },
  handler: async (ctx, { lessonId, type }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const existingLesson = await ctx.db.get(lessonId);
    if (!existingLesson) throw new Error("Lesson does not exist");

    const existingLessonSections = await getManyFrom(
      ctx.db,
      "lessonSections",
      "lessonId",
      lessonId
    );

    await ctx.db.insert("lessonSections", {
      lessonId,
      type,
      title: defaultSectionTitle,
      content: "",
      order: existingLessonSections.length + 1,
    });
    return true;
  },
});

export const update = mutation({
  args: {
    id: v.id("lessonSections"),
    type: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, type, title, content, order }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const existingSection = await ctx.db.get(id);

    if (!existingSection) throw new Error("Section does not exist");

    await ctx.db.patch(id, {
      type: type || existingSection?.type || "text",
      title: title || existingSection?.title || defaultSectionTitle,
      content: content ?? existingSection?.content,
      order: order ?? existingSection?.order,
    });
    return true;
  },
});

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("lessonSections")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await asyncMapWithIndex(idsInOrder, (sectionId, index) =>
      ctx.db.patch(sectionId, {
        order: index + 1,
      })
    );
    return true;
  },
});

export const deleteById = mutation({
  args: { id: v.id("lessonSections") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const sectionToDelete = await ctx.db.get(id);
    if (!sectionToDelete) throw new Error("Section does not exist");
    const sectionToDeleteOrder: number = sectionToDelete.order;

    const sectionsToUpdate = await ctx.db
      .query("lessonSections")
      .filter((q) =>
        q.and(
          q.eq(q.field("lessonId"), sectionToDelete.lessonId),
          q.gt(q.field("order"), sectionToDeleteOrder)
        )
      )
      .collect();

    await asyncMap(sectionsToUpdate, async (section) => {
      await ctx.db.patch(section._id, {
        order: section.order - 1,
      });
    });
    await ctx.db.delete(id);
    return true;
  },
});
