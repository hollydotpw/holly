import { ComponentChildren, createContext } from 'preact';
import { useMemo, useReducer } from 'preact/hooks';

import reducer from '../reducer';
import { ActionData, ReducerState } from '../type';

export const ViewContext = createContext(null);

type ViewProviderProps = {
  readonly children: ComponentChildren;
};

export default function ViewProvider({ children }: ViewProviderProps) {
  const [state, dispatch] = useReducer<ReducerState, ActionData>(
    reducer,
    new Map(),
  );

  const value = useMemo(() => [state, dispatch], [state]);

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}
