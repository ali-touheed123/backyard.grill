import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TrustBadges } from '@/components/TrustBadges';
import { FeaturedItems } from '@/components/FeaturedItems';
import { SpecialOffersBanner } from '@/components/SpecialOffersBanner';
import { CategoryTabs } from '@/components/CategoryTabs';
import { MenuItemCard } from '@/components/MenuItemCard';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { SearchOverlay } from '@/components/SearchOverlay';
import { MobileNav } from '@/components/MobileNav';
import { LiveOrderNotification } from '@/components/LiveOrderNotification';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/store/cartStore';
import { categories, menuItems } from '@/data/mockData';
import type { MenuItem } from '@/types/menu';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  const filteredItems = useMemo(() => {
    let items = menuItems;

    // First apply search if any
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.nameUrdu && item.nameUrdu.includes(query))
      );
    }

    // Then apply category filter
    if (activeCategory === 'popular') {
      return items.filter((item) => item.isFeatured);
    }
    return items.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, searchQuery]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.nameUrdu && item.nameUrdu.includes(query))
    );
  }, [searchQuery]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleSearchItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
    setIsSearchOverlayOpen(false);
    setSearchQuery('');
  };

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item, 1);
    toast.success(`Added ${item.name} to cart!`, {
      description: `Rs ${item.price.toLocaleString()}`,
    });
  };

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOrderNowClick={scrollToMenu}
        onSearchClick={() => setIsSearchOverlayOpen(true)}
        searchResults={searchResults}
        onItemClick={handleSearchItemClick}
      />

      {/* Hero */}
      <HeroSection onOrderNowClick={scrollToMenu} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Items */}
      <FeaturedItems items={menuItems} onItemClick={handleItemClick} />

      {/* Special Offers Banner */}
      <SpecialOffersBanner onOrderNowClick={scrollToMenu} />

      {/* Menu Section */}
      <section className="py-8 md:py-16" id="menu">
        <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Full Menu
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Explore Our Delicious Menu
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every dish tells a story of tradition, crafted with authentic spices and love
            </p>
          </motion.div>

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 pt-4">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleQuickAdd}
                  onItemClick={handleItemClick}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer onMenuClick={scrollToMenu} />

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (tab === 'menu') {
            scrollToMenu();
          } else if (tab === 'orders') {
            toast.info("Order tracking coming soon!", {
              description: "You'll be able to view your order history here."
            });
          }
        }}
      />

      {/* Live Order Notifications */}
      <LiveOrderNotification />

      {/* Floating CTA */}
      <FloatingCTA
        onCartClick={() => setIsCartOpen(true)}
        onOrderNowClick={scrollToMenu}
      />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={() => {
          setIsSearchOverlayOpen(false);
          scrollToMenu();
        }}
        searchResults={searchResults}
        onItemClick={handleSearchItemClick}
      />
    </div>
  );
};

export default Index;
