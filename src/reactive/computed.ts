import { effect } from "./effect";

export const computed = <T = any>(getter: () => T): { value: T } => {
  let value: T;
  effect(() => {
    value = getter();
  });

  return {
    get value(): T {
      return value;
    }
  };
};
