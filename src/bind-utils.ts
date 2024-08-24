export class BindUtils {
  public static bindMethods<TBase, TMixin>(
    base: TBase,
    mixin: TMixin,
    methods: (keyof TMixin)[]
  ): void {
    methods.forEach(method => {
      const methodName = method as unknown as keyof TBase;
      const methodValue = mixin[method];

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
      const propValue = mixin[prop];

      if (typeof propValue === "function") {
        throw new Error(
          `Attempted to bind an invalid prop: {${String(propName)}}`
        );
      }

      Object.defineProperty(base, prop, {
        get: () => propValue,
        set: value => {
          base[propName] = value;
        },
      });
    });
  }
}
