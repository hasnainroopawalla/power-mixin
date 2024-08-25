import { BindUtils } from "./bind-utils";

type IBaseMixinArgs<TBase, TMixin> = {
  props: Array<keyof TMixin>;
  methods: Array<keyof TMixin>;
  initMixin: (base: TBase) => TMixin;
};

export class BaseMixin<TBase, TMixin> {
  private args: IBaseMixinArgs<TBase, TMixin>;

  constructor(args: IBaseMixinArgs<TBase, TMixin>) {
    this.args = args;
  }

  public initMixin(base: TBase): void {
    const mixin = this.args.initMixin(base);

    BindUtils.bindMethods(base, mixin, this.args.methods);
    BindUtils.bindProps(base, mixin, this.args.props);
  }
}
