"use client";
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="group relative bg-theme-bg rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-theme-accent">
            {/* Image Container */}
            <div className="aspect-[4/5] bg-theme-accent relative overflow-hidden">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center text-theme-secondary font-bold text-2xl group-hover:scale-105 transition-transform duration-500 bg-theme-accent/50">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{product.name}</span>
                    )}
                </div>

                {/* Quick Add Button */}
                <button className="absolute bottom-4 right-4 bg-theme-bg p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-theme-primary hover:text-white text-theme-text">
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-xs text-theme-secondary mb-1">{product.category}</p>
                <h3 className="font-bold text-theme-text text-lg mb-2">{product.name}</h3>
                <p className="text-theme-primary font-bold text-xl">${product.price.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default ProductCard;
