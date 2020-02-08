import { track, trigger } from "./effect";

export function ref(val: any): { value: any } {
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
}
