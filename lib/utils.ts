import { QueryCtx } from "../convex/_generated/server";

export async function validateIdentity(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated call to mutation");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error("Unauthenticated call to mutation");
  }

  return { identity, user };
}
