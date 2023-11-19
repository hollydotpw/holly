declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}

declare const __PLATFORM__: 'browser' | 'node'; // eslint-disable-line

declare const __DEVELOMENT__: boolean; // eslint-disable-line

declare namespace JSX {
  type Element = preact.JSX.Element;
  type HTMLAttributes = preact.JSX.HTMLAttributes;
}
