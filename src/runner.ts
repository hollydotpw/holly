import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import parseSummary from 'helper/story/parse-summary';
import normalizeSummary from 'helper/story/normalize-summary';

import generateRssFeed from 'runner/rss';

const articlePath = './static/data/article';
const articleFiles = readdirSync(articlePath);

const out = articleFiles
  .map((articleFile) => normalizeSummary(
    parseSummary(readFileSync(resolve(articlePath, articleFile), 'utf-8')),
  ))
  .filter((article) => !article.tags?.includes('section'))
  .sort((articleA, articleB) => articleB.id - articleA.id);

writeFileSync('./static/data/article.json', JSON.stringify(out));
writeFileSync('./static/data/rss-feed.xml', generateRssFeed(out));

console.log('Static files generated!');
