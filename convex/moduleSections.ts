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
    id: v.id("moduleSections"),
  },
  handler: async (ctx, { id }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    return await ctx.db.get(id);
  },
});

export const findByModuleId = query({
  args: {
    moduleId: v.id("modules"),
  },
  handler: async (ctx, { moduleId }) => {
    await validateIdentity(ctx, { requireAdminRole: true });
    const moduleSections = await getManyFrom(
      ctx.db,
      "moduleSections",
      "moduleId",
      moduleId
    );
    return moduleSections.sort((a, b) => a.order - b.order);
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

    const existingModuleSections = await getManyFrom(
      ctx.db,
      "moduleSections",
      "moduleId",
      moduleId
    );

    await ctx.db.insert("moduleSections", {
      moduleId,
      type,
      title: defaultSectionTitle,
      content: "",
      order: existingModuleSections.length + 1,
    });
    return true;
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
    idsInOrder: v.array(v.id("moduleSections")),
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
    return true;
  },
});
