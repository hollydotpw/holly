import { websiteName } from 'constant/main';
import TitleHead from '../common/title';

export default function NotFoundHead(): JSX.Element {
  const title = `Not Found | ${websiteName}`;

  return <TitleHead title={title} />;
}
