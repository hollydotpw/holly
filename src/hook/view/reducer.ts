import { ReducerState, State, ActionType, ActionData } from './type';

export const FALLBACK_STATE = {
  data: null,
  params: {},
  loading: true,
  error: false,
  loaded: false,
};

function merge(
  state: ReducerState,
  action: ActionData,
  add: Partial<State>,
): ReducerState {
  const stateClone = new Map(state);

  stateClone.set(action.name, {
    ...(stateClone.get(action.name) || FALLBACK_STATE),
    ...add,
  });

  return stateClone;
}

export default function reducer(
  state: ReducerState,
  action: ActionData,
): ReducerState {
  switch (action.type) {
    case ActionType.Load:
      return merge(state, action, {
        error: false,
        loaded: true,
        loading: false,
        data: action.data,
        params: action.params,
      });
    case ActionType.Loading:
      return merge(state, action, {
        loading: action.loading,
        ...(action.loading && { error: false }),
      });
    case ActionType.Error:
      return merge(state, action, { error: true, loading: false });
    default:
      return state;
  }
}
