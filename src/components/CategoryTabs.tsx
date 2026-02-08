import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MenuCategory } from '@/types/menu';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative py-4 group">
      {/* Gradient Fades - Only on Desktop */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none hidden md:block" />

      {/* Scroll Buttons - Only on Desktop */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-glow border-2 border-primary/20 bg-background/90 backdrop-blur-md hover:scale-110 active:scale-95 transition-all h-12 w-12"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </Button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-glow border-2 border-primary/20 bg-background/90 backdrop-blur-md hover:scale-110 active:scale-95 transition-all h-12 w-12"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </Button>
      </div>

      {/* Categories */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 py-2"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300
              ${activeCategory === category.id
                ? 'text-primary-foreground shadow-glow scale-105 z-10'
                : 'bg-card hover:bg-muted text-foreground border border-border hover:border-primary/30 z-0'
              }
            `}
            whileHover={{ scale: activeCategory === category.id ? 1.05 : 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Sliding Active Indicator */}
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-primary rounded-2xl -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            <span className="text-lg">{category.icon}</span>
            <span className="font-semibold">{category.name}</span>
            <span className={`
              text-xs font-bold px-2 py-0.5 rounded-full
              ${activeCategory === category.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-primary/10 text-primary'
              }
            `}>
              {category.itemCount}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
