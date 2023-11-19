import { useCallback, useState } from 'preact/hooks';

import MenuIcon from 'component/svg/menu-icon';
import CloseIcon from 'component/svg/close-icon';

import Container from 'component/container';
import Link from 'component/link';

import style from './style.scss';
/*

      <Link href="/$/portfolio">Portfolio</Link>
      <Link href="/$/resume">Resume</Link>
*/

function Nav() {
  return (
    <>
      <Link href="/$/contact">Contact</Link>
      <a href="/data/rss-feed.xml">RSS</a>
    </>
  );
}

export default function Header(): JSX.Element {
  const [isNavOpen, setNavOpen] = useState(false);
  const toggleTabs = useCallback(() => setNavOpen((_) => !_), []);

  return (
    <>
      {isNavOpen && (
        <div
          className={style.tabs}
          onClick={toggleTabs}
          role="button"
          aria-hidden="true"
        >
          <Nav />
        </div>
      )}
      <header className={style.header}>
        <Container className={style.inside}>
          <Link className={style.logo} href="/">
            <img src="/img/logo.svg" alt="Holly" />
          </Link>
          <div
            className={style.open}
            onClick={toggleTabs}
            role="button"
            aria-hidden="true"
          >
            {isNavOpen ? <CloseIcon /> : <MenuIcon />}
          </div>

          <nav className={style.nav}>
            <Nav />
          </nav>
        </Container>
      </header>
    </>
  );
}
