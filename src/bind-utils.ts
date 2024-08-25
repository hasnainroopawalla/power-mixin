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
        console.error(
          `Method already defined on the base object: {${String(methodName)}}`
        );
        return;
      }

      if (typeof methodValue !== "function") {
        console.error(
          `Attempted to bind a prop as a method: {${String(methodName)}}`
        );
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
        console.error(
          `Property already defined on the base object: {${String(propName)}}`
        );
        return;
      }

      if (typeof mixin[prop] === "function") {
        console.error(
          `Attempted to bind a method as a prop: {${String(propName)}}`
        );
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
}
