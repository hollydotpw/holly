import { useEffect } from 'preact/hooks';

type Abortion = () => void;

const abortStack = new Map<string, Abortion>();

export default function useAbort(name: string) {
  useEffect(
    () => () => {
      const kill = abortStack.get(name);
      if (!kill) {
        return;
      }

      kill();

      abortStack.delete(name);
    },
    [name],
  );

  return {
    set: (data: Abortion) => abortStack.set(name, data),
    remove: () => abortStack.delete(name),
  };
}
