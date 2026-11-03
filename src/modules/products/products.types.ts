// Describe digital PC games and their available genres.
export type ProductCategory =
  'RPG' | 'Action' | 'Adventure' | 'Racing' | 'Strategy' | 'Simulation';
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  badge?: string;
  color?: string;
}
