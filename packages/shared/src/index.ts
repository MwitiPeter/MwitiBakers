export type ProductType = 'physical' | 'digital';

export interface MoneyValue {
  amount: number;
  currency: 'KES';
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  price: MoneyValue;
  active: boolean;
}
