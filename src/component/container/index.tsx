import { ComponentChildren } from 'preact';
import sel from 'purr/sel';

import style from './style.scss';

type ContainerProps = {
  readonly children: ComponentChildren;
  readonly className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return <div className={sel(style.container, className)}>{children}</div>;
}
