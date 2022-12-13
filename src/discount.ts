interface Unary<A, B> {
  (a: A): B;
}

interface Binary<A, B, C> {
  (a: A, b: B): C;
}
// ================  utils ==================
function box<A>(x: A) {
  function pipe<B>(fn: Unary<A, B>) {
    return box(fn(x));
  }
  function unwrap() {
    return x;
  }
  return { pipe, unwrap };
}

function maybe<A>(x: A) {
  function pipe<B>(fn: Unary<NonNullable<A>, B>) {
    const y = isNotNull(x) ? fn(x) : ((x as unknown) as undefined);
    return maybe(y);
  }
  function unwrap() {
    return x;
  }
  return { pipe, unwrap };
}

function isNotNull<A>(x: A): x is NonNullable<A> {
  const empty = x === null || x === undefined;
  return !empty;
}

const applyTo = <A, B>(x: A) => (fn: Unary<A, B>) => fn(x);

function flatten(list: unknown[]) {
  let result: unknown[] = [];
  for (const item of list) {
    if (Array.isArray(item)) {
      result = [...result, ...flatten(item)];
      continue;
    }
    result = [...result, item];
  }
  return result;
}

function map<A, B>(fn: Unary<A, B>) {
  return function (list: A[]) {
    let result: B[] = [];
    for (const item of list) {
      result.push(fn(item));
    }
    return result;
  };
}

function filter<A>(pred: Unary<A, boolean>) {
  return function (list: A[]) {
    let result: A[] = [];
    for (const item of list) {
      if (pred(item)) result.push(item);
    }
    return result;
  };
}

const join = (token: string) => (list: unknown[]) => list.join(token);

function prop<A, K extends keyof A>(key: K) {
  return function (obj: A) {
    return obj[key];
  };
}

function reduce<A, B>(fn: Binary<A, B, A>) {
  return function (initial: A) {
    return function (list: B[]) {
      for (const item of list) {
        initial = fn(initial, item);
      }
      return initial;
    };
  };
}

function add(a: number, b: number) {
  return a + b;
}

const includes = (value: unknown) => (list: unknown[]) => list.includes(value);
const length = (list: unknown[]) => list.length;
const gte = (y: number) => (x: number) => x >= y;

const sum = reduce(add);

function splitEvery(count: number) {
  return function <T>(list: T[]) {
    const result = [];
    let idx = 0;

    while (idx < list.length) {
      result.push(list.slice(idx, idx + count));
      idx += count;
    }

    return result;
  };
}
// ==========================================

interface Product {
  name: string;
  sku: string;
  price: number;
  tags: string[];
}

interface Bill {
  products: Product[];
  total: number;
}
function displayCurrency(value: number) {
  return (
    new Intl.NumberFormat("us", { minimumFractionDigits: 2 })
      //
      .format(value)
  );
}

function displayProduct(product: Product) {
  return `- ${product.name}      $${displayCurrency(product.price)}`;
}
const displayProducts = (bill: Bill) =>
  box(bill)
    //
    .pipe(prop("products"))
    .pipe(map(displayProduct))
    .unwrap();

function displayTotal({ total }: Bill) {
  return `Total: $${displayCurrency(total)}`;
}

type DisplayResult = string | string[] | undefined;
interface Display {
  (bill: Bill): DisplayResult;
}
const display = (fns: Display[]) => (bill: Bill): string =>
  box(
    flatten(
      box(fns)
        .pipe(map(applyTo(bill)))
        .pipe(filter(isNotNull))
        .unwrap()
    )
  )
    .pipe(join("\n"))
    .unwrap();

test("display", () => {
  const testcase = {
    products: [
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
    ],
    total: 60,
  };

  const expected = `
- 乖乖(椰子口味)      $20.00
- 乖乖(椰子口味)      $20.00
- 乖乖(椰子口味)      $20.00
Total: $60.00
`.trim();

  expect(
    display([
      // 呈現商品有哪些
      displayProducts,
      // 呈現結算後的金額
      displayTotal,
    ])(testcase)
  ).toBe(expected);
});

