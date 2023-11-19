import { ComponentChildren } from 'preact';

import Header from 'component/header';

import style from './styles.scss';

type BodyProps = {
  readonly children: ComponentChildren;
};

export default function Body({ children }: BodyProps) {
  return (
    <>
      <Header />
      <div className={style.body}>{children}</div>
    </>
  );
}
