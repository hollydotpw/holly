import { websiteName, description, baseUrl } from 'constant/main';
import { story as storyCannonical } from 'helper/cannonical';

function createFeedItem(story: StorySummary) {
  return `<item>
  <title>${story.title}</title>
  <link>${baseUrl}${storyCannonical(story)}</link>
  <guid>${baseUrl}${storyCannonical(story)}</guid>
  <description>${story.excerpt}</description>
  <pubDate>${new Date(story.timestamp).toISOString()}</pubDate>
</item>`;
}

export default function generateRssFeed(stories: StorySummary[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${websiteName}</title>
    <link>${baseUrl}</link>
    <description>${description}</description>
    ${stories.map(createFeedItem).join('')}
  </channel>
</rss>`;
}
