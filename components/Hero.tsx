"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
            {/* Background Mesh Gradient */}
            <div className="absolute inset-0 bg-hero-mesh opacity-30 select-none pointer-events-none"></div>

            <div className="container-width relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="flex flex-col items-start space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        New Collection 2026
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9]">
                        WEAR <br />
                        THE <span className="text-ieee-blue">FUTURE</span>
                    </h1>

                    <p className="text-lg text-secondary max-w-md leading-relaxed">
                        Official IEEE Student Branch merchandise. designed for the innovators, the dreamers, and the builders.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <Link href="#products" className="bg-foreground text-background px-8 py-4 rounded-full font-bold hover:bg-ieee-blue transition-colors flex items-center gap-2">
                            Start Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="px-8 py-4 rounded-full font-bold border border-gray-200 hover:border-gray-400 transition-colors flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" /> View Lookbook
                        </button>
                    </div>

                    <div className="flex gap-8 pt-8 border-t border-gray-100 w-full">
                        <div>
                            <p className="text-3xl font-black text-foreground">200+</p>
                            <p className="text-xs font-bold text-secondary uppercase">Products</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-foreground">1.5k</p>
                            <p className="text-xs font-bold text-secondary uppercase">Community</p>
                        </div>
                    </div>
                </div>

                {/* Visual */}
                <div className="relative h-[600px] bg-accent rounded-[2rem] overflow-hidden shadow-2xl skew-x-1 hover:skew-x-0 transition-transform duration-700 ease-out group">
                    {/* Text overlay instead of 3D for stability */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-9xl font-black text-white/20 select-none group-hover:scale-110 transition-transform duration-700">
                            IEEE
                        </span>
                    </div>

                    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-sm max-w-xs">
                        <p className="font-bold text-foreground">Premium Hoodie V2</p>
                        <p className="text-sm text-secondary mt-1">Double-stitched cotton blend with water resistance.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
