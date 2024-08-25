import { BaseMixin } from "../src";

type IAddService = {
  add: (num1: number, num2: number) => number;
};

class AddService implements IAddService {
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
      methods: ["add"],
      props: [],
      initMixin: calculator => new AddService(calculator),
    });
  }
}

type IMultiplyService = {
  multiply: (num1: number, num2: number) => number;
  runningValue: number;
};

class MultiplyService implements IMultiplyService {
  public runningValue: number;

  private readonly calculator: ICalculator;

  constructor(calculator: ICalculator) {
    this.calculator = calculator;
    this.runningValue = 66;
  }

  public multiply(num1: number, num2: number): number {
    let sum = 0;
    for (let i = 0; i < num1; i++) {
      sum = this.calculator.add(sum, num2);
    }
    return sum;
  }
}

export class MultiplyMixin extends BaseMixin<ICalculator, IMultiplyService> {
  constructor() {
    super({
      methods: ["multiply"],
      props: ["runningValue"],
      initMixin: calculator => new MultiplyService(calculator),
    });
  }
}

export type ICalculator = IAddService & IMultiplyService;
