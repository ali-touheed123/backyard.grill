import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, Search, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';

interface HeaderProps {
  onCartClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOrderNowClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({
  onCartClick,
  searchQuery = '',
  onSearchChange,
  onOrderNowClick,
  onSearchClick
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getSubtotal());

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border"
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-primary to-warning rounded-xl flex items-center justify-center shadow-glow cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">🍽️</span>
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="font-heading font-bold text-lg text-foreground leading-none">
              Backyard Grill
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-warning text-warning" />
              <span className="text-xs text-muted-foreground">4.9 • Pakistani Cuisine</span>
            </div>
          </div>
        </div>

        {/* Search - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search biryani, karahi, kebabs..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/10 focus:outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Phone - Desktop */}
          <Button variant="ghost" size="sm" className="hidden lg:flex gap-2 text-muted-foreground hover:text-primary" asChild>
            <a href="tel:+923001234567">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+92 300 1234567</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-10 h-10"
            onClick={onSearchClick}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>

          {/* Cart Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </Button>
          </motion.div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Desktop Auth / Cart Summary */}
          <div className="hidden md:flex items-center gap-3">
            {itemCount > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right mr-2"
              >
                <p className="text-xs text-muted-foreground">{itemCount} items</p>
                <p className="text-sm font-bold text-primary">Rs {total.toLocaleString()}</p>
              </motion.div>
            )}
            <Button
              className="shadow-glow"
              onClick={onOrderNowClick}
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-base"
                onClick={() => {
                  onOrderNowClick?.();
                  setIsMobileMenuOpen(false);
                }}
              >
                Menu
              </Button>
              <Button variant="ghost" className="w-full justify-start text-base">About Us</Button>
              <Button variant="ghost" className="w-full justify-start text-base">Contact</Button>
              <div className="pt-2">
                <Button className="w-full" onClick={() => {
                  onOrderNowClick?.();
                  setIsMobileMenuOpen(false);
                }}>
                  Order Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
