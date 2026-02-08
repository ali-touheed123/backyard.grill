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
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
      onClick={() => onItemClick(item)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#F8FAFC]">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient Overlay (Fade to white at bottom) - Subtler height */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white via-white/40 to-transparent opacity-100" />

        {/* Badges */}
        <div className="absolute top-4 left-4">
          {(item.isVegetarian || item.categoryId === 'drinks') && (
            <div className="bg-[#10B981] w-10 h-10 rounded-full flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white fill-current" />
            </div>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-[#1F2937]/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-2xl flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          4.8
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-heading font-bold text-xl text-[#FF6B35] group-hover:text-black transition-colors duration-300">
            {item.name}
          </h3>
          <span className="font-heading font-bold text-black text-xl group-hover:text-[#FF6B35] transition-colors duration-300">
            Rs {item.price}
          </span>
        </div>

        <p className="text-base text-[#64748B] mb-6 line-clamp-1">
          {item.description}
        </p>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#64748B]">
            <Clock className="w-5 h-5" />
            <span className="text-base font-medium">{item.prepTime} min</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            className="flex items-center gap-1 text-[#FF6B35] font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
