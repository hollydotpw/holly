import Label from 'component/label';
import Link from 'component/link';
import { story as storyCannonical } from 'helper/cannonical';
import { agoBigword } from 'purr/ago';

import style from './style.scss';

type StoryProps = {
  readonly data: StorySummary;
};

export default function Story({ data }: StoryProps) {
  const { thumbnail, title, excerpt, timestamp, category, author, tags } = data;

  return (
    <article className={style.story}>
      <Link href={storyCannonical(data)} className={style.thumbnail}>
        <img src={thumbnail} alt={title} />
      </Link>
      <div className={style.other}>
        <div className={style.title}>
          <Link href={storyCannonical(data)}>{title}</Link>
        </div>
        <div className={style.body}>{excerpt}</div>
        <div className={style.footer}>
          <div className={style.user}>
            <span className={style.by}>by</span>
            <span className={style.username}>{author.username}</span>
            <time
              className={style.timestamp}
              dateTime={new Date(timestamp).toISOString()}
            >
              {agoBigword(timestamp)}
            </time>
          </div>
          <div className={style.labels}>
            {tags?.includes('wip') && (
              <Label
                className={style.wip}
                text="wip"
                image="/img/icon/traffic-cone.png"
              />
            )}
            <Label
              text={category.name}
              image={`/img/icon/${category.icon}.png`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
