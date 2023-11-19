export default function createShareLinks(url: string) {
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url,
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(url)}`,
  };
}
