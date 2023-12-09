export function skipWithConditions(conditions: boolean[], queryArgs: any) {
  return conditions.some((condition) => condition) ? undefined : queryArgs;
}
