export interface Product {
  id: number;
  category: string;
  product: string;
  price: number;
  units: number;
  date: Date;
}

export const products: Product[] = Array.from({ length: 250 }, (_, i) => ({
  id: i + 1,
  category: ['Beverages', 'Condiments', 'Produce', 'Meat'][i % 4],
  product: `Item ${i + 1}`,
  price: +(Math.random() * 100).toFixed(2),
  units: Math.floor(Math.random() * 500),
  date: new Date(2024, i % 12, (i % 28) + 1)
}));
