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

// Iteration version
function reject(pred, list) {}

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
