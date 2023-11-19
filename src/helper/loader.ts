import list from 'helper/story/list';
import getBody from 'helper/story/get-body';

import { Settings } from 'hook/view/type';

export const homeList: Settings<StorySummary[]> = {
  id: 'home-list',
  loader: list,
  autoload: true,
};

export function storyBody(slug: string): Settings<Story> {
  return {
    id: `story-body-${slug}`,
    loader: (_, abortController) => getBody(slug, abortController),
    autoload: true,
  };
}
