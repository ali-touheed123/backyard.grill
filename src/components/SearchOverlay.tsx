import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
}

const trendingSearches = ['Chicken Biryani', 'Mutton Karahi', 'Seekh Kabab', 'Gulab Jamun'];

export function SearchOverlay({
    isOpen,
    onClose,
    query,
    onQueryChange,
    onSearch,
}: SearchOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 z-[100] bg-background"
                >
                    <div className="container py-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="What are you craving?"
                                    value={query}
                                    onChange={(e) => onQueryChange(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/20 text-lg outline-none"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-14 w-14 rounded-2xl"
                                onClick={onClose}
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Trending Searches</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                onQueryChange(term);
                                                onSearch();
                                            }}
                                            className="px-4 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all text-sm font-medium"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {query && (
                                <div className="pt-4">
                                    <Button
                                        className="w-full h-14 rounded-2xl text-lg shadow-glow"
                                        onClick={onSearch}
                                    >
                                        Search for "{query}"
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
