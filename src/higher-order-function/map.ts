function filter<T>(pred: Pred<T>, list: T[]): T[] {
  let results: T[] = [];
  for (const item of list) {
    if (pred(item)) results = [...results, item];
  }
  return results;
}

interface Unary<A, B> {
  (x: A): B;
}
function map<A, B>(fn: Unary<A, B>, list: A[]): B[] {
  const [item, ...rest] = list;
  if (!item) return [];
  return [fn(item), ...map(fn, rest)];
}

interface Item {
  name: string;
  type: string;
  category: string;
  price: number;
}
function applyCoupon(discount: number, cart: Item[]) {
  return (
    cart

      // 先留下是 tech 的商品
      .filter((item) => item.category === "tech")

      // 選這個商品的 price 打八折
      .map((item) => ({ ...item, price: item.price - item.price * discount }))
  );
}

test("applyCoupon", () => {
  const discount = 20 / 100;
  const cart = [
    { name: "Biscuits", type: "regular", category: "food", price: 2.0 },
    { name: "Monitor", type: "prime", category: "tech", price: 119.99 },
    { name: "Mouse", type: "prime", category: "tech", price: 25.5 },
    { name: "dress", type: "regular", category: "clothes", price: 49.9 },
  ];
  const expected = [
    {
      name: "Monitor",
      type: "prime",
      category: "tech",
      price: expect.closeTo(95.99),
    },
    {
      name: "Mouse",
      type: "prime",
      category: "tech",
      price: expect.closeTo(20.4),
    },
  ];
  expect(applyCoupon(discount, cart)).toEqual(expected);
});
