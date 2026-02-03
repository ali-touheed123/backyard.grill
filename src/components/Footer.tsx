import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FooterProps {
  onMenuClick?: () => void;
}

export function Footer({ onMenuClick }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!', {
        description: "You'll receive exclusive offers and updates.",
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <h3 className="font-heading text-2xl font-bold mb-2">
                Get Exclusive Offers
              </h3>
              <p className="text-primary-foreground/70">
                Subscribe for special discounts and new menu updates!
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl">Table to Door</h3>
                <p className="text-xs text-primary-foreground/60">Authentic Pakistani Cuisine</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Experience the rich flavors of traditional Pakistani recipes made with love
              and the finest ingredients. Delivered fresh to your doorstep.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {['Menu', 'About Us', 'Contact', 'Franchise'].map((link) => (
                <li key={link}>
                  <a
                    href={link === 'Menu' ? '#menu' : '#'}
                    onClick={(e) => {
                      if (link === 'Menu') {
                        e.preventDefault();
                        onMenuClick?.();
                      }
                    }}
                    className="text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Opening Hours</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-primary-foreground/70">
                <span>Monday - Thursday</span>
                <span className="text-primary-foreground">11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between text-primary-foreground/70">
                <span>Friday - Saturday</span>
                <span className="text-primary-foreground">11:00 AM - 12:00 AM</span>
              </div>
              <div className="flex justify-between text-primary-foreground/70">
                <span>Sunday</span>
                <span className="text-primary-foreground">12:00 PM - 11:00 PM</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-success/20 rounded-xl border border-success/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="text-sm font-semibold text-success">Currently Open</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <a href="tel:+923001234567" className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors">
                <Phone className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary-foreground">+92 300 1234567</p>
                  <p className="text-xs">Call or WhatsApp</p>
                </div>
              </a>
              <a href="mailto:hello@tabletodoor.pk" className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary transition-colors">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary-foreground">hello@tabletodoor.pk</p>
                  <p className="text-xs">Email us anytime</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary-foreground">F-7 Markaz</p>
                  <p className="text-xs">Islamabad, Pakistan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© 2024 Table to Door. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
