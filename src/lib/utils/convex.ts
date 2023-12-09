export function buildArgsWithSkipConditions(
  conditions: boolean[],
  queryArgs: any
) {
  return conditions.some((condition) => condition) ? undefined : queryArgs;
}
