import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { validateIdentity } from "./lib/utils";

export const updateOrder = mutation({
  args: {
    idsInOrder: v.array(v.id("courseModules")),
  },
  handler: async (ctx, { idsInOrder }) => {
    await validateIdentity(ctx);

    await Promise.all(
      idsInOrder.map((courseModuleId, index) =>
        ctx.db.patch(courseModuleId, {
          order: index + 1,
        })
      )
    );
  },
});
