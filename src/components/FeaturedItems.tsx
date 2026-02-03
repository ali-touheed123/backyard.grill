import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MenuItem } from '@/types/menu';

interface FeaturedItemsProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function FeaturedItems({ items, onItemClick }: FeaturedItemsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featuredItems = items.filter((item) => item.isFeatured);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-10 bg-gradient-to-b from-background to-surface overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Trending Now
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Most Loved Dishes
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              What our customers can't stop ordering
            </p>
          </motion.div>

          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full h-10 w-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full h-10 w-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pt-4 pb-4 -mx-4 px-4"
        >
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onItemClick(item)}
              className="flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer group"
            >
              <div className="relative bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-hero transition-all duration-500 border border-transparent hover:border-primary/20">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                  {/* Order Count Badge */}
                  <div className="absolute top-3 left-3 bg-success/90 backdrop-blur-sm text-success-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Flame className="w-3 h-3" />
                    {100 + index * 23}+ ordered today
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-foreground/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3 h-3 fill-warning text-warning" />
                        <span className="text-xs font-bold text-primary-foreground">4.9</span>
                      </div>
                      <div className="flex items-center gap-1 bg-foreground/20 backdrop-blur-sm rounded-full px-2 py-1">
                        <Clock className="w-3 h-3 text-primary-foreground" />
                        <span className="text-xs text-primary-foreground">{item.prepTime}m</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-primary-foreground mb-1 drop-shadow-lg">
                      {item.name}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="p-4 flex items-center justify-between bg-card">
                  <div>
                    <span className="font-heading font-bold text-xl text-primary">
                      Rs {item.price.toLocaleString()}
                    </span>
                    {item.variations && item.variations.length > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">
                        from
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="rounded-full shadow-glow group-hover:shadow-lg transition-all">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
