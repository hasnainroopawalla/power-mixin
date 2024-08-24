import { BaseMixin, mix } from "./src";

type ICalculator = {
  add: (num1: number, num2: number) => number;
};

type IAddService = Pick<ICalculator, "add">;

class AddService {
  private calculator: ICalculator;

  constructor(calculator: ICalculator) {
    this.calculator = calculator;
  }

  public add(num1: number, num2: number): number {
    return num1 + num2;
  }
}

export class AddMixin extends BaseMixin<ICalculator, IAddService> {
  constructor() {
    super({
      // TODO: create type to get all public methods
      methods: ["add"] as const,
      initMixin: baseObj => new AddService(baseObj),
    });
  }
}

const calculator = mix<ICalculator>({
  mixins: [new AddMixin()],
});

console.log(calculator.add(10, 3));
