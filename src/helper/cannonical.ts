export function story(data: StorySummary): string {
  return `/$/${data.slug}`;
}

export function user(data: UserSummary): string {
  return `/@${data.username}`;
}
