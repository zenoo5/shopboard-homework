export type ProductCategory =
  | 'Mice'
  | 'Keyboards'
  | 'Audio'
  | 'Monitors'
  | 'Accessories'
  | 'Headsets'
  | 'Controllers'
  | 'Consoles'
  | 'PCs'
  | 'Laptops'
  | 'Software'
  | 'Other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  badge?: string; // Optional property (e.g. "Fan favorite")
  color?: string; // Optional property (e.g. "mint")
}
