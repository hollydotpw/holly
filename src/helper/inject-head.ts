const header = '<!-- INJECT START -->';
const footer = '<!-- INJECT END -->';

export default function injectHead(from: string, to: string) {
  return from.replace(
    new RegExp(`${header}[\\s\\S]+${footer}`),
    `${header}${to}${footer}`,
  );
}
