'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useUI, Product } from '../context/UIContext';
import { supabase } from '@/lib/supabase';

export default function SearchOverlay() {
    const { isSearchOpen, closeSearch, openProductModal } = useUI();
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all products on mount (or only when opened if perf matters, but mount is simpler for now)
    useEffect(() => {
        const fetchProducts = async () => {
            // Only fetch if we haven't already
            if (products.length > 0) return;

            setIsLoading(true);
            const { data, error } = await supabase.from('products').select('*');
            if (!error && data) {
                setProducts(data);
            }
            setIsLoading(false);
        };

        if (isSearchOpen) {
            fetchProducts();
        }
    }, [isSearchOpen, products.length]);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredProducts([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
        setFilteredProducts(results);
    }, [query, products]);

    const handleProductClick = (product: Product) => {
        openProductModal(product);
        closeSearch();
    };

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        onClick={closeSearch}
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 w-full max-w-4xl mx-auto pt-24 px-6"
                    >
                        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                            <SearchIcon className="w-6 h-6 text-white/50" />
                            <input
                                type="text"
                                placeholder="SEARCH ARCHIVE..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                                className="w-full bg-transparent text-2xl md:text-4xl text-white font-bebas tracking-wide placeholder:text-white/20 outline-none"
                            />
                            <button onClick={closeSearch} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="mt-8 h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                            {isLoading && <div className="text-white/40 text-sm font-mono tracking-widest">LOADING...</div>}

                            {!isLoading && query && filteredProducts.length === 0 && (
                                <div className="text-white/40 text-sm font-mono tracking-widest">NO RESULTS FOUND.</div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => handleProductClick(product)}
                                        className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <div className="relative w-16 h-16 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold tracking-wide">{product.name}</h4>
                                            <p className="text-white/40 text-xs font-mono">{product.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white/70 font-mono text-sm block">{product.price}</span>
                                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mt-1 group-hover:bg-white/10 transition-colors ml-auto">
                                                <ArrowRight className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
