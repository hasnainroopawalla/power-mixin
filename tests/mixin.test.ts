import { mix } from "../src";
import { AmountMixin, DepositMixin, IBank, WithdrawMixin } from "./bank-mock";

describe("Example Bank", () => {
  let bank: IBank;

  afterEach(() => {
    bank = {} as IBank;
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
});
