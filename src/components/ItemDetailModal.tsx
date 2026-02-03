import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Clock, Flame, Leaf, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/store/cartStore';
import { menuItems } from '@/data/mockData';
import type { MenuItem, ItemVariation, ItemAddon, CartItem } from '@/types/menu';
import { toast } from 'sonner';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<number>(1);
  const [selectedVariation, setSelectedVariation] = useState<ItemVariation | undefined>();
  const [selectedAddons, setSelectedAddons] = useState<ItemAddon[]>([]);
  const [selectedUpsells, setSelectedUpsells] = useState<CartItem[]>([]);
  const [instructions, setInstructions] = useState('');

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedWeight(1);
      setSelectedVariation(item.variations?.[0]);
      setSelectedAddons([]);
      setSelectedUpsells([]);
      setInstructions('');
    }
  }, [item]);

  const addItem = useCartStore((state) => state.addItem);

  if (!item) return null;

  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  const calculateTotal = () => {
    const basePrice = item.price;
    const variationAdjustment = selectedVariation?.priceAdjustment || 0;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const upsellsTotal = selectedUpsells.reduce((sum, upsell) => sum + upsell.totalPrice, 0);

    if (item.isWeightBased) {
      return (basePrice * selectedWeight + variationAdjustment + addonsTotal + upsellsTotal) * quantity;
    }

    return (basePrice + variationAdjustment + addonsTotal + upsellsTotal) * quantity;
  };

  const handleAddToCart = () => {
    // Add main item
    addItem(item, quantity, selectedVariation, item.isWeightBased ? selectedWeight : undefined, selectedAddons, instructions);

    // Add upsell items
    selectedUpsells.forEach(upsell => {
      addItem(upsell.menuItem, upsell.quantity, upsell.selectedVariation, undefined, upsell.selectedAddons, upsell.specialInstructions);
    });

    toast.success(`Added ${quantity}x ${item.name} ${selectedUpsells.length > 0 ? `and ${selectedUpsells.length} pairings ` : ''}to cart!`, {
      description: formatPrice(calculateTotal()),
    });
    onClose();
    // Reset state
    setQuantity(1);
    setSelectedWeight(1);
    setSelectedVariation(undefined);
    setSelectedAddons([]);
    setSelectedUpsells([]);
    setInstructions('');
  };

  const toggleUpsell = (upsellItem: MenuItem) => {
    setSelectedUpsells((prev) => {
      const existing = prev.find((u) => u.menuItem.id === upsellItem.id);
      if (existing) {
        return prev.filter((u) => u.menuItem.id !== upsellItem.id);
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        menuItem: upsellItem,
        quantity: 1,
        selectedVariation: upsellItem.variations ? upsellItem.variations[0] : undefined,
        selectedAddons: [],
        totalPrice: upsellItem.price + (upsellItem.variations ? upsellItem.variations[0].priceAdjustment : 0)
      }];
    });
  };

  const updateUpsellVariation = (upsellItemId: string, variationId: string) => {
    setSelectedUpsells(prev => prev.map(u => {
      if (u.menuItem.id === upsellItemId) {
        const variation = u.menuItem.variations?.find(v => v.id === variationId);
        if (variation) {
          return {
            ...u,
            selectedVariation: variation,
            totalPrice: u.menuItem.price + variation.priceAdjustment
          };
        }
      }
      return u;
    }));
  };

  const toggleAddon = (addon: ItemAddon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col md:inset-0 md:flex md:items-center md:justify-center md:bg-transparent"
          >
            <div className="bg-background rounded-3xl w-full md:max-w-2xl md:max-h-[85vh] flex flex-col overflow-hidden shadow-hero">
              {/* Header Image */}
              <div className="relative h-64 md:h-80 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {item.isSpicy && (
                    <span className="bg-destructive text-destructive-foreground text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Flame className="w-4 h-4" /> Spicy
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="bg-success text-success-foreground text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Leaf className="w-4 h-4" /> Vegetarian
                    </span>
                  )}
                  <span className="bg-muted text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {item.prepTime} min
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      {item.name}
                    </h2>
                    <span className="font-heading font-bold text-xl text-primary whitespace-nowrap">
                      {item.isWeightBased ? `${formatPrice(item.price)}/Kg` : formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>

                {/* Weight Customization (For Weight-Based Items) */}
                {item.isWeightBased && (
                  <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">
                          Order by Weight (Kg)
                        </h3>
                        <p className="text-xs text-muted-foreground">Adjust the slider or enter manually</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={selectedWeight}
                          onChange={(e) => setSelectedWeight(Math.max(0.25, parseFloat(e.target.value) || 0.25))}
                          step="0.25"
                          min="0.25"
                          className="w-20 bg-background border-2 border-primary/20 rounded-xl px-2 py-1.5 text-center font-bold text-primary focus:border-primary focus:outline-none transition-colors"
                        />
                        <span className="font-bold text-muted-foreground">Kg</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="10"
                      step="0.25"
                      value={selectedWeight}
                      onChange={(e) => setSelectedWeight(parseFloat(e.target.value))}
                      className="w-full accent-primary h-2 bg-muted rounded-full cursor-pointer appearance-none px-0 py-0"
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>0.25 Kg</span>
                      <span>5 Kg</span>
                      <span>10 Kg</span>
                    </div>
                  </div>
                )}

                {/* Variations (For non-weight based items with variations) */}
                {!item.isWeightBased && item.variations && item.variations.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      Select Variation
                    </h3>
                    <RadioGroup
                      value={selectedVariation?.id || ''}
                      onValueChange={(value) =>
                        setSelectedVariation(item.variations?.find((v) => v.id === value))
                      }
                    >
                      <div className="space-y-2">
                        {item.variations.map((variation) => (
                          <Label
                            key={variation.id}
                            htmlFor={variation.id}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedVariation?.id === variation.id
                              ? 'border-primary bg-accent'
                              : 'border-border hover:border-primary/50'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={variation.id} id={variation.id} />
                              <span className="font-medium">{variation.name}</span>
                            </div>
                            <span className="font-semibold text-primary">
                              {variation.priceAdjustment >= 0 ? '+' : ''}
                              {formatPrice(variation.priceAdjustment)}
                            </span>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Add-ons */}
                {item.addons && item.addons.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      Add Extras
                    </h3>
                    <div className="space-y-2">
                      {item.addons.map((addon) => (
                        <Label
                          key={addon.id}
                          htmlFor={`addon-${addon.id}`}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddons.find((a) => a.id === addon.id)
                            ? 'border-primary bg-accent'
                            : 'border-border hover:border-primary/50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id={`addon-${addon.id}`}
                              checked={!!selectedAddons.find((a) => a.id === addon.id)}
                              onCheckedChange={() => toggleAddon(addon)}
                            />
                            <span className="font-medium">{addon.name}</span>
                          </div>
                          <span className="font-semibold text-primary">
                            +{formatPrice(addon.price)}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upsells Section */}
                {item.upsellIds && item.upsellIds.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold text-foreground mb-4">
                      Popular with your items
                    </h3>
                    <div className="space-y-4">
                      {item.upsellIds.map((upsellId) => {
                        const upsellItem = menuItems.find((m) => m.id === upsellId);
                        if (!upsellItem) return null;
                        const isSelected = !!selectedUpsells.find((u) => u.menuItem.id === upsellItem.id);
                        const selectedUpsell = selectedUpsells.find((u) => u.menuItem.id === upsellItem.id);

                        return (
                          <motion.div
                            layout
                            key={upsellItem.id}
                            className={`p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-primary bg-accent/50 shadow-md' : 'border-border hover:border-primary/30'}`}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                  <img src={upsellItem.image} alt={upsellItem.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground leading-tight">{upsellItem.name}</span>
                                  <span className="text-sm text-primary font-bold">{formatPrice(upsellItem.price)}</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant={isSelected ? "default" : "outline"}
                                className={`rounded-xl px-4 font-bold border-2 ${!isSelected && 'hover:bg-primary/10 hover:border-primary'}`}
                                onClick={() => toggleUpsell(upsellItem)}
                              >
                                {isSelected ? 'Added' : 'Add'}
                              </Button>
                            </div>

                            {/* Variations for drinks (sizes) */}
                            <AnimatePresence>
                              {isSelected && upsellItem.variations && upsellItem.variations.length > 0 && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 pt-4 border-t border-border/50">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Select Size</p>
                                    <RadioGroup
                                      value={selectedUpsell?.selectedVariation?.id}
                                      onValueChange={(value) => updateUpsellVariation(upsellItem.id, value)}
                                      className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                                    >
                                      {upsellItem.variations.map((v) => (
                                        <div key={v.id}>
                                          <RadioGroupItem value={v.id} id={`upsell-${upsellItem.id}-${v.id}`} className="sr-only" />
                                          <Label
                                            htmlFor={`upsell-${upsellItem.id}-${v.id}`}
                                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2 text-center cursor-pointer transition-all ${selectedUpsell?.selectedVariation?.id === v.id
                                              ? 'border-primary bg-primary text-primary-foreground'
                                              : 'border-border hover:border-primary/50 text-muted-foreground'
                                              }`}
                                          >
                                            <span className="text-xs font-bold">{v.name}</span>
                                            <span className="text-[10px] opacity-80">{v.priceAdjustment > 0 ? `+Rs ${v.priceAdjustment}` : 'Included'}</span>
                                          </Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div className="mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Special Instructions
                  </h3>
                  <Textarea
                    placeholder="E.g., No onions, extra spicy, allergies..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 border-t border-border bg-surface">
                <div className="flex items-center justify-between gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3 bg-muted rounded-xl p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-heading font-semibold text-lg w-8 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-lg"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    className="flex-1 gap-2 text-base"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add {formatPrice(calculateTotal())}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
