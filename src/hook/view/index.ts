import { useEffect, useCallback, useContext } from 'preact/hooks';

import { ViewContext } from 'hook/view/provider';
import * as action from 'hook/view/action';

import deepEqual from 'pekoo/deep-equal';
import useAbort from 'hook/abort';
import { Settings, State, ViewContextValue } from './type';
import { FALLBACK_STATE } from './reducer';

function isLoaded<T>(
  state: State<T>,
  newParams: Record<string, unknown>,
): boolean {
  return state?.loaded && deepEqual(state.params, newParams);
}

type UseViewOutput<T> = State<T> & {
  readonly load: (
    overrideParams?: Record<string, unknown>,
    force?: boolean,
  ) => Promise<void>;
};

export default function useView<T>(settings: Settings<T>): UseViewOutput<T> {
  const [state, dispatch] = useContext<ViewContextValue<T>>(ViewContext);

  const currentView = state.get(settings.id) || FALLBACK_STATE;
  const abort = useAbort(settings.id);
  const load = useCallback(
    async (overrideParams?: Record<string, unknown>, force = false) => {
      const params = { ...currentView.params, ...overrideParams };

      if (!force && isLoaded(currentView, params)) {
        return;
      }

      if (!currentView.loading) {
        dispatch(action.loading(settings.id, true));
      }

      try {
        const controller = new AbortController();
        abort.set(controller.abort.bind(controller));

        const data = await settings.loader(params, controller);
        abort.remove();
        dispatch(action.load(settings.id, data, params));
      } catch (e) {
        console.error('userView error', e.toString());
        console.error(e.stack);
        dispatch(action.error(settings.id, e.toString()));
      }
    },
    [settings.id],
  );

  useEffect(() => {
    if (settings.autoload) {
      load();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.id]);

  return { load, ...currentView };
}
