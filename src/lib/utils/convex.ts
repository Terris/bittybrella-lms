export function skipOrBuildArgs(skipConditions: boolean[], queryArgs: any) {
  return skipConditions.some((condition) => condition) ? undefined : queryArgs;
}
