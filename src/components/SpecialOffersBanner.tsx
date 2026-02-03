import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Percent, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface SpecialOffersBannerProps {
  onOrderNowClick?: () => void;
}

export function SpecialOffersBanner({ onOrderNowClick }: SpecialOffersBannerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;

        if (totalSeconds <= 0) {
          return { hours: 2, minutes: 45, seconds: 30 }; // Reset
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-8 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-warning" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tMi0yaDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 right-8 text-6xl opacity-20"
          >
            🍗
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-4 right-24 text-5xl opacity-20"
          >
            🍚
          </motion.div>

          {/* Content */}
          <div className="relative px-6 py-8 md:px-12 md:py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                  <Flame className="w-4 h-4 text-warning" />
                  <span className="text-sm font-semibold text-primary-foreground">Limited Time Offer</span>
                </div>

                <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                  Get 25% OFF Your First Order!
                </h3>
                <p className="text-primary-foreground/80 mb-4 max-w-md">
                  Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">WELCOME25</span> at checkout
                </p>

                <Button
                  size="lg"
                  className="bg-foreground hover:bg-foreground/90 text-background font-semibold gap-2"
                  onClick={onOrderNowClick}
                >
                  Order Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-primary-foreground/80 mb-3">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Offer ends in</span>
                </div>

                <div className="flex gap-2">
                  {[
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Mins' },
                    { value: timeLeft.seconds, label: 'Secs' },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <motion.div
                        key={item.value}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-foreground/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      >
                        <span className="font-heading text-2xl font-bold text-primary-foreground">
                          {formatTime(item.value)}
                        </span>
                      </motion.div>
                      <span className="text-xs text-primary-foreground/70 mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
