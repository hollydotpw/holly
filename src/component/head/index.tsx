import { useEffect } from 'preact/hooks';
import domHeadRender from 'helper/dom-head-render';
import { ComponentChildren } from 'preact';
import GlobalHead from 'component/head/common/global';

type HeadProps = {
  readonly children: ComponentChildren;
};

export default function Head({ children }: HeadProps) {
  useEffect(() => {
    domHeadRender(
      <>
        <GlobalHead />
        {children}
      </>,
    );
  }, [children]);

  return null;
}
