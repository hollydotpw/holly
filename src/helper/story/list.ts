import get from 'helper/get';
import normalizeSummary from './normalize-summary';

export default async function list(
  _,
  abortController?: AbortController,
): Promise<StorySummary[]> {
  const data = await get<StoryRaw[]>(
    '/data/article.json',
    'json',
    abortController,
  );

  return data.map(normalizeSummary);
}

// export const slug2story = convertListToMap(stories, 'slug');
