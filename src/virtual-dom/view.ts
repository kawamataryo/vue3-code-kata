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

// 仮想DOMかの判定
function isVNode(node: NodeType): node is VNode {
  return typeof node !== "string" && typeof node !== "number";
}

// イベントAttrかどうかの判定
function isEventAttr(attr: string): boolean {
  // onから始まる属性名はイベントとして扱う
  return /^on/.test(attr);
}

// Attrのセット。イベントの場合はaddEventListenerをセットする
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

enum ChangeType {
  None,
  Type,
  Text,
  Node,
  Value,
  Attr
}

// 仮想DOMの差分検知
function hasChanged(a: NodeType, b: NodeType): ChangeType {
  if (typeof a !== typeof b) {
    return ChangeType.Type;
  }

  if (!isVNode(a) && a !== b) {
    return ChangeType.Text;
  }

  if (isVNode(a) && isVNode(b)) {
    if (a.nodeName !== b.nodeName) {
      return ChangeType.Node;
    }

    if (a.attributes.value !== b.attributes.value) {
      return ChangeType.Value;
    }

    if (JSON.stringify(a.attributes) !== JSON.stringify(b.attributes)) {
      return ChangeType.Attr;
    }
  }

  return ChangeType.None;
}
