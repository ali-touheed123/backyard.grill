import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem, ItemVariation, ItemAddon } from '@/types/menu';

interface CartStore {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    variation?: ItemVariation,
    weight?: number,
    addons?: ItemAddon[],
    instructions?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const calculateItemTotal = (
  menuItem: MenuItem,
  quantity: number,
  variation?: ItemVariation,
  addons: ItemAddon[] = [],
  weight?: number
): number => {
  const basePrice = menuItem.price;
  const variationAdjustment = variation?.priceAdjustment || 0;
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);

  // If weight-based, basePrice is price per 1Kg
  if (menuItem.isWeightBased && weight) {
    return (basePrice * weight + variationAdjustment + addonsTotal) * quantity;
  }

  return (basePrice + variationAdjustment + addonsTotal) * quantity;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, quantity, variation, weight, addons = [], instructions) => {
        const cartItemId = `${menuItem.id}-${variation?.id || 'base'}-${weight || 'none'}-${addons.map(a => a.id).join('-')}-${Date.now()}`;

        const newItem: CartItem = {
          id: cartItemId,
          menuItem,
          quantity,
          selectedVariation: variation,
          selectedWeight: weight,
          selectedAddons: addons,
          specialInstructions: instructions,
          totalPrice: calculateItemTotal(menuItem, quantity, variation, addons, weight),
        };

        set((state) => ({
          items: [...state.items, newItem],
        }));
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId
              ? {
                ...item,
                quantity,
                totalPrice: calculateItemTotal(
                  item.menuItem,
                  quantity,
                  item.selectedVariation,
                  item.selectedAddons,
                  item.selectedWeight
                ),
              }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'table-to-door-cart',
    }
  )
);
