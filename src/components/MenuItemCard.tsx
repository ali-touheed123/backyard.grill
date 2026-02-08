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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8FAFC] flex-shrink-0">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient Overlay (Fade to white at bottom) - Subtler height */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/40 to-transparent opacity-100" />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          {(item.isVegetarian || item.categoryId === 'drinks') && (
            <div className="bg-[#10B981] w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#1F2937]/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-1.5">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#F59E0B] text-[#F59E0B]" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 pt-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-bold text-sm sm:text-lg text-[#FF6B35] group-hover:text-black transition-colors duration-300 line-clamp-2 leading-tight flex-1">
            {item.name}
          </h3>
          <span className="font-heading font-bold text-black text-sm sm:text-lg group-hover:text-[#FF6B35] transition-colors duration-300 whitespace-nowrap">
            Rs {item.price}
          </span>
        </div>

        <p className="text-[10px] sm:text-sm text-[#64748B] mb-3 sm:mb-4 line-clamp-1">
          {item.description}
        </p>

        <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 text-[#64748B]">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-sm font-medium">{item.prepTime} min</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="flex items-center gap-0.5 sm:gap-1 text-[#FF6B35] font-bold text-sm sm:text-base hover:opacity-80 transition-opacity"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
