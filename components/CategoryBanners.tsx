"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CategoryBanners = () => {
    return (
        <section className="py-12 px-6 md:px-12 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Card 1: New Arrivals */}
                <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group">
                    {/* Background tint based on theme */}
                    <div className="absolute inset-0 bg-theme-secondary opacity-30 transition-transform duration-700 group-hover:scale-105"></div>
                    <div className="absolute inset-0 bg-black/40"></div> {/* Always darken for white text readability */}

                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 w-full h-full">
                        {/* Image Placeholder */}
                        <div className="w-64 h-64 bg-theme-primary/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">New Arrivals</h3>
                        <p className="text-white/80 max-w-xs mb-8 text-sm leading-relaxed">
                            Discover the latest drops from our seasonal collection. Designed for the modern streets.
                        </p>

                        <div className="flex gap-4 mt-auto mb-12">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                                Buy
                            </button>
                            <button className="border border-white/30 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-colors">
                                View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2: Accessories */}
                <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden group">
                    {/* Background tint based on theme */}
                    <div className="absolute inset-0 bg-theme-text opacity-10 transition-transform duration-700 group-hover:scale-105"></div>
                    <div className="absolute inset-0 bg-black/60"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 w-full h-full">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">Accessories</h3>
                        <p className="text-white/80 max-w-xs mb-8 text-sm leading-relaxed">
                            Complete your look with our premium range of caps, bags, and everyday essentials.
                        </p>
                        <div className="flex gap-4 mt-auto mb-12">
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                                Buy
                            </button>
                            <button className="bg-theme-secondary text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-theme-primary transition-colors">
                                Women
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default CategoryBanners;
