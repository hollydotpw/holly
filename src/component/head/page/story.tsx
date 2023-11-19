import { websiteName, baseUrl } from 'constant/main';
import * as cannonical from 'helper/cannonical';

type StoryHeadProps = {
  readonly story: StorySummary;
};

export default function StoryHead({ story }: StoryHeadProps) {
  const title = `${story.title} | ${websiteName}`;

  const canonical = baseUrl + cannonical.story(story);
  const userCanonical = baseUrl + cannonical.user(story.author);
  const isoDate = new Date(story.timestamp).toISOString();

  return (
    <>
      <title>{title}</title>
      <meta property="twitter:card" content="summary" />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={isoDate} />
      <meta property="og:title" content={story.title} />
      <meta property="twitter:title" content={story.title} />
      <meta property="twitter:description" content={story.excerpt} />
      <meta property="og:url" content={canonical} />
      <meta property="al:web:url" content={canonical} />
      <meta property="og:image" content={story.thumbnail} />
      <meta property="og:description" content={story.excerpt} />
      <meta property="article:author" content={userCanonical} />
      <meta property="twitter:image" content={story.thumbnail} />
      <meta name="description" content={story.excerpt} />
      <meta name="author" content={story.author.username} />
      <meta name="title" content={title} />
      <link rel="author" href={userCanonical} />
      <link rel="canonical" href={canonical} />
    </>
  );
}
