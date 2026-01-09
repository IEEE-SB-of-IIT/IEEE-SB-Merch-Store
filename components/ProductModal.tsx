"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
    id: number;
    name: string;
    desc: string;
    price: string;
    image: string;
}

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

const COLORS = [
    { name: 'Onyx', value: '#1a1a1a' },
    { name: 'Arctic', value: '#e2e8f0' },
    { name: 'Sage', value: '#4a5d4f' },
    { name: 'Terra', value: '#8c5e40' }
];

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const { addToCart } = useCart();
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedSize, setSelectedSize] = useState('M');


    const handleAddToCart = () => {
        addToCart({
            id: `${product.id}-${selectedColor.name}-${selectedSize}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedColor: selectedColor.value,
            selectedSize,
            quantity: 1
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl h-[600px] bg-white/5 backdrop-blur-xl rounded-[30px] border border-white/10 shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Left Side - Product Image (Simulating the glass card look from reference) */}
                <div className="relative flex-1 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-12">
                    {/* Background abstract shape */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none">
                        <div className="w-full h-full bg-white/10 blur-[100px] rounded-full" />
                    </div>

                    <div className="relative z-10 w-full h-full">
                        <div className="absolute top-0 left-0">
                            <div className="flex items-center gap-2 opacity-70 mb-2">
                                {/* Fake Brand Logo Icon */}
                                <div className="w-6 h-6 bg-white/20 rounded-full" />
                                <span className="font-bold text-white tracking-wide">IEEE SB</span>
                            </div>
                            <h2 className="text-5xl font-black text-[#D4AF37] leading-[0.9] drop-shadow-lg uppercase break-words max-w-[300px]">
                                {product.name}
                            </h2>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-[350px] h-[450px]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Controls */}
                <div className="w-[350px] bg-[#60554d]/90 backdrop-blur-3xl flex flex-col p-10 text-white border-l border-white/5">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="mt-12 space-y-10">
                        {/* Color Selector */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Color</span>
                            <div className="flex items-center gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-6 h-6 rounded-full relative hover:scale-110 transition-transform ${selectedColor.name === color.name ? 'ring-2 ring-offset-2 ring-offset-[#60554d] ring-[#D4AF37]' : ''
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Size</span>
                            <div className="flex items-center gap-3">
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-sm font-medium transition-all ${selectedSize === size
                                            ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                            : 'hover:bg-white/10 text-white/80'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-white/60 tracking-widest uppercase font-secondary">Description</span>
                            <p className="text-sm leading-relaxed text-white/80 font-secondary text-justify">
                                {product.desc}
                            </p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-4 bg-[#D4AF37] text-[#3e3229] font-black rounded-full shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                        >
                            Update Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
