type IBaseMixinArgs<TBase, TMixin> = {
  // TODO: can be strongly typed to be methods
  methodNames: Array<keyof TMixin>;
  initMixin: (baseObj: TBase) => TMixin;
};

export class BaseMixin<TBase, TMixin> {
  private args: IBaseMixinArgs<TBase, TMixin>;

  constructor(args: IBaseMixinArgs<TBase, TMixin>) {
    this.args = args;
  }

  public initMixin(base: TBase): void {
    const mixin = this.args.initMixin(base);

    this.args.methodNames.forEach(methodName => {
      const maybeMethod = mixin[methodName];

      if (typeof maybeMethod !== "function") {
        throw new Error(`Invalid method: ${String(methodName)}`);
      }

      // @ts-expect-error: Type 'keyof TMixin' cannot be used to index type 'TBase' (TS2536).
      base[methodName] = maybeMethod.bind(mixin);
    });
  }
}
