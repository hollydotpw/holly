import {
  getAssetFromKV,
  serveSinglePageApp,
} from '@cloudflare/kv-asset-handler';

import convertListToMap from 'purr/convert-list-to-map';

import StoryHead from 'component/head/page/story';
import GlobalHead from 'component/head/common/global';
import HomeHead from 'component/head/page/home';

import injectHead from 'helper/inject-head';
import normalizeSummary from 'helper/story/normalize-summary';

import textHeadRender from 'helper/text-head-render';
import NotFoundHead from 'component/head/page/not-found';
import rawArticles from '../static/data/article.json';

const slug2story = convertListToMap(rawArticles.map(normalizeSummary), 'slug');

type FetchEvent = {
  readonly request: Request;
  readonly waitUntil: () => void;
};

async function handleEvent(event: FetchEvent) {
  const url = new URL(event.request.url);

  if (event.request.url.endsWith('.map')) {
    return new Response('fuck off', { status: 404 });
  }

  try {
    const response = await getAssetFromKV(event, {
      mapRequestToAsset: serveSinglePageApp,
    });

    if (url.pathname.startsWith('/$/')) {
      const html = await response.text();
      const story = slug2story[url.pathname.replace('/$/', '')];

      return new Response(
        injectHead(
          html,
          textHeadRender(
            <>
              <GlobalHead />
              {story ? <StoryHead story={story} /> : <NotFoundHead />}
            </>,
          ),
        ),
        response,
      );
    }
    if (response.headers.get('content-type').includes('text/html')) {
      const html = await response.text();
      return new Response(
        injectHead(
          html,
          textHeadRender(
            <>
              <GlobalHead />
              <HomeHead />
            </>,
          ),
        ),
        response,
      );
    }

    return response;
  } catch (e) {
    return new Response('not found', { status: 404 });
  }
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', (event) => {
  // eslint-disable-next-line
  // @ts-ignore
  event.respondWith(handleEvent(event));
});
