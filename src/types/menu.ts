export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameUrdu?: string;
  description: string;
  descriptionUrdu?: string;
  price: number;
  image: string;
  splineUrl?: string;
  prepTime: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  variations?: ItemVariation[];
  addons?: ItemAddon[];
  isWeightBased?: boolean;
  upsellIds?: string[];
}

export interface ItemVariation {
  id: string;
  name: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

export interface ItemAddon {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameUrdu?: string;
  description?: string;
  icon: string;
  itemCount: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariation?: ItemVariation;
  selectedWeight?: number;
  selectedAddons: ItemAddon[];
  selectedUpsells?: MenuItem[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  banner: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  rating: number;
  totalReviews: number;
  minOrderAmount: number;
  avgPrepTime: number;
  isOpen: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';
