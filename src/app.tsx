import { Switch, Route } from 'wouter-preact';

import HomePage from 'page/home';
import StoryPage from 'page/story';
import NotFoundPage from 'page/notfound';

import ViewProvider from 'hook/view/provider';

import Body from 'component/body';

export default function Router(): JSX.Element {
  return (
    <ViewProvider>
      <Body>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/$/:slug" component={StoryPage} />
          <Route path="/not-found" component={NotFoundPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Body>
    </ViewProvider>
  );
}
