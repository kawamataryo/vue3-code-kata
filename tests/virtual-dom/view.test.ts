import { createElement, h } from "../../src/virtual-dom/view";

describe("view", () => {
  describe("h", () => {
    test("one node", () => {
      expect(h("div", { id: "app" }, "hello")).toEqual({
        nodeName: "div",
        attributes: { id: "app" },
        children: ["hello"]
      });
    });
    test("deep node", () => {
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

  describe("createElement", () => {
    test("one node", () => {
      const vnode = h("div", { id: "app" }, "hello");

      const expectNode = document.createElement("div");
      expectNode.setAttribute("id", "app");
      expectNode.appendChild(document.createTextNode("hello"));

      expect(createElement(vnode)).toEqual(expectNode);
    });

    test("deep node", () => {
      const vnode = h("div", { id: "app" }, h("p", { type: "button" }, "ok"));

      const expectNodeDiv = document.createElement("div");
      expectNodeDiv.setAttribute("id", "app");
      const expectNodeP = document.createElement("p");
      expectNodeP.setAttribute("type", "button");
      expectNodeP.appendChild(document.createTextNode("ok"));
      expectNodeDiv.appendChild(expectNodeP);

      expect(createElement(vnode)).toEqual(expectNodeDiv);
    });

    test("has event node", () => {
      const vnode = h(
        "div",
        { id: "app" },
        h("button", { onClick: () => console.log("ok"), type: "button" }, "ok")
      );

      const expectNodeDiv = document.createElement("div");
      expectNodeDiv.setAttribute("id", "app");
      const expectNodeButton = document.createElement("button");
      expectNodeButton.setAttribute("type", "button");
      expectNodeButton.addEventListener("click", () => console.log("ok"));
      expectNodeButton.appendChild(document.createTextNode("ok"));
      expectNodeDiv.appendChild(expectNodeButton);

      expect(createElement(vnode)).toEqual(expectNodeDiv);
    });
  });
});
