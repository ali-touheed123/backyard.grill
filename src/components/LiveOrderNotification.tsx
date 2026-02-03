import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';

const orderMessages = [
  { name: 'Ahmed', item: 'Chicken Biryani', area: 'F-7' },
  { name: 'Sara', item: 'Mutton Karahi', area: 'G-9' },
  { name: 'Bilal', item: 'Seekh Kebab', area: 'I-8' },
  { name: 'Fatima', item: 'Butter Chicken', area: 'E-11' },
  { name: 'Hassan', item: 'Malai Boti', area: 'F-10' },
  { name: 'Ayesha', item: 'Chicken Karahi', area: 'G-11' },
  { name: 'Usman', item: 'Chapli Kebab', area: 'F-6' },
  { name: 'Zara', item: 'Kashmiri Chai', area: 'G-8' },
];

export function LiveOrderNotification() {
  const [currentOrder, setCurrentOrder] = useState(orderMessages[0]);
  const [isVisible, setIsVisible] = useState(false);
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    const showNotification = () => {
      setCurrentOrder(orderMessages[orderIndex]);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 4000);

      setOrderIndex((prev) => (prev + 1) % orderMessages.length);
    };

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 3000);

    // Repeat every 8 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [orderIndex]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-24 left-4 z-50 md:top-auto md:bottom-8 w-auto max-w-[calc(100vw-32px)] sm:max-w-[280px]"
        >
          <div className="flex items-center gap-3 bg-card/95 backdrop-blur-lg border border-border rounded-2xl px-4 py-3 shadow-elevated">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentOrder.name} just ordered
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentOrder.item}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="text-xs text-primary">{currentOrder.area}, Islamabad</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Just now
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
