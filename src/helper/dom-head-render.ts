function renderTitle(element: JSX.Element): void {
  document.title = element.props.children;
}

function renderMetaCharSet(element: JSX.Element): void {
  let metaElement = document.querySelector('meta[charset]');

  if (!metaElement) {
    metaElement = document.createElement('meta');
    document.head.prepend(metaElement);
  }

  metaElement.setAttribute('charset', element.props.charSet);
}

function renderMeta(element: JSX.Element): void {
  const mainAttribute = element.props.property ? 'property' : 'name';

  let metaElement = document.querySelector(
    `meta[${mainAttribute}='${element.props[mainAttribute]}']`,
  );

  if (!metaElement) {
    metaElement = document.createElement('meta');
    metaElement.setAttribute(mainAttribute, element.props[mainAttribute]);
    document.head.prepend(metaElement);
  }

  metaElement.setAttribute('content', element.props.content);
}

function renderLink(element: JSX.Element): void {
  let linkElement = document.querySelector(`link[rel='${element.props.rel}']`);

  if (!linkElement) {
    linkElement = document.createElement('link');
    linkElement.setAttribute('rel', element.props.rel);
    document.head.prepend(linkElement);
  }

  linkElement.setAttribute('href', element.props.href);
}

// TODO: garbage collect old tags
export default function domHeadRender(element: JSX.Element): void {
  switch (element.type) {
    case 'title':
      return renderTitle(element);
    case 'meta':
      return element.props.charSet
        ? renderMetaCharSet(element)
        : renderMeta(element);
    case 'link':
      return renderLink(element);
    default:
      if (element.props.children) {
        return element.props.children.forEach(domHeadRender);
      }

      // traverse whats left
      if (typeof element.type === 'function') {
        // eslint-disable-next-line
        // @ts-ignore
        const renderedElement = element.type(element.props);

        return domHeadRender(renderedElement);
      }

      throw new Error('non-renderable element');
  }
}
