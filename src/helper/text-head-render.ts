import escapeHtml from 'purr/escape-html';

export default function textHeadRender(element: JSX.Element): string {
  if (Array.isArray(element)) {
    return Array.from(element).map(textHeadRender).join('');
  }

  if (typeof element === 'string') {
    return escapeHtml(element);
  }

  if (typeof element.type === 'string') {
    let component = `<${element.type}`;

    const propsEntries = Object.entries(element.props).filter(
      ([key]) => key !== 'children',
    );

    if (propsEntries.length) {
      const props = propsEntries
        .map(([key, value]) => `${key.toLowerCase()}="${escapeHtml(value)}" `)
        .join('');

      component += ` ${props}`;
    }

    if (element.props.children) {
      return `${component}>${textHeadRender(element.props.children)}</${
        element.type
      }>`;
    }

    return `${component}/>`;
  }

  if (typeof element.type === 'function') {
    // eslint-disable-next-line
    // @ts-ignore
    const renderedElement = element.type(element.props);

    return textHeadRender(renderedElement);
  }

  throw new Error('non-renderable element');
}
