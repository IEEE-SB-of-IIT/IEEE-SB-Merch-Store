'use client';

import Image from 'next/image';
import { ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';
import ProductModal from './ProductModal';

interface Product {
    id: number;
    name: string;
    desc: string;
    price: string;
    image: string;
}

interface ProductGridProps {
    theme?: 'default' | 'codesprint' | 'ix';
    products?: Product[];
}

export default function ProductGrid({ theme = 'default', products: customProducts }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const defaultProducts = [
        { id: 1, name: 'AURORA SILVER', desc: 'REFLECTIVE PUFFER JACKET', price: '$999.99', image: '/images/hero.png' },
        { id: 2, name: 'FROST SILVER', desc: 'HIGH GLOSS PUFFER', price: '$1,299.99', image: '/images/hero.png' },
        { id: 3, name: 'STEALTH BLACK', desc: 'HEAVY SHIELD PUFFER', price: '$1,199.99', image: '/images/hero.png' },
        { id: 4, name: 'GLACIER WHITE', desc: 'INSULATED PUFFER JACKET', price: '$1,199.99', image: '/images/product_1.png' },
        { id: 5, name: 'POLAR GLOSS', desc: 'BLUE PUFFER JACKET', price: '$899.99', image: '/images/product_1.png' },
        { id: 6, name: 'DEEPFIELD BLUE', desc: 'TECH PUFFER JACKET', price: '$999.99', image: '/images/product_1.png' },
        { id: 7, name: 'POLAR WHITE', desc: 'SHELL PUFFER JACKET', price: '$1,499.99', image: '/images/product_1.png' },
    ];

    const allProducts = customProducts || defaultProducts;
    const featuredProduct = allProducts[0];

    const showFeatured = featuredProduct.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        featuredProduct.desc.toLowerCase().includes(searchQuery.toLowerCase());

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase())
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
            bg: 'bg-[#602000]',
            accent: 'bg-orange-500',
            accentText: 'text-orange-500',
            cardBg: 'bg-white/5',
            cardHover: 'hover:bg-white/10',
            buttonBg: 'bg-orange-500 text-black',
            buttonHover: 'hover:bg-white hover:text-black',
            blueDot: 'bg-orange-500' // Orange dot for codesprint
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
        <section className={`${styles.bg} text-white py-24 px-6 md:px-12 transition-colors duration-500`}>
            <div className="w-full max-w-[1400px] mx-auto">

                {/* Section Header */}
                <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
                    <h2 className="text-4xl md:text-6xl font-black tracking-wider uppercase">New Collection</h2>
                    <h2 className="text-4xl md:text-6xl font-black tracking-wider uppercase">New Collection</h2>
                    <div className="flex gap-12 text-[10px] tracking-widest uppercase opacity-60 hidden md:flex font-secondary">
                        <span>[ NEW COLLECTION ]</span>
                        <span>[ SERIES 01 ]</span>
                        <span>[ FUTURA ]</span>
                    </div>
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
                            onClick={() => setSelectedProduct(featuredProduct)}
                            className={`col-span-2 md:col-span-2 row-span-1 relative aspect-auto ${styles.cardBg} rounded-sm overflow-hidden group cursor-pointer`}
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
                                    <span className="font-secondary text-sm tracking-tight">{featuredProduct.price}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Cards */}
                    {filteredProducts.filter(p => p.id !== featuredProduct.id).map((p, i) => (
                        <div
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            className={`group relative ${styles.cardBg} rounded-sm p-4 ${styles.cardHover} transition-colors cursor-pointer`}
                            style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}
                        >
                            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-sm bg-white/5">
                                <Image src={p.image} alt={p.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm tracking-wide">{p.name}</h4>
                                <p className="text-[10px] text-white/50 tracking-wider uppercase">{p.desc}</p>
                                <div className="flex justify-between items-center mt-3 border-t border-white/10 pt-3">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <div className={`w-2 h-2 rounded-full ${styles.blueDot}`} />
                                    </div>
                                    <span className="font-secondary text-xs opacity-70 tracking-tight">{p.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </section>
    )
}
