export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  images: string[];
  category: string;
  featured?: boolean;
  type: 'digital' | 'physical';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  streetsBetween?: string;
  paymentMethod: 'mercadopago' | 'transfer';
}
