import categories from 'constant/data/category';
import authors from 'constant/data/author';

import slugify from 'pekoo/slugify';

export default function normalizeSummary(story: StoryRaw): StorySummary {
  return {
    ...story,
    author: authors[story.authorId],
    category: categories[story.categoryId],
    slug: slugify(story.title),
  };
}
