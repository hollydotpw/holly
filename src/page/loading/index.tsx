import { useEffect, useState } from 'preact/hooks';

import Container from 'component/container';
import style from './style.scss';

const icons = [
  'cookie',
  'hamburger',
  'flask',
  'holly',
  'popcorn',
  'pill',
  'poop',
  'crown',
  'money',

  /* 'android',
  'disc',
  'money-bag-dollar',
  'animal-penguin',
  'disk',
  'money-coin',
  'balloon-facebook',
  'feed',
  'balloon-twitter',
  'newspaper',
  'bamboo',
  'globe-green',
  'new-text',
  'bank',
  'hamburger',
  'oil-barrel',
  'beaker',
  'box',
  'ice',
  'playing-card',
  'briefcase',
  'layers',
  'computer',
  'magnet-blue',
  'popcorn',
  'controller',
  'magnet',
  'processor-bit-128',
  'magnifier',
  'system-monitor',
  'credit-card',
  'mail-air',
  'traffic-cone',
  'megaphone',
  'wand', */
];

export default function Loading() {
  const [icon, setIcon] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIcon((i) => (i === icons.length - 1 ? 0 : i + 1));
    }, 800);

    return () => clearInterval(id);
  }, []);

  return (
    <Container className={style.loading}>
      <img src={`/img/icon/${icons[icon]}.png`} alt="icon" />
      Loading...
    </Container>
  );
}
