import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Clock, MapPin, Phone, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';



interface HeroSectionProps {
  onOrderNowClick?: () => void;
}

export function HeroSection({ onOrderNowClick }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/menu/hero-main.png"
          alt="Backyard Grill Signature Items"
          className="w-full h-[110%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </motion.div>



      {/* Content */}
      <div className="container relative z-20 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity }} className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-success/20 backdrop-blur-md border border-success/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
              </span>
              <span className="text-sm font-semibold text-success">
                Open Now
              </span>
              <span className="text-primary-foreground/60">•</span>
              <span className="text-sm text-primary-foreground/80">
                Delivering in 25-35 min
              </span>
            </motion.div>

            {/* Title with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-heading text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground mb-4 md:mb-6 leading-[1.2] tracking-tight"
            >
              Experience
              <br className="lg:hidden" />
              <span className="relative inline-block w-fit pb-1.5 lg:mx-4">
                <span className="bg-gradient-to-r from-primary via-warning to-primary bg-clip-text text-transparent whitespace-nowrap">
                  Authentic Pakistani
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-primary to-warning rounded-full shadow-sm"
                />
              </span>
              <br className="lg:hidden" />
              Cuisine
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed"
            >
              From our kitchen to your table — savor the rich flavors of
              <span className="text-primary font-semibold"> traditional recipes </span>
              crafted with love and the finest spices.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-6 mb-8"
            >
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="font-bold text-primary-foreground">4.9</span>
                <span className="text-primary-foreground/60 text-sm">(2,547+)</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-primary-foreground/80 text-sm">25-35 min</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="w-5 h-5 text-success" />
                <span className="text-primary-foreground/80 text-sm">50K+ served</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className="text-lg px-8 h-14 shadow-glow hover:shadow-hero transition-all duration-300 group"
                onClick={onOrderNowClick}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Order Now
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                asChild
              >
                <a href="tel:+923001234567">
                  <Phone className="w-5 h-5 mr-2" />
                  +92 300 1234567
                </a>
              </Button>
            </motion.div>

            {/* Trending Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 inline-flex items-center gap-2 text-primary-foreground/60 text-sm"
            >
              <TrendingUp className="w-4 h-4 text-success" />
              <span>Trending:</span>
              <span className="text-primary font-medium">Chicken Biryani</span>
              <span>•</span>
              <span className="text-primary font-medium">Mutton Karahi</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient - Reduced intensity and height */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center text-primary-foreground/60"
        >
          <span className="text-xs mb-2">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section >
  );
}
