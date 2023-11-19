import { useCallback } from 'preact/hooks';
import openInWindow from 'purr/open-in-windows';
import createShare from 'purr/share';
import style from './style.scss';

type FooterProps = {
  readonly story: Story;
};

export default function Footer({ story }: FooterProps) {
  const social = createShare(window.location.href);
  const email = `mailto:?subject=${encodeURIComponent(
    `Look at this cool story: ${story.title}`,
  )}&body=${encodeURIComponent(window.location.href)}`;

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  }, []);

  if (story.tags?.includes('section')) {
    return <div className={style.space} />;
  }

  return (
    <div className={style.footer}>
      Feel free to share this story
      <div className={style.social}>
        <img
          src="/img/icon/balloon-facebook.png"
          alt="Share on Facebook"
          title="Share on Facebook"
          aria-hidden="true"
          onClick={() => openInWindow(social.facebook)}
        />
        <img
          src="/img/icon/balloon-twitter.png"
          alt="Share on Twitter"
          title="Share on Twitter"
          aria-hidden="true"
          onClick={() => openInWindow(social.twitter)}
        />
        <img
          src="/img/icon/globe-green.png"
          alt="Copy link"
          title="Copy link"
          aria-hidden="true"
          onClick={copyLink}
        />
        <a href={email}>
          <img
            src="/img/icon/mail-air.png"
            alt="Email it"
            title="Email it"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
