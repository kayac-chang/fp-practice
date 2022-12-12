// # 定義系統架構
// 1. 從最關鍵的商品資訊開始

interface Product {
  name: string;
  sku: string;
  price: number;
}

function main() {
  const products: Product[] = [
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
    },
    {
      name: "乖乖(椰子口味)",
      sku: "K0132",
      price: 20,
    },
  ];
}
