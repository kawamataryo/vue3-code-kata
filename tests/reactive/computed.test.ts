import { ref } from "../../src/reactive/ref";
import { computed } from "../../src/reactive/computed";

describe("computed", () => {
  test("observe", () => {
    const counter = ref(0);
    const double = computed(() => counter.value * 2);

    expect(double.value).toBe(0);
    counter.value = 5;
    expect(double.value).toBe(10);
  });
});
