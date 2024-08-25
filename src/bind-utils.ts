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
        BindUtils.logError(
          "Method already defined on the base object",
          methodName
        );
        return;
      }

      if (typeof methodValue !== "function") {
        BindUtils.logError("Attempted to bind a prop as a method", methodName);
        return;
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
        BindUtils.logError(
          "Property already defined on the base object",
          propName
        );
        return;
      }

      if (typeof mixin[prop] === "function") {
        BindUtils.logError("Attempted to bind a method as a prop", propName);
        return;
      }

      Object.defineProperty(base, prop, {
        get: () => mixin[prop],
        set: value => {
          mixin[prop] = value;
        },
      });
    });
  }

  private static logError(
    message: string,
    attribute: string | number | symbol
  ) {
    console.error(`${message} {${String(attribute)}}`);
  }
}
