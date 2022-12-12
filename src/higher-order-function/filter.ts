function isEven(x: number): boolean {
  return x % 2 === 0;
}

// * 函式 放前面， 資料 放後面

// filter 的 第一個參數 是 1. 函式 2. 陣列
// filter 的 第二個參數 是 1. 函式 2. 陣列

// test("isEven", () => {
//   const testcase = [12, 324, 213, 4, 2, 3, 45, 4234];
//   const expected = [12, 324, 4, 2, 4234];
//   expect(filter(isEven, testcase)).toStrictEqual(expected);
// });

interface Pred<T> {
  (x: T): boolean;
}

// Recursion
function filter<T>(pred: Pred<T>, list: T[]): T[] {
  const [item, ...rest] = list;
  if (!item) return list;
  if (pred(item)) return [item, ...filter(pred, rest)];
  return filter(pred, rest);
}

// Iteration

interface Item {
  name: string;
  type: string;
  category: string;
  price: number;
}

function isPrime(item: Item) {
  return item.type === "prime";
}

test("isPrime", () => {
  const cart = [
    { name: "Biscuits", type: "regular", category: "food", price: 2.0 },
    { name: "Monitor", type: "prime", category: "tech", price: 119.99 },
    { name: "Mouse", type: "prime", category: "tech", price: 25.5 },
    { name: "dress", type: "regular", category: "clothes", price: 49.9 },
  ];
  const expected = [
    { name: "Monitor", type: "prime", category: "tech", price: 119.99 },
    { name: "Mouse", type: "prime", category: "tech", price: 25.5 },
  ];
  expect(filter(isPrime, cart)).toStrictEqual(expected);
});

export {};
