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
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container - Full Bleed */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay for badges visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {item.isFeatured && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-lg"
            >
              Popular
            </motion.span>
          )}
          <div className="flex gap-1">
            {item.isSpicy && (
              <span className="bg-destructive text-destructive-foreground w-6 h-6 rounded flex items-center justify-center shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
            {item.isVegetarian && (
              <span className="bg-success text-success-foreground w-6 h-6 rounded flex items-center justify-center shadow-sm">
                <Leaf className="w-3.5 h-3.5 fill-current" />
              </span>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-warning text-warning" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.nameUrdu && (
          <p className="text-sm text-muted-foreground font-medium text-right mb-2 font-noto-nastaliq" dir="rtl">
            {item.nameUrdu}
          </p>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-grow">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.prepTime} min</span>
          </div>

          <Button
            size="sm"
            className="rounded-full px-4 h-8 font-semibold shadow-none group-hover:shadow-md transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