function checkout(products: Product[]): Bill {
  // 計算原價
  const total = box(products)
    .pipe(map(prop("price")))
    .pipe(sum(0))
    .unwrap();

  // 回傳帳單 須包含 商品有哪些 跟 總價
  return { products, total };
}

test("checkout", () => {
  const products = [
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
  ];

  const expected = {
    products: [
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
      {
        name: "乖乖(椰子口味)",
        sku: "K0132",
        price: 20,
        tags: [],
      },
    ],
    total: 60,
  };

  expect(checkout(products)).toStrictEqual(expected);
});

interface Rule {
  name: string;
  check: (products: Product[]) => Discount | undefined;
}

interface Discount {
  rule: string;
  products: Product[];
  amount: number;
}

interface Bill {
  discounts?: Discount[];
}

function displayDiscount(discount: Discount) {
  return `- 符合折扣 [${discount.rule}], 折抵 ${discount.amount} 元`;
}

const displayDiscounts = ({ discounts }: Bill) =>
  maybe(discounts)
    //
    .pipe(map(displayDiscount))
    .unwrap();

function applyDiscountRule(bill: Bill, rule: Rule): Bill {
  // 計算折扣
  const discount = rule.check(bill.products);

  // 沒有折扣
  if (!discount) return bill;

  // 總價 = 原價 - 折扣
  const total = bill.total - discount.amount;

  // 回傳帳單 須包含 商品有哪些 跟 總價 跟 折扣有哪些
  const discounts = bill.discounts ? [...bill.discounts, discount] : [discount];
  return { ...bill, total, discounts };
}
const applyDiscountRules = (rules: Rule[]) => (bill: Bill) =>
  reduce(applyDiscountRule)(bill)(rules);

// ============================================================================

const matchTag = (tag: string) => (product: Product) =>
  box(product)
    //
    .pipe(prop("tags"))
    .pipe(includes(tag))
    .unwrap();

interface CumulativeQuantityDiscountProps {
  name: string;
  count: number;
  rate: number;
  applyTag: string;
}

function CumulativeQuantityDiscount(props: CumulativeQuantityDiscountProps) {
  const { name, count, rate, applyTag } = props;

  const match = matchTag(applyTag);

  function check(products: Product[]): Discount | undefined {
    // 確認留下的商品是否滿足數量要求
    const satisfied = box(products)
      .pipe(filter(match))
      .pipe(length)
      .pipe(gte(count))
      .unwrap();
    if (!satisfied) return;

    // 計算折扣金額
    const price = box(products[0]).pipe(prop("price")).unwrap();

    const matched = box(products)
      .pipe(filter(match))
      .pipe(splitEvery(count))
      .pipe(filter((group) => group.length >= count))
      .pipe(flatten)
      .unwrap() as Product[];

    const matchCount = box(matched).pipe(length).unwrap();

    const amount = price * rate * matchCount;

    return { rule: name, amount, products: matched };
  }

  return { name, check };
}

// ============================================================================

test("main", () => {
  function main(products: Product[]) {
    return (
      // 商品資料
      box(products)
        // 進行計算
        .pipe(checkout)
        // 呈現結果
        .pipe(
          display([
            // 呈現商品有哪些
            displayProducts,
            // 呈現結算後的金額
            displayTotal,
          ])
        )
        .unwrap()
    );
  }

  const products = [
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
      tags: [],
    },
  ];

  const expected = `
- 乖乖(椰子口味)      $20.00
- 乖乖(椰子口味)      $20.00
- 乖乖(椰子口味)      $20.00
Total: $60.00
`.trim();

  expect(main(products)).toBe(expected);
});

test("main with discount", () => {
  function main(products: Product[]) {
    return (
      // 商品資料
      box(products)
        // 進行計算
        .pipe(checkout)
        // 進行折扣計算
        .pipe(
          applyDiscountRules([
            CumulativeQuantityDiscount({
              name: `任 2 箱結帳 88 折!`,
              count: 2,
              rate: 0.12,
              applyTag: "熱銷飲品",
            }),
          ])
        )
        // 呈現結果
        .pipe(
          display([
            // 呈現商品有哪些
            displayProducts,
            // 呈現有哪些折扣
            displayDiscounts,
            // 呈現結算後的金額
            displayTotal,
          ])
        )
        .unwrap()
    );
  }

  const products = [
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
  ];

  const expected = `
- [御茶園]特撰冰釀微甜綠茶 550ml(24入)      $400.00
- [御茶園]特撰冰釀微甜綠茶 550ml(24入)      $400.00
- [御茶園]特撰冰釀微甜綠茶 550ml(24入)      $400.00
- 符合折扣 [任 2 箱結帳 88 折!], 折抵 96 元
Total: $1,104.00
`.trim();

  expect(main(products)).toBe(expected);
});

