import get from 'helper/get';
import parseSummary from './parse-summary';
import normalizeSummary from './normalize-summary';

const SHOW_SECRETS_HASHBANG = '#showsecrets';

export default async function getBody(
  slug: string,
  abortController?: AbortController,
): Promise<Story> {
  const body = await get<string>(
    `/data/article/${slug}.md`,
    'text',
    abortController,
  );

  const summary = normalizeSummary(parseSummary(body));

  const showSecrets = window.location.hash === SHOW_SECRETS_HASHBANG;

  return {
    ...summary,
    body,
    tags:
      showSecrets && summary.tags.includes('wip')
        ? summary.tags.filter((tag) => tag !== 'wip')
        : summary.tags,
  };
}
