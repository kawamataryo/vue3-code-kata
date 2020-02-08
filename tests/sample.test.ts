import { add } from "../src/sample";

describe("sample", () => {
  test("add", () => {
    expect(add(1, 2)).toBe(3);
  });
});
