import StoryHead from 'component/head/page/story';

import useView from 'hook/view';
import { storyBody } from 'helper/loader';

import Container from 'component/container';
import Head from 'component/head';

import NotFound from 'page/notfound';
import Loading from 'page/loading';

import { ago } from 'pekoo/ago';
import Label from 'component/label';
import Body from './body';
import Footer from './footer';

import style from './style.scss';

type StoryPageProps = {
  readonly params: {
    readonly slug: string;
  };
};

export default function StoryPage({ params }: StoryPageProps) {
  const {
    data: story,
    loading,
    error,
  } = useView<Story>(storyBody(params.slug));

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Head>
        <StoryHead story={story} />
      </Head>
      <Container className={style.container}>
        <div className={style.title}>{story.title}</div>
        {!story.tags?.includes('wip') && !story.tags?.includes('section') && (
          <div className={style.info}>
            <div className={style.user}>
              <span className={style.by}>by</span>
              <span className={style.username}>{story.author.username}</span>
              <time
                className={style.timestamp}
                dateTime={new Date(story.timestamp).toISOString()}
              >
                {ago(new Date(story.timestamp), new Date())}
              </time>
            </div>
            <div className={style.labels}>
              <Label
                text={story.category.name}
                image={`/img/icon/${story.category.icon}.png`}
              />
            </div>
          </div>
        )}
        <Body
          data={
            story.tags?.includes('wip')
              ? 'Work in progress. Come back later.\n\n![Agarrando la pala](/img/random/dig-soil.gif)'
              : story.body
          }
        />

        <Footer story={story} />
      </Container>
    </>
  );
}
