import NotFoundHead from 'component/head/page/not-found';
import Head from 'component/head';

import style from './style.scss';

export default function NotFound() {
  return (
    <>
      <Head>
        <NotFoundHead />
      </Head>
      <div className={style.notfound}>
        <h1>Not found</h1>
        <div>Nothing to see here.</div>
      </div>
    </>
  );
}
