import { ComponentChildren } from 'preact';
import { Link as WouterLink } from 'wouter-preact';

type LinkProps = {
  readonly children: ComponentChildren;
  readonly href: string;
  readonly className?: string;
};

export default function Link({ children, href, className }: LinkProps) {
  return (
    <WouterLink href={href}>
      <a href={href} className={className}>
        {children}
      </a>
    </WouterLink>
  );
}
