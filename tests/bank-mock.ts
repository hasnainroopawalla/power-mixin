import { BaseMixin } from "../src";

type IAmount = {
  amount: number;
  setAmount: (newAmount: number) => void;
};

class Amount implements IAmount {
  public amount: number = 1000;

  constructor(private readonly bank: IBank) {}

  public setAmount(newAmount: number): void {
    this.amount = newAmount;
  }
}

export class AmountMixin extends BaseMixin<IBank, IAmount> {
  constructor() {
    super({
      methods: ["setAmount"],
      props: ["amount"],
      initMixin: bank => new Amount(bank),
    });
  }
}

type IDeposit = {
  deposit: (amount: number) => void;
};

class Deposit implements IDeposit {
  constructor(private readonly bank: IBank) {}

  public deposit(depositAmount: number): void {
    this.bank.setAmount(this.bank.amount + depositAmount);
  }
}

export class DepositMixin extends BaseMixin<IBank, IDeposit> {
  constructor() {
    super({
      methods: ["deposit"],
      props: [],
      initMixin: bank => new Deposit(bank),
    });
  }
}

type IWithdraw = {
  withdraw: (amount: number) => void;
};

class Withdraw implements IWithdraw {
  constructor(private readonly bank: IBank) {}

  public withdraw(withdrawAmount: number): void {
    this.bank.setAmount(this.bank.amount - withdrawAmount);
  }
}

export class WithdrawMixin extends BaseMixin<IBank, IWithdraw> {
  constructor() {
    super({
      methods: ["withdraw"],
      props: [],
      initMixin: bank => new Withdraw(bank),
    });
  }
}

export type IBank = IAmount & IDeposit & IWithdraw;
