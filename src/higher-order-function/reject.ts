// 其中 FP 一個重要概念 `抽象化`，
// 就是上一集講到的透過 確認點是否在直線上 的數學公式來舉例，
// 而現在我們要透過程式來實作這個概念。

interface Item {
  name: string;
  type: string;
  category: string;
  price: number;
}
function isPrime(item: Item) {
  return item.type === "prime";
}

interface Pred<T> {
  (x: T): boolean;
}

// filter isPrime: 留下 是 Prime 的 資料
// reject isPrime: 排除 是 Prime 的 資料
// 為什麼要做 filter 跟 reject
// 我們希望這類型常見的案例能夠用更直覺的方式處理

// Iteration version
function reject(pred, list) {
  const result = [];
  for (const item of list) {
    if (!pred(item)) result.push(item);
  }
  return result;
}

test("isNotPrime", () => {
  const cart = [
    { name: "Biscuits", type: "regular", category: "food", price: 2.0 },
    { name: "Monitor", type: "prime", category: "tech", price: 119.99 },
    { name: "Mouse", type: "prime", category: "tech", price: 25.5 },
    { name: "dress", type: "regular", category: "clothes", price: 49.9 },
  ];
  const expected = [
    { name: "Biscuits", type: "regular", category: "food", price: 2.0 },
    { name: "dress", type: "regular", category: "clothes", price: 49.9 },
  ];

  expect(reject(isPrime, cart)).toStrictEqual(expected);
});

export {};
