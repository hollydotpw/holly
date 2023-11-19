export default async function get<T>(
  endpoint: string,
  response: 'json' | 'text' = 'json',
  abortController?: AbortController,
): Promise<T> {
  const request = await fetch(endpoint, { signal: abortController?.signal });

  const parsed = await request[response]();

  return parsed as T;
}
