export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Organic Apples", price: 4.99, description: "Fresh, local apples, 1 lb" },
  { id: "p2", name: "Cold Brew Coffee", price: 8.5, description: "Smooth, single-origin cold brew" },
  { id: "p3", name: "Handmade Soap", price: 6.25, description: "Small-batch soap (lavender)" },
  { id: "p4", name: "Canvas Tote Bag", price: 15.0, description: "Reusable cotton tote — 15L" },
  { id: "p5", name: "Notebook", price: 7.0, description: "A6 notebook — 80 pages" },
];
