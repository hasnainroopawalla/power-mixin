type InputMixin<TBase> = { initMixin: (baseObj: TBase) => void };

type IMix<TBase> = {
  mixins: InputMixin<TBase>[];
};

/**
 * A method to create an object with the specified input Mixins.
 *
 * @example
 * const calculator = mix<ICalculator>({
 *     mixins: [
 *         new AddMixin(),
 *         new SubtractMixin(),
 *         new MultiplyMixin(),
 *     ]
 * })
 */
export const mix = <TBase>(args: IMix<TBase>) => {
  const baseObj = {} as TBase;

  args.mixins.forEach(mixin => {
    mixin.initMixin(baseObj);
  });

  return baseObj;
};
