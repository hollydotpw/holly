import {
  baseUrl,
  websiteName,
  description,
  keyWords,
  ogImage,
} from 'constant/main';

export default function HomeHead() {
  return (
    <>
      <title>{websiteName}</title>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:keywords" content={keyWords} />
      <meta property="og:title" content="Homepage" />
      <meta property="og:image" content={ogImage} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
    </>
  );
}
