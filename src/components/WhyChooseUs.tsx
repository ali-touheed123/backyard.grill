import { motion } from 'framer-motion';
import { ChefHat, Timer, Leaf, Award, Truck, Shield } from 'lucide-react';

const features = [
  {
    icon: ChefHat,
    title: 'Master Chefs',
    description: '20+ years of expertise crafting authentic Pakistani flavors',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Locally sourced, premium quality ingredients daily',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: Timer,
    title: 'Fast Delivery',
    description: '30-45 min guaranteed or your next order is free',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Best Pakistani Restaurant 2024 - Islamabad Food Awards',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Truck,
    title: 'Live Tracking',
    description: 'Track your order in real-time from kitchen to door',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Safe & Hygienic',
    description: 'Contactless delivery with sealed packaging',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-2">
            Why Table to Door
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Best Choice for Pakistani Food
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're not just delivering food, we're delivering an experience
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '4.8★', label: 'Average Rating' },
            { value: '30min', label: 'Avg Delivery' },
            { value: '100%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-5 text-center"
            >
              <div className="font-heading text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
