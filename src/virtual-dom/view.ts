type NodeType = VNode | string | number;
type Attributes = { [key: string]: string | Function };

/* -----------------------------------------
Viewでやっていること
- 仮想DOMを作る関数の定義 #h
- 仮想DOMを受け取ってリアルDOMを作る関数の定義 #createElement
- 仮想DOMの差分を検知する関数の定義 #hasChanged
- DOMの更新をする関数の定義 #updateElement
----------------------------------------- */

export interface View<State, Actions> {
  // TODO:: よくわからん()が、map？関数ぽいな。2つの引数を受け取ってVNodeを返す
  (state: State, actions: Actions): VNode;
}

// 仮想DOMの型
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

// 仮想DMOの差分を検知し、リアルDOMに反映する

function updateValue(target: HTMLInputElement, newValue: string) {
  target.value = newValue;
}

function updateAttributes(
  target: HTMLElement,
  oldAttrs: Attributes,
  newAttrs: Attributes
): void {
  // remove attrs
  for (const attr in oldAttrs) {
    if (!isEventAttr(attr)) {
      target.removeAttribute(attr);
    }
  }

  // set attrs
  for (const attr in newAttrs) {
    if (!isEventAttr(attr)) {
      target.setAttribute(attr, newAttrs[attr] as string);
    }
  }
}

export function updateElement(
  parent: HTMLElement,
  oldNode: NodeType,
  newNode: NodeType,
  index = 0
) {
  // 古いノードがなかったら新しいノードを追加する
  if (!oldNode) {
    parent.appendChild(createElement(newNode));
  }

  const target = parent.childNodes[index];

  // 新しいノードがなかったらノードを削除する
  if (!newNode) {
    parent.removeChild(target);
    return;
  }

  // 両方ある場合は差分を検知し、バッチ処理を行う
  const changeType = hasChanged(oldNode, newNode);
  switch (changeType) {
    case ChangeType.Type:
    case ChangeType.Text:
    case ChangeType.Node:
      parent.replaceChild(createElement(newNode), target);
      return;
    case ChangeType.Value:
      updateValue(
        target as HTMLInputElement,
        (newNode as VNode).attributes.value as string
      );
      return;
    case ChangeType.Attr:
      updateAttributes(
        target as HTMLElement,
        (oldNode as VNode).attributes,
        (newNode as VNode).attributes
      );
      return;
  }

  if (isVNode(oldNode) && isVNode(newNode)) {
    for (
      let i = 0;
      i < newNode.children.length || i < oldNode.children.length;
      i++
    ) {
      updateElement(
        target as HTMLElement,
        oldNode.children[i],
        newNode.children[i],
        i
      );
    }
  }
}
