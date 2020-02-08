import { h } from "../../src/virtual-dom/view";

describe("view", () => {
  test("h oneNode", () => {
    expect(h("div", { id: "app" }, "hello")).toEqual({
      nodeName: "div",
      attributes: { id: "app" },
      children: ["hello"]
    });
  });
  test("h deepNode", () => {
    expect(
      h("div", { id: "app" }, h("p", { type: "button" }, h("span", {}, "ok")))
    ).toEqual({
      nodeName: "div",
      attributes: { id: "app" },
      children: [
        {
          nodeName: "p",
          attributes: { type: "button" },
          children: [
            {
              nodeName: "span",
              attributes: {},
              children: ["ok"]
            }
          ]
        }
      ]
    });
  });
});
