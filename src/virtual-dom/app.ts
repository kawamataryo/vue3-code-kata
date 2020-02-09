import { ActionTree } from "./action";
import { View, VNode, createElement, updateElement } from "./view";

interface AppConstructor<State, Actions> {
  // 親ノード
  el: HTMLElement | string;
  // viewの管理
  view: View<State, ActionTree<State>>;
  // 状態管理
  state: State;
  // Actionの定義
  actions: ActionTree<State>;
}

export class App<State, Actions> {
  private readonly el: HTMLElement;
  private readonly view: View<State, ActionTree<State>>;
  private readonly state: State;
  private readonly actions: ActionTree<State>;
  private oldNode: VNode | undefined;
  private newNode: VNode | undefined;
  private skipRender: boolean | undefined;

  constructor(params: AppConstructor<State, Actions>) {
    this.el =
      typeof params.el === "string"
        ? (document.querySelector(params.el) as HTMLElement)
        : params.el;

    this.view = params.view;
    this.state = params.state;
    this.actions = this.dispatchAction(params.actions);
    this.resolveNode();
  }

  // actionにStateを渡し新しい仮想DOMを作る
  private dispatchAction(actions: ActionTree<State>): ActionTree<State> {
    const dispatched = {} as ActionTree<State>;
    for (const key in actions) {
      const action = actions[key];
      dispatched[key] = (state: State, ...data: any) => {
        const ref = action(state, ...data);
        this.resolveNode();
        return ref;
      };
    }
    return dispatched;
  }

  // 仮想DOMを再構築する
  private resolveNode(): void {
    this.newNode = this.view(this.state, this.actions);
    this.scheduleRender();
  }

  // レンダリングのスケジューリングを行う（連続でActionが実行された時に、何度もDOMツリーを置き換えないため
  private scheduleRender(): void {
    if (!this.skipRender) {
      this.skipRender = true;
      setTimeout(this.render.bind(this));
    }
  }

  private render(): void {
    if (this.oldNode) {
      updateElement(this.el, this.oldNode, this.newNode as VNode);
    } else {
      this.el.appendChild(createElement(this.newNode as VNode));
    }

    this.oldNode = this.newNode;
    this.skipRender = false;
  }
}
