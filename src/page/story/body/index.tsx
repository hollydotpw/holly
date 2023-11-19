import { h } from 'preact';

import twitchdown from 'vendor/twitchdown';
import Code from '../code';

import style from './style.scss';

function Emoji([name]) {
  return (
    <img src={`/img/emoji/${name}.gif`} className={style.emoji} alt={name} />
  );
}

function createBody(markdown: string): JSX.Element[] {
  const result = twitchdown(markdown, {
    parseArguments: true,
    paragraphs: true,
    headingIds: true,
    openExternalInNewWindow: true,
    createElement: h,
    customTags: {
      emoji: {
        handler: Emoji,
        // If set, this will override the global `tagsInParagraph` option
        inParagraph: true,
        // If set, this will override the global `parseArguments` option
        parseArguments: false,
      },
    },
    highlight: (code: string, language: string) =>
      h(Code, {
        code,
        language,
      }),
  });

  return result.map((component: JSX.Element, i: number) => {
    const beforeType = result[i - 1]?.type?.toString();

    return {
      ...component,
      props: {
        ...component.props,
        ...((beforeType?.startsWith('h') ||
          (beforeType === 'p' && component.type === 'ul')) && {
          className: beforeType,
        }),
      },
    };
  });
}

type BodyProps = {
  readonly data: string;
};

export default function Body({ data }: BodyProps) {
  return <div className={style.body}>{createBody(data)}</div>;
}
