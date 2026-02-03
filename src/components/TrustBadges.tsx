import { motion } from 'framer-motion';
import { Shield, Clock, Award, ThumbsUp } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    text: '100% Halal Certified',
  },
  {
    icon: Clock,
    text: 'On-Time Delivery Guarantee',
  },
  {
    icon: Award,
    text: 'Premium Quality',
  },
  {
    icon: ThumbsUp,
    text: 'Money Back Promise',
  },
];

export function TrustBadges() {
  return (
    <div className="w-full border-y border-border bg-muted/30 py-4 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <badge.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium whitespace-nowrap">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
