import { baseUrl, websiteName } from 'constant/main';

export default function GlobalHead() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#e6e6e6" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5"
      />
      <meta property="og:locale" content="en-US" />
      <meta property="og:site_name" content={websiteName} />
      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${baseUrl}/data/rss-feed.xml`}
        title={websiteName}
      />
      <link rel="icon" href="/img/favicon.png" />
    </>
  );
}
