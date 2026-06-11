"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    image: string;
    sold_out?: boolean;
    baseName?: string;
    variants?: { color: string; product: Product }[];
}

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL'];

const NAV_COLORS: Record<string, string> = {
    codesprint: '#ff6a3d', // CS11 orange (matches codesprint.lk accent)
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const { addToCart } = useCart();
    const { theme } = useTheme();
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    // Colorway selection — each variant is its own product row, so inventory
    // and order lines stay per-color.
    const variants = product.variants;
    const [variantIdx, setVariantIdx] = useState(() =>
        Math.max(0, variants?.findIndex((v) => v.product.id === product.id) ?? 0)
    );
    const activeVariant = variants?.[variantIdx];
    const current = activeVariant?.product ?? product;
    const displayName = product.baseName ?? current.name;

    // Use specific Nav Hover color, fallback to theme accent if not found
    const activeColor = NAV_COLORS[theme.id] || theme.colors.accent;

    const handleAddToCart = () => {
        if (current.sold_out) return;
        addToCart({
            id: `${current.id}-${selectedSize}`,
            productId: current.id,
            name: current.name,
            price: current.price,
            image: current.image,
            selectedColor: activeVariant?.color || 'Default',
            selectedSize,
            quantity: quantity
        });
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const adjustQuantity = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
                style={{ willChange: 'opacity' }}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl h-[600px] bg-white/5 backdrop-blur-xl rounded-[30px] border border-white/10 shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Left Side - Product Image */}
                <div className="relative flex-1 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-12">
                    {/* Background abstract shape */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
                        <div
                            className="w-full h-full blur-[100px] rounded-full transition-colors duration-500 gpu-accelerated"
                            style={{ backgroundColor: activeColor }}
                        />
                    </div>

                    <div className="relative z-10 w-full h-full">
                        <div className="absolute top-0 left-0">
                            <div className="flex items-center gap-2 opacity-70 mb-2">
                                <div className="w-6 h-6 bg-white/20 rounded-full" />
                                <span className="font-bold text-white tracking-wide">IEEE SB</span>
                            </div>
                            <h2
                                className="text-5xl font-black leading-[0.9] drop-shadow-lg uppercase break-words max-w-[300px] transition-colors duration-500"
                                style={{ color: activeColor }}
                            >
                                {displayName}
                            </h2>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-[350px] h-[450px]">
                                <Image
                                    key={current.id}
                                    src={current.image}
                                    alt={current.name}
                                    fill
                                    sizes="350px"
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Controls */}
                <div className="w-[350px] backdrop-blur-3xl flex flex-col p-10 text-white border-l border-white/5 bg-black/80">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="mt-12 space-y-8">
                        {/* Product Name */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Product</span>
                            <div className="text-xl font-bold tracking-wide text-white">
                                {displayName}
                            </div>
                        </div>

                        {/* Color Selector — only when this type comes in more than one colorway */}
                        {variants && variants.length > 1 && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Color</span>
                                <div className="flex items-center gap-3">
                                    {variants.map((v, vi) => (
                                        <button
                                            key={v.product.id}
                                            onClick={() => setVariantIdx(vi)}
                                            className={`px-4 h-10 rounded-full border flex items-center gap-2 text-sm font-medium transition-all ${variantIdx === vi
                                                ? 'bg-white/10 text-white border-transparent'
                                                : 'border-white/20 hover:bg-white/5 text-white/60'
                                                }`}
                                            style={variantIdx === vi ? {
                                                backgroundColor: `${activeColor}20`,
                                                borderColor: activeColor,
                                                color: activeColor
                                            } : {}}
                                        >
                                            <span
                                                aria-hidden
                                                className="w-3 h-3 rounded-full border border-white/30"
                                                style={{ backgroundColor: v.color.toLowerCase() === 'white' ? '#f2f2f2' : '#1a1a1a' }}
                                            />
                                            {v.color}
                                            {v.product.sold_out && <span className="text-[10px] opacity-60">(sold out)</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Size</span>
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size
                                            ? 'bg-white/10 text-white border-transparent'
                                            : 'border-white/20 hover:bg-white/5 text-white/60'
                                            }`}
                                        style={selectedSize === size ? {
                                            backgroundColor: `${activeColor}20`,
                                            borderColor: activeColor,
                                            color: activeColor
                                        } : {}}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase font-secondary">Description</span>
                            <p className="text-sm leading-relaxed text-white/80 font-secondary text-justify line-clamp-4">
                                {current.description}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Quantity</span>
                            <div className="flex items-center gap-4 bg-white/5 rounded-full w-fit p-1 border border-white/10">
                                <button
                                    onClick={() => adjustQuantity(-1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono font-bold w-4 text-center">{quantity}</span>
                                <button
                                    onClick={() => adjustQuantity(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        {current.sold_out ? (
                            <div className="w-full py-4 text-center font-black rounded-full uppercase tracking-widest text-sm bg-white/5 text-white/40 border border-white/10 cursor-not-allowed select-none">
                                Sold Out
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 font-black rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                                style={{
                                    backgroundColor: activeColor,
                                    color: '#000',
                                    boxShadow: `0 0 20px ${activeColor}40`
                                }}
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
