let activeEffect: Function | null = null;

export function effect(fun: Function): void {
  activeEffect = fun;
  fun();
}

type Deps = Set<Function>;

const targetMap = new WeakMap<object, Deps>();

export function track(target: object): void {
  let deps = targetMap.get(target);

  if (deps === undefined) {
    deps = new Set();
    targetMap.set(target, deps);
  }

  if (activeEffect && !deps.has(activeEffect)) {
    deps.add(activeEffect);
  }
}

export function trigger(target: object): void {
  const deps = targetMap.get(target);

  if (deps === undefined) {
    return;
  }

  deps.forEach(effect => {
    effect();
  });
}
