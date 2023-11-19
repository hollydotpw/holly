import useView from 'hook/view';
import { homeList } from 'helper/loader';

import Container from 'component/container';
import Head from 'component/head';

import HomeHead from 'component/head/page/home';
import Loading from 'page/loading';
import Story from './story';

import style from './style.scss';

export default function Home() {
  const { data: stories, loaded, loading } = useView<StorySummary[]>(homeList);
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <HomeHead />
      </Head>

      <Container className={style.container}>
        {loaded && stories.map((data) => <Story key={data.slug} data={data} />)}
      </Container>
    </>
  );
}
