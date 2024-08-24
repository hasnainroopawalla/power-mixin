type IBaseMixinArgs<TBase, TMixin> = {
  // TODO: can be strongly typed to be methods
  methods: Array<keyof TMixin>;
  initMixin: (baseObj: TBase) => TMixin;
};

export class BaseMixin<TBase, TMixin> {
  private args: IBaseMixinArgs<TBase, TMixin>;

  constructor(args: IBaseMixinArgs<TBase, TMixin>) {
    this.args = args;
  }

  public initMixin(baseObj: TBase): void {
    const mixin = this.args.initMixin(baseObj);

    this.args.methods.forEach(method => {
      // @ts-expect-error: 2536, 2349, 7019
      baseObj[method] = (...args) => mixin[method](...args);
    });
  }
}
