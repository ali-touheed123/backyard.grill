
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Utensils } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
    suggestions: MenuItem[];
    onItemClick: (item: MenuItem) => void;
    isVisible: boolean;
    className?: string;
}

export function SearchSuggestions({
    suggestions,
    onItemClick,
    isVisible,
    className
}: SearchSuggestionsProps) {
    return (
        <AnimatePresence>
            {isVisible && suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                        "absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50",
                        className
                    )}
                >
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="p-2 space-y-1">
                            {suggestions.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layoutId={`search-${item.id}`}
                                    onClick={() => onItemClick(item)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer group transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder.png'; // Fallback
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                                {item.name}
                                            </h4>
                                            <span className="text-xs font-semibold text-primary">
                                                Rs {item.price}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {item.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
