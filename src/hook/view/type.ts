export type Loading = {
  readonly type: ActionType.Loading;
  readonly name: string;

  readonly loading: boolean;
};

export type Load = {
  readonly type: ActionType.Load;
  readonly name: string;

  readonly data: unknown;
  readonly params: Record<string, unknown>;
};

export type Error = {
  readonly type: ActionType.Error;
  readonly name: string;

  readonly message: string;
};

export type ActionData = Loading | Load | Error;

export enum ActionType {
  Load = 0,
  Loading = 1,
  Error = 2,
}

export type State<T = unknown> = {
  readonly data: T;
  readonly params: Record<string, unknown>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: boolean;
};

export type ReducerState<T = unknown> = Map<string, State<T>>;

export type Settings<T, P = Record<string, unknown>> = {
  readonly id: string;
  readonly params?: P;
  readonly loader: (
    params?: P,
    abortController?: AbortController,
  ) => Promise<T>;
  readonly autoload?: boolean;
};

export type ViewContextValue<T> = [ReducerState<T>, (data: ActionData) => void];
