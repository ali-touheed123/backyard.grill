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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hero transition-all duration-500 cursor-pointer border border-transparent hover:border-primary/20"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500"
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {item.isFeatured && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg"
            >
              <Zap className="w-3 h-3 fill-current" />
              Popular
            </motion.span>
          )}
          {item.isSpicy && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-4 h-4" />
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-success text-success-foreground text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-foreground/80 backdrop-blur-sm text-primary-foreground text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 fill-warning text-warning" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-heading font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-heading font-bold text-primary whitespace-nowrap text-lg group-hover:text-foreground transition-colors">
            {formatPrice(item.price)}
          </span>
        </div>

        {item.nameUrdu && (
          <p className="text-sm text-primary/70 font-medium mb-2" dir="rtl">
            {item.nameUrdu}
          </p>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{item.prepTime} min</span>
          </div>


          {/* Mini Add Button */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs font-semibold text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
