export type ActionType<State> = (state: State, ...data: any) => void | any;

/* -----------------------------------------
actionでやっていること
- アクションの型定義
----------------------------------------- */
export type ActionTree<State> = {
  [action: string]: ActionType<State>;
};
