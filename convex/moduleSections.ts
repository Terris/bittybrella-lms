import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { removeEmptyFromArray } from "./lib/utils";
import { asyncMap, getManyFrom } from "./lib/relationships";

/* PUBLIC 
======================================= */

/* ADMIN ONLY
======================================= */

export const findById = query({
  args: {
    id: v.id("moduleSections"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

const defaultSectionTitle = "Untitled section";
export const create = mutation({
  args: {
    moduleId: v.id("modules"),
    type: v.string(),
  },
  handler: async (ctx, { moduleId, type }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const existingModule = await ctx.db.get(moduleId);
    if (!existingModule) throw new Error("Module does not exist");

    const existingModuleSections = removeEmptyFromArray(
      await getManyFrom(ctx.db, "moduleSections", "moduleId", moduleId)
    );

    return await ctx.db.insert("moduleSections", {
      moduleId,
      type,
      title: defaultSectionTitle,
      content: "",
      order: existingModuleSections.length + 1,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("moduleSections"),
    type: v.optional(v.string()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, type, title, content, order }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const existingSection = await ctx.db.get(id);
    await ctx.db.patch(id, {
      type: type || existingSection?.type || "text",
      title: title || existingSection?.title || defaultSectionTitle,
      content: content ?? existingSection?.content,
      order: order ?? existingSection?.order,
    });
    return await ctx.db.get(id);
  },
});

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("moduleSections")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    await Promise.all(
      idsInOrder.map((sectionId, index) =>
        ctx.db.patch(sectionId, {
          order: index + 1,
        })
      )
    );
  },
});

export const deleteById = mutation({
  args: { id: v.id("moduleSections") },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });

    const sectionToDelete = await ctx.db.get(id);
    if (!sectionToDelete) throw new Error("Section does not exist");
    const sectionToDeleteOrder: number = sectionToDelete.order;

    const sectionsToUpdate = await ctx.db
      .query("moduleSections")
      .filter((q) =>
        q.and(
          q.eq(q.field("moduleId"), sectionToDelete.moduleId),
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
  },
});
