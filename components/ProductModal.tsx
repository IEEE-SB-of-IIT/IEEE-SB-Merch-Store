"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    normal_price?: string | number;
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
    codesprint: '#ff6a3d',
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const { addToCart } = useCart();
    const { theme } = useTheme();
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    const variants = product.variants;
    const [variantIdx, setVariantIdx] = useState(() =>
        Math.max(0, variants?.findIndex((v) => v.product.id === product.id) ?? 0)
    );
    const activeVariant = variants?.[variantIdx];
    const current = activeVariant?.product ?? product;
    const displayName = product.baseName ?? current.name;

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
            quantity,
        });
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const adjustQuantity = (delta: number) => setQuantity(prev => Math.max(1, prev + delta));

    const priceNum = typeof current.price === 'string' ? parseFloat(current.price) : current.price;
    const formattedPrice = `LKR ${priceNum.toLocaleString()}`;
    const normalPriceNum = current.normal_price ? (typeof current.normal_price === 'string' ? parseFloat(current.normal_price) : current.normal_price) : null;
    const formattedNormalPrice = normalPriceNum ? `LKR ${normalPriceNum.toLocaleString()}` : null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

            {/* Modal — bottom sheet on mobile, fixed 560px card on desktop */}
            <div
                className="relative w-full md:max-w-5xl md:h-[560px] bg-[#0d0b09] rounded-t-2xl md:rounded-[28px] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 md:zoom-in-95 duration-300 flex flex-col md:flex-row"
                style={{ maxHeight: '82dvh' }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="w-4 h-4 text-white" />
                </button>

                {/* ── LEFT: image panel ── fixed height on mobile, flex-fill on desktop */}
                <div className="relative md:flex-1 h-[260px] md:h-auto flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent overflow-hidden shrink-0">
                    {/* Glow blob */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 60%, ${activeColor} 0%, transparent 65%)`,
                            transition: 'background 0.5s ease',
                        }}
                    />

                    {/* Product title overlay — top-left */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 max-w-[55%]">
                        <h2
                            className="font-manrope font-black text-2xl md:text-5xl leading-[0.88] uppercase break-words drop-shadow-lg"
                            style={{ color: activeColor }}
                        >
                            {displayName}
                        </h2>
                    </div>

                    {/* Product image */}
                    <div className="relative w-[200px] h-[240px] md:w-[460px] md:h-[520px]">
                        <Image
                            key={current.id}
                            src={current.image}
                            alt={current.name}
                            fill
                            sizes="(max-width: 768px) 300px, 500px"
                            className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)] animate-in fade-in duration-300"
                        />
                    </div>
                </div>

                {/* ── RIGHT: controls panel ── */}
                <div className="w-full md:w-[340px] lg:w-[380px] flex flex-col border-t md:border-t-0 md:border-l border-white/[0.08] bg-black/60 min-h-0">
                    <div className="p-5 md:p-8 space-y-4 md:space-y-6 flex-1 overflow-y-auto">

                        {/* Name + price */}
                        <div>
                            <p className="font-manrope text-white/50 text-xs uppercase tracking-widest mb-1">Product</p>
                            <p className="font-manrope font-bold text-white text-lg leading-snug">{displayName}</p>
                            <div className="flex items-baseline gap-3 mt-1">
                                <p className="font-manrope font-extrabold text-2xl" style={{ color: activeColor }}>{formattedPrice}</p>
                                {formattedNormalPrice && (
                                    <p className="font-manrope font-semibold text-lg line-through text-white/40">
                                        {formattedNormalPrice}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Color variants */}
                        {variants && variants.length > 1 && (
                            <div>
                                <p className="font-manrope text-white/50 text-xs uppercase tracking-widest mb-3">Color</p>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((v, vi) => (
                                        <button
                                            key={v.product.id}
                                            onClick={() => setVariantIdx(vi)}
                                            className="px-4 h-9 rounded-full border text-sm font-manrope font-semibold transition-all"
                                            style={variantIdx === vi ? {
                                                backgroundColor: `${activeColor}20`,
                                                borderColor: activeColor,
                                                color: activeColor,
                                            } : {
                                                borderColor: 'rgba(255,255,255,0.2)',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            <span
                                                aria-hidden
                                                className="inline-block w-2.5 h-2.5 rounded-full border border-white/30 mr-1.5 align-middle"
                                                style={{ backgroundColor: v.color.toLowerCase() === 'white' ? '#f2f2f2' : '#1a1a1a' }}
                                            />
                                            {v.color}
                                            {v.product.sold_out && <span className="text-[10px] opacity-60 ml-1">(sold out)</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="font-manrope text-white/50 text-xs uppercase tracking-widest">Size</p>
                                <Link
                                    href="/codesprint/size-chart"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-1.5 font-manrope text-[11px] uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ color: activeColor }}
                                >
                                    <Ruler className="w-3 h-3" strokeWidth={2} />
                                    Size chart
                                </Link>
                            </div>
                            <div className="flex gap-2">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className="w-10 h-10 rounded-full border text-sm font-manrope font-bold transition-all"
                                        style={selectedSize === size ? {
                                            backgroundColor: `${activeColor}20`,
                                            borderColor: activeColor,
                                            color: activeColor,
                                        } : {
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="font-manrope text-white/50 text-xs uppercase tracking-widest mb-2">Description</p>
                            <p className="font-manrope text-white/70 text-sm leading-relaxed">{current.description}</p>
                        </div>

                        {/* Quantity */}
                        <div>
                            <p className="font-manrope text-white/50 text-xs uppercase tracking-widest mb-3">Quantity</p>
                            <div className="flex items-center gap-4 bg-white/5 rounded-full w-fit px-2 py-1 border border-white/10">
                                <button
                                    onClick={() => adjustQuantity(-1)}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors disabled:opacity-30"
                                >
                                    <Minus className="w-3 h-3 text-white" />
                                </button>
                                <span className="font-manrope font-bold text-white w-4 text-center">{quantity}</span>
                                <button
                                    onClick={() => adjustQuantity(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Plus className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add to cart — pinned outside scroll area */}
                    <div className="px-5 pb-5 pt-3 md:px-8 md:pb-8 md:pt-4 shrink-0 border-t border-white/[0.06] bg-black/60">
                        {current.sold_out ? (
                            <div className="w-full py-4 text-center font-manrope font-black rounded-full uppercase tracking-widest text-sm bg-white/5 text-white/40 border border-white/10 cursor-not-allowed select-none">
                                Sold Out
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-4 font-manrope font-black rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                                style={{
                                    backgroundColor: activeColor,
                                    color: '#000',
                                    boxShadow: `0 0 24px ${activeColor}50`,
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
