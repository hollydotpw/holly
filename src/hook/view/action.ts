import { ActionType, Loading, Load, Error } from './type';

export function loading(name: string, isLoading: boolean): Loading {
  return {
    type: ActionType.Loading,
    name,
    loading: isLoading,
  };
}

export function load(
  name: string,
  data: unknown,
  params: Record<string, unknown>,
): Load {
  return {
    type: ActionType.Load,
    name,
    data,
    params,
  };
}

export function error(name: string, message: string): Error {
  return {
    type: ActionType.Error,
    message,
    name,
  };
}
