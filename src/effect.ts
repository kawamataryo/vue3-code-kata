let activeEffect: Function | null = null;

export const effect = (fun: Function): void => {
  activeEffect = fun;
  fun();
};

type Deps = Set<Function>;

const targetMap = new WeakMap<object, Deps>();

export const track = (target: object): void => {
  let deps = targetMap.get(target);

  if (deps === undefined) {
    deps = new Set();
    targetMap.set(target, deps);
  }

  if (activeEffect && !deps.has(activeEffect)) {
    deps.add(activeEffect);
  }
};

export const trigger = (target: object): void => {
  const deps = targetMap.get(target);

  if (deps === undefined) {
    return;
  }

  deps.forEach(effect => {
    effect();
  });
};