test("main different display", () => {
  type Fn<A, B> = (a: A, index: number) => B;
  function map<A, B>(fn: Fn<A, B>) {
    return function (list: A[]) {
      const result = [];
      for (let i = 0; i < list.length; i++) {
        result.push(fn(list[i], i));
      }
      return result;
    };
  }

  function displayProduct(product: Product, index: number) {
    const price = displayCurrency(product.price);
    return `-  ${index + 1}, [${product.sku}]  $${price}, ${product.name},`;
  }

  const displayProducts = ({ products }: Bill) =>
    box(
      flatten([
        "購買商品:",
        "---------------------------------------------------",
        box(products)
          //
          .pipe(map(displayProduct))
          .unwrap(),
        "",
      ])
    )
      .pipe(join("\n"))
      .unwrap();

  function displayDiscountProduct(product: Product, index: number) {
    return `  * 符合:  ${index + 1}, [${product.sku}], ${product.name},`;
  }

  function displayDiscount(discount: Discount) {
    const amount = displayCurrency(discount.amount);

    return [
      `- 折抵   $${amount}, ${discount.rule}`,
      box(discount.products).pipe(map(displayDiscountProduct)).unwrap(),
      "",
      "",
    ];
  }

  const displayDiscounts = ({ discounts }: Bill) =>
    box(
      flatten([
        "折扣:",
        "---------------------------------------------------",
        maybe(discounts).pipe(map(displayDiscount)).unwrap(),
      ])
    )
      .pipe(join("\n"))
      .unwrap();

  function displayTotal({ total }: Bill) {
    return [
      "---------------------------------------------------",
      `結帳金額:   $${displayCurrency(total)}`,
    ];
  }

  function main(products: Product[]) {
    return (
      // 商品資料
      box(products)
        // 進行計算
        .pipe(checkout)
        // 進行折扣計算
        .pipe(
          applyDiscountRules([
            CumulativeQuantityDiscount({
              name: `任 2 箱結帳 88 折! (熱銷飲品 限時優惠)`,
              count: 2,
              rate: 0.12,
              applyTag: "熱銷飲品",
            }),
          ])
        )
        // 呈現結果
        .pipe(
          display([
            // 呈現商品有哪些
            displayProducts,
            // 呈現有哪些折扣
            displayDiscounts,
            // 呈現結算後的金額
            displayTotal,
          ])
        )
        .unwrap()
    );
  }

  const products = [
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
    {
      name: "[御茶園]特撰冰釀微甜綠茶 550ml(24入)",
      sku: "DRINK-001201",
      price: 400,
      tags: ["熱銷飲品"],
    },
  ];

  const expected = `
購買商品:
---------------------------------------------------
-  1, [DRINK-001201]  $400.00, [御茶園]特撰冰釀微甜綠茶 550ml(24入),
-  2, [DRINK-001201]  $400.00, [御茶園]特撰冰釀微甜綠茶 550ml(24入),
-  3, [DRINK-001201]  $400.00, [御茶園]特撰冰釀微甜綠茶 550ml(24入),

折扣:
---------------------------------------------------
- 折抵   $96.00, 任 2 箱結帳 88 折! (熱銷飲品 限時優惠)
  * 符合:  1, [DRINK-001201], [御茶園]特撰冰釀微甜綠茶 550ml(24入),
  * 符合:  2, [DRINK-001201], [御茶園]特撰冰釀微甜綠茶 550ml(24入),


---------------------------------------------------
結帳金額:   $1,104.00
`.trim();

  expect(main(products)).toBe(expected);
});

export {};
