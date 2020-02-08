import { ref } from "../src/ref";
import { effect } from "../src/effect";

describe("ref and effect", () => {
  test("ref and effect", () => {
    const counter = ref(0);

    let double = 0;
    effect(() => {
      double = counter.value * 2;
    });

    expect(double).toBe(0);
    counter.value = 5;
    expect(double).toBe(10);
  });
});
