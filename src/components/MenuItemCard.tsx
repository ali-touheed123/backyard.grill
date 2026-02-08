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
      className="group h-full flex flex-col bg-card rounded-[2rem] overflow-hidden border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container - Studio Setting */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-muted/30 to-muted/5 flex items-center justify-center p-6">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay for integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {item.isFeatured && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg"
            >
              Popular
            </motion.span>
          )}
          <div className="flex gap-2">
            {item.isSpicy && (
              <span className="bg-destructive/10 backdrop-blur-md text-destructive border border-destructive/20 w-8 h-8 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </span>
            )}
            {item.isVegetarian && (
              <span className="bg-success/10 backdrop-blur-md text-success border border-success/20 w-8 h-8 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4 fill-current" />
              </span>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-md border border-border/50 text-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-warning text-warning" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className="text-lg font-bold text-primary whitespace-nowrap">
              {formatPrice(item.price)}
            </span>
          </div>

          {item.nameUrdu && (
            <p className="text-sm text-muted-foreground/70 font-medium text-right font-noto-nastaliq" dir="rtl">
              {item.nameUrdu}
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-6 leading-relaxed flex-grow">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{item.prepTime} min</span>
          </div>

          <Button
            size="sm"
            className="rounded-full px-5 h-9 font-semibold shadow-none group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
