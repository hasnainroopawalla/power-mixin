import { BaseMixin, mix } from "../src";
import { AmountMixin, DepositMixin, IBank, WithdrawMixin } from "./bank-mock";

describe("Example Bank", () => {
  let bank: IBank;
  const logSpy = jest.spyOn(global.console, "error").mockImplementation();

  afterEach(() => {
    bank = {} as IBank;
    logSpy.mockClear();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  describe("With AmountMixin", () => {
    beforeEach(() => {
      bank = mix({
        mixins: [new AmountMixin()],
      });
    });

    test("Attributes exist", () => {
      expect(bank.setAmount).toStrictEqual(expect.any(Function));
      expect(bank.amount).toStrictEqual(expect.any(Number));
    });

    test("Executes and sets correct value", () => {
      bank.setAmount(20);
      expect(bank.amount).toBe(20);
    });
  });

  describe("Without AmountMixin", () => {
    beforeEach(() => {
      bank = mix({
        mixins: [new DepositMixin()],
      });
    });

    test("Attributes do not exist", () => {
      expect(bank.amount).toBeUndefined();
      expect(bank.setAmount).toBeUndefined();
    });
  });

  describe("With AmountMixin and DepositMixin", () => {
    beforeEach(() => {
      bank = mix({
        mixins: [new AmountMixin(), new DepositMixin()],
      });
    });

    test("Attributes exist", () => {
      expect(bank.setAmount).toStrictEqual(expect.any(Function));
      expect(bank.amount).toStrictEqual(expect.any(Number));
      expect(bank.deposit).toStrictEqual(expect.any(Function));
    });

    test("Executes deposit and updates amount", () => {
      bank.deposit(500);
      expect(bank.amount).toBe(1500);
    });
  });

  describe("With AmountMixin and WithdrawMixin", () => {
    beforeEach(() => {
      bank = mix({
        mixins: [new AmountMixin(), new WithdrawMixin()],
      });
    });

    test("Attributes exist", () => {
      expect(bank.setAmount).toStrictEqual(expect.any(Function));
      expect(bank.amount).toStrictEqual(expect.any(Number));
      expect(bank.withdraw).toStrictEqual(expect.any(Function));
    });

    test("Executes withdrawal and updates amount", () => {
      bank.withdraw(200);
      expect(bank.amount).toBe(800);
    });
  });

  describe("With AmountMixin, DepositMixin and WithdrawMixin", () => {
    beforeEach(() => {
      bank = mix({
        mixins: [new AmountMixin(), new DepositMixin(), new WithdrawMixin()],
      });
    });

    test("Attributes exist", () => {
      expect(bank.setAmount).toStrictEqual(expect.any(Function));
      expect(bank.amount).toStrictEqual(expect.any(Number));
      expect(bank.deposit).toStrictEqual(expect.any(Function));
      expect(bank.withdraw).toStrictEqual(expect.any(Function));
    });

    test("Executes deposit-withdrawal-deposit-deposit and returns correct amount", () => {
      bank.deposit(300);
      expect(bank.amount).toBe(1300);
      bank.withdraw(500);
      expect(bank.amount).toBe(800);
      bank.deposit(100);
      expect(bank.amount).toBe(900);
      bank.deposit(1000);
      expect(bank.amount).toBe(1900);
    });
  });

  describe("Duplicate mixin attributes", () => {
    test("Duplicate method", () => {
      bank = mix({
        mixins: [new WithdrawMixin(), new WithdrawMixin()],
      });

      expect(console.error).toHaveBeenCalledWith(
        "Method already defined on the base object: {withdraw}"
      );
    });

    test("Duplicate method and prop", () => {
      bank = mix({
        mixins: [new AmountMixin(), new AmountMixin()],
      });

      expect(logSpy).toHaveBeenCalledTimes(2);

      expect(logSpy).toHaveBeenNthCalledWith(
        1,
        "Method already defined on the base object: {setAmount}"
      );
      expect(logSpy).toHaveBeenNthCalledWith(
        2,
        "Property already defined on the base object: {amount}"
      );
    });
  });

  describe("Invalid prop bindings", () => {
    let methods: (keyof Amount)[] = [];
    let props: (keyof Amount)[] = [];

    class Amount {
      public amount: number = 1000;

      constructor(private readonly bank: IBank) {}

      public setAmount(newAmount: number): void {
        this.amount = newAmount;
      }
    }

    class AmountMixin extends BaseMixin<IBank, InstanceType<typeof Amount>> {
      constructor() {
        super({
          methods,
          props,
          initMixin: bank => new Amount(bank),
        });
      }
    }

    beforeEach(() => {
      methods = [];
      props = [];
    });

    test("Passing method as prop", () => {
      props = ["setAmount"];

      bank = mix({
        mixins: [new AmountMixin()],
      });

      expect(logSpy).toHaveBeenCalledTimes(1);

      expect(console.error).toHaveBeenCalledWith(
        "Attempted to bind a method as a prop: {setAmount}"
      );
    });

    test("Passing prop as method", () => {
      methods = ["amount"];

      bank = mix({
        mixins: [new AmountMixin()],
      });

      expect(logSpy).toHaveBeenCalledTimes(1);

      expect(console.error).toHaveBeenCalledWith(
        "Attempted to bind a prop as a method: {amount}"
      );
    });
  });
});
