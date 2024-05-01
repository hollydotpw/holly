import convertListToMap from 'pekoo/convert-list-to-map';

import StoryHead from 'component/head/page/story';
import GlobalHead from 'component/head/common/global';
import HomeHead from 'component/head/page/home';

import injectHead from 'helper/inject-head';
import normalizeSummary from 'helper/story/normalize-summary';

import textHeadRender from 'helper/text-head-render';
import NotFoundHead from 'component/head/page/not-found';
import rawArticles from '../static/data/article.json';

const slug2story = convertListToMap(rawArticles.map(normalizeSummary), 'slug');

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.url.endsWith('.map')) {
    return new Response('fuck off', { status: 404 });
  }

  const response = await env.ASSETS.fetch(request);

  if (url.pathname.startsWith('/$/')) {
    const html = await response.text();
    const story = slug2story[url.pathname.replace('/$/', '')];

    return new Response(
      injectHead(
        html,
        textHeadRender(
          <>
            <GlobalHead />
            {story
              ? <StoryHead story={story} />
              : <NotFoundHead />}
          </>,
        ),
      ),
      response,
    );
  }

  if (response.headers.get('content-type')?.includes('text/html')) {
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
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
