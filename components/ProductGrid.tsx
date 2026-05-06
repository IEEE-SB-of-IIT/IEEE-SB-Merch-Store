'use client';

import Image from 'next/image';
import { ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';
import { useUI } from '../context/UIContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    sold_out?: boolean;
}

interface ProductGridProps {
    theme?: 'default' | 'codesprint' | 'ix';
    products?: Product[];
}

export default function ProductGrid({ theme = 'default', products: customProducts }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const { openProductModal } = useUI();
    // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Removed local state

    const defaultProducts = [
        { id: 1, name: 'DEV OVERSIZED', description: 'PREMIUM COTTON TEE', price: 'LKR 2,500.00', image: '/images/hero.png', sold_out: false },
        { id: 2, name: 'CODE HOODIE', description: 'HEAVYWEIGHT COTTON', price: 'LKR 4,500.00', image: '/images/hero.png', sold_out: false },
        { id: 3, name: 'SYSTEM BLACK', description: 'TECH CARGO PANTS', price: 'LKR 5,500.00', image: '/images/hero.png', sold_out: false },
        { id: 4, name: 'IEEE CLASSIC', description: 'SIGNATURE WHITE TEE', price: 'LKR 2,000.00', image: '/images/product_1.png', sold_out: false },
        { id: 5, name: 'BLUEPRINT', description: 'GRAPHIC LONG SLEEVE', price: 'LKR 3,500.00', image: '/images/product_1.png', sold_out: true },
        { id: 6, name: 'TECH CAP', description: 'EMBROIDERED SNAPBACK', price: 'LKR 1,500.00', image: '/images/product_1.png', sold_out: false },
        { id: 7, name: 'VARSITY', description: 'LIMITED EDITION JACKET', price: 'LKR 8,500.00', image: '/images/product_1.png', sold_out: false },
    ];

    const allProducts = customProducts || defaultProducts;

    if (!allProducts || allProducts.length === 0) {
        return (
            <section className={`text-white py-24 px-6 md:px-12 bg-black/50 text-center`}>
                <h2 className="text-2xl font-bold opacity-50">No products found for this collection yet.</h2>
                <p className="text-sm mt-2 opacity-30">Check back later or add products via Admin.</p>
            </section>
        );
    }

    const featuredProduct = allProducts[0];

    const showFeatured = featuredProduct && (featuredProduct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        featuredProduct.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const themeConfig = {
        default: {
            bg: 'bg-arctic-base',
            accent: 'bg-arctic-cyan',
            accentText: 'text-arctic-cyan',
            cardBg: 'bg-[#3e4c59]/30 backdrop-blur-sm border border-white/5',
            cardHover: 'hover:bg-[#3e4c59]/60 hover:border-arctic-cyan/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]',
            buttonBg: 'bg-white text-arctic-dark',
            buttonHover: 'hover:bg-arctic-cyan',
            blueDot: 'bg-blue-500' // Keeping original blue dot for default
        },
        codesprint: {
            bg: 'bg-cs-midnight',
            accent: 'bg-cs-coral',
            accentText: 'text-cs-coral',
            cardBg: 'bg-white/5 border border-cs-storm/30',
            cardHover: 'hover:bg-white/10 hover:border-cs-coral/40 hover:shadow-[0_0_20px_rgba(255,91,65,0.1)]',
            buttonBg: 'bg-cs-coral text-white',
            buttonHover: 'hover:bg-cs-amber hover:text-black',
            blueDot: 'bg-cs-coral'
        },
        ix: {
            bg: 'bg-[#450a25]',
            accent: 'bg-[#FF0879]',
            accentText: 'text-[#FF0879]',
            cardBg: 'bg-white/5',
            cardHover: 'hover:bg-white/10',
            buttonBg: 'bg-[#FF0879] text-white',
            buttonHover: 'hover:bg-[#ACD5F8] hover:text-black',
            blueDot: 'bg-[#ACD5F8]' // Blue dot for IX
        }
    };

    const styles = themeConfig[theme] || themeConfig.default;

    return (
        <section id="product-grid" className={`${styles.bg} text-white py-24 px-6 md:px-12 transition-colors duration-500 relative overflow-hidden`}>
            {/* Noise Overlay */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />
            <div className="w-full max-w-[1400px] mx-auto relative z-10">

                {/* Section Header */}
                <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <h2 className={`text-4xl md:text-6xl font-black tracking-wider uppercase ${theme === 'codesprint' ? 'font-mortend' : ''}`}>New Collection</h2>
                    <div className={`relative flex items-center px-4 py-2 rounded-sm border ${theme === 'default' ? 'border-white/20 bg-white/5' : 'border-black/20 bg-black/5'} w-64`}>
                        <Search className="w-4 h-4 opacity-50 mr-2" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs font-bold uppercase w-full placeholder:opacity-50 font-secondary"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                    {/* Featured Card (Only show if matches search) */}
                    {showFeatured && (
                        <div
                            onClick={() => !featuredProduct.sold_out && openProductModal(featuredProduct)}
                            className={`col-span-2 md:col-span-2 row-span-1 relative aspect-[5/4] ${styles.cardBg} rounded-sm overflow-hidden group ${featuredProduct.sold_out ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                            style={{ clipPath: 'polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <Image src={featuredProduct.image} alt={featuredProduct.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute bottom-8 left-8 z-20">
                                <h3 className="text-3xl font-black mb-2">{featuredProduct.name}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                    <span className="font-secondary text-sm">{featuredProduct.price}</span>
                                </div>
                                {featuredProduct.sold_out && (
                                    <div className="mt-4 px-3 py-1 bg-red-600/80 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest w-fit border border-red-500/50">
                                        Sold Out
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Standard Cards */}
                    {filteredProducts.filter(p => p.id !== featuredProduct.id).map((p, i) => (
                        <div
                            key={p.id}
                            onClick={() => !p.sold_out && openProductModal(p)}
                            className={`group relative ${styles.cardBg} rounded-sm p-4 ${styles.cardHover} transition-colors ${p.sold_out ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                        >
                            {p.sold_out && (
                                <div className="absolute top-4 right-4 z-20 px-2 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-red-500/30">
                                    Sold Out
                                </div>
                            )}
                            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-white/5">
                                <Image src={p.image} alt={p.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 gpu-accelerated" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-wide">{p.name}</h4>
                                <p className="text-[10px] text-white/50 tracking-wider uppercase">{p.description}</p>
                                <div className="flex justify-end items-center mt-3 border-t border-white/10 pt-3">
                                    <span className="font-secondary text-xs opacity-70">{p.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            {/* Local Modal Removed */}
        </section>
    )
}
