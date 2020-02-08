type NodeType = VNode | string | number;
type Attributes = { [key: string]: string | Function };

export interface View<State, Actions> {
  (state: State, actions: Actions): VNode;
}

export interface VNode {
  nodeName: keyof HTMLElementTagNameMap;
  attributes: Attributes;
  children: NodeType[];
}

// 仮想DOMを作る
export function h(
  nodeName: keyof HTMLElementTagNameMap,
  attributes: Attributes,
  ...children: NodeType[]
): VNode {
  return { nodeName, attributes, children };
}

function isVNode(node: NodeType): node is VNode {
  return typeof node !== "string" && typeof node !== "number";
}

function isEventAttr(attr: string): boolean {
  // onから始まる属性名はイベントとして扱う
  return /^on/.test(attr);
}

function setAttributes(target: HTMLElement, attrs: Attributes): void {
  for (const attr in attrs) {
    if (isEventAttr(attr)) {
      const eventName = attr.slice(2);
      target.addEventListener(eventName, attrs[attr] as EventListener);
    } else {
      target.setAttribute(attr, attrs[attr] as string);
    }
  }
}


// リアルDOMを生成する
export function createElement(node: NodeType): HTMLElement | Text {
  if (!isVNode(node)) {
    return document.createTextNode(node.toString());
  }

  const el = document.createElement(node.nodeName);
  setAttributes(el, node.attributes);
  node.children.forEach(child => el.appendChild(createElement(child)));

  return el;
}
