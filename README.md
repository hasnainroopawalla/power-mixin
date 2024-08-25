# ts-mixin

[![Minified Size](https://badgen.net/bundlephobia/min/ts-mixin)](https://bundlephobia.com/result?p=ts-mixin)

## Overview

`ts-mixin` is lightweight TypeScript framework for Mixins. It provides a very intuitive way to create Mixins from existing classes, so it's very easy to integrate into existing systems. Along with complete type-safety during compilation, the framework also provides runtime safety while initializing the Mixins.

The Mixin pattern is meant to add reusable functionality to objects without any class inheritance ([source](https://www.patterns.dev/vanilla/mixin-pattern/)).

## 🏁 Getting started

```
$ npm install ts-mixin
// OR
$ yarn add ts-mixin
```

## 💡 Quick start

This following example involves building a `Bank` system where the core functionality is _mixed_ in from various existing classes like `Amount`, `Deposit` and `Withdraw`:

```typescript
import { BaseMixin } from "ts-mixin";

type IAmount = {
  amount: number;
  setAmount: (newAmount: number) => void;
};

// Simple class to manage the amount
class Amount implements IAmount {
  public amount: number = 1000;

  constructor(private readonly bank: IBank) {}

  public setAmount(newAmount: number): void {
    this.amount = newAmount;
  }
}

// Define the Amount Mixin
class AmountMixin extends BaseMixin<IBank, IAmount> {
  constructor() {
    super({
      // Specify the methods and props to be be mixed
      methods: ["setAmount"],
      props: ["amount"],
      initMixin: bank => new Amount(bank),
    });
  }
}
```

```typescript
import { BaseMixin } from "ts-mixin";

type IDeposit = {
  deposit: (amount: number) => void;
};

// Simple class to deposit money into the account
class Deposit implements IDeposit {
  constructor(private readonly bank: IBank) {}

  public deposit(depositAmount: number): void {
    this.bank.setAmount(this.bank.amount + depositAmount);
  }
}

// Define the Deposit Mixin
class DepositMixin extends BaseMixin<IBank, IDeposit> {
  constructor() {
    super({
      // Specify the methods and props to be be mixed
      methods: ["deposit"],
      props: [],
      initMixin: bank => new Deposit(bank),
    });
  }
}
```

```typescript
import { BaseMixin } from "ts-mixin";

type IWithdraw = {
  withdraw: (amount: number) => void;
};

// Simple class to withdraw money from the account
class Withdraw implements IWithdraw {
  constructor(private readonly bank: IBank) {}

  public withdraw(withdrawAmount: number): void {
    this.bank.setAmount(this.bank.amount - withdrawAmount);
  }
}

// Define the Withdraw Mixin
class WithdrawMixin extends BaseMixin<IBank, IWithdraw> {
  constructor() {
    super({
      // Specify the methods and props to be be mixed
      methods: ["withdraw"],
      props: [],
      initMixin: bank => new Withdraw(bank),
    });
  }
}
```

Define the `IBank` interface to represent the Mixed object based on the above Mixins:

```typescript
type IBank = IAmount & IDeposit & IWithdraw;
```

Create the mixed `bank` object using the Mixin implementations:

```typescript
import { mix } from "ts-mixin";

const bank = mix<IBank>({
  mixins: [new AmountMixin(), new DepositMixin(), new WithdrawMixin()],
});

// Complete type-safety for the mixed object
console.log(bank.amount); // 1000
bank.deposit(500);
console.log(bank.amount); // 500
bank.withdraw(200);
console.log(bank.amount); // 300
```

Runtime safety is guaranteed while mixing objects in the following scenarios:

- Attempting to bind a method as a prop and vice versa
- Attempting to bind a prop/method that already exists on the object

## ✏️ Contributing

- Post any issues and suggestions on the GitHub [issues](https://github.com/hasnainroopawalla/ts-mixin/issues) page.
- To contribute, fork the project and then create a pull request back to `main`.
