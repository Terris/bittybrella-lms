import { QueryCtx } from "../_generated/server";

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

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function removeEmptyFromArray<TValue>(
  arr: (TValue | null | undefined)[]
) {
  return arr.filter(notEmpty);
}