export class BindUtils {
  public static bindMethods<TBase, TMixin>(
    base: TBase,
    mixin: TMixin,
    methods: (keyof TMixin)[]
  ): void {
    methods.forEach(method => {
      const methodName = method as unknown as keyof TBase;
      const methodValue = mixin[method];

      if (base[methodName]) {
        throw new Error(`Method already defined: {${String(methodName)}}`);
      }

      if (typeof methodValue !== "function") {
        throw new Error(
          `Attempted to bind an invalid method: {${String(methodName)}}`
        );
      }

      base[methodName] = methodValue.bind(mixin);
    });
  }

  public static bindProps<TBase, TMixin>(
    base: TBase,
    mixin: TMixin,
    props: (keyof TMixin)[]
  ): void {
    props.forEach(prop => {
      const propName = prop as unknown as keyof TBase;

      if (base[propName]) {
        throw new Error(`Property already defined: {${String(propName)}}`);
      }

      if (typeof mixin[prop] === "function") {
        throw new Error(
          `Attempted to bind an invalid prop: {${String(propName)}}`
        );
      }

      Object.defineProperty(base, prop, {
        get: () => mixin[prop],
        set: value => {
          mixin[prop] = value;
        },
      });
    });
  }
}
