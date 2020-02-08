// 関数を保存しておくもの
let activeEffect: Function | null = null;

// 関数を受け取って、関数をactiveEffectに保存、あとは関数を実行する
export const effect = (fun: Function): void => {
  activeEffect = fun;
  fun();
};

// ユニークな値のみ保存できる配列
type Deps = Set<Function>;

// オブジェクトをKeyにとるマップ。オブジェクトにDeps（ユニークな値のみを保存できる配列）を対応づける
const targetMap = new WeakMap<object, Deps>();

export const track = (target: object): void => {
  // targetMapからtargetに紐つくdepsを取得
  let deps = targetMap.get(target);

  // もしdepsがundefだったら
  if (deps === undefined) {
    // depsに新しいsetをいれる
    deps = new Set();
    // targetMapにtargetに関連づけて空のsetをいれる
    targetMap.set(target, deps);
  }

  // activeEffectがあって、かつdepsがactiveEffectの関数を持ってなかったら
  if (activeEffect && !deps.has(activeEffect)) {
    // depsにactiveEffectの関数を入れる
    deps.add(activeEffect);
  }
};

export const trigger = (target: object): void => {
  // targetMapからtargetに紐つくdepsを取得
  const deps = targetMap.get(target);

  // undefだったら終了
  if (deps === undefined) {
    return;
  }

  // depsに入っている関数を順次実行する
  deps.forEach(effect => {
    effect();
  });
};
