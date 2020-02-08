import { track, trigger } from "./effect";

export const ref = (val: any) => {
  return {
    get value() {
      track(ref);
      return val;
    },
    set value(newVal) {
      val = newVal;
      trigger(ref);
    }
  };
};
