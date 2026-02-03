import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

interface FloatingCTAProps {
  onCartClick: () => void;
  onOrderNowClick?: () => void;
}

export function FloatingCTA({ onCartClick }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getSubtotal());

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 right-4 z-50 md:bottom-8"
        >
          {/* Cart Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onCartClick}
              className="h-14 gap-3 rounded-full shadow-glow px-5 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-current" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              </div>
              <span className="font-bold">
                Rs {total.toLocaleString()}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
