import { motion } from 'framer-motion';
import { Plus, Clock, Flame, Leaf, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onItemClick: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAddToCart, onItemClick }: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group h-full flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container - Gray Background, Contained Image */}
      <div className="relative h-64 overflow-hidden bg-muted/30 p-4 flex items-center justify-center">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <div className="flex gap-2">
            {item.isSpicy && (
              <span className="bg-white/90 backdrop-blur text-orange-500 p-1.5 rounded-lg shadow-sm">
                <Flame className="w-4 h-4 fill-current" />
              </span>
            )}
            {item.isVegetarian && (
              <span className="bg-white/90 backdrop-blur text-green-500 p-1.5 rounded-lg shadow-sm">
                <Leaf className="w-4 h-4 fill-current" />
              </span>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-heading font-extrabold text-2xl text-foreground mb-1 leading-tight">
            {item.name}
          </h3>

          {item.nameUrdu && (
            <p className="text-sm text-muted-foreground font-medium text-right mb-1 font-noto-nastaliq" dir="rtl">
              {item.nameUrdu}
            </p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="mt-auto pt-4 space-y-3">
          {/* Price Pill */}
          <div className="flex items-center">
            <span className="bg-[#f97316] text-white font-bold px-4 py-1.5 rounded-full text-lg shadow-sm">
              {formatPrice(item.price)}
            </span>
            {item.prepTime && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm ml-auto">
                <Clock className="w-4 h-4" />
                <span>{item.prepTime} min</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button - Full Width */}
          <Button
            className="w-full bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-lg h-12 rounded-xl uppercase tracking-wide shadow-md hover:shadow-lg transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="bg-white/30 p-1 rounded-sm">
                <Plus className="w-4 h-4" />
              </span>
              Add to Cart
            </div>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
