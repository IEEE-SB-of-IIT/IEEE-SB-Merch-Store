'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Instagram, Facebook, Twitter } from 'lucide-react';

interface ArcticHeroProps {
    theme?: 'default' | 'codesprint' | 'ix';
}

export default function ArcticHero({ theme = 'default' }: ArcticHeroProps) {
    const [activeView, setActiveView] = useState(0); // 0 = Front, 1 = Back
    const views = [
        { id: 0, name: 'FRONT', image: '/images/hero.png' },
        { id: 1, name: 'BACK', image: '/images/hero_back.png' }
    ];

    const themeConfig = {
        default: {
            bg: 'bg-arctic-base',
            accent: 'text-arctic-cyan',
            accentBg: 'bg-arctic-cyan',
            accentShadow: 'shadow-arctic-cyan/20',
            glow: 'shadow-[0_0_8px_rgba(34,211,238,0.8)]',
            text: 'text-arctic-cyan',
            hoverText: 'hover:text-arctic-cyan',
            dimText: 'text-arctic-light/60',
            bgGlow: 'bg-blue-500/20'
        },
        codesprint: {
            bg: 'bg-[#602000]', // Deep Burnt Orange
            accent: 'text-orange-500',
            accentBg: 'bg-orange-500',
            accentShadow: 'shadow-orange-500/20',
            glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
            text: 'text-orange-500',
            hoverText: 'hover:text-orange-500',
            dimText: 'text-gray-400',
            bgGlow: 'bg-orange-600/40' // Stronger glow
        },
        ix: {
            bg: 'bg-[#450a25]', // Deep Magenta
            accent: 'text-[#FF0879]',
            accentBg: 'bg-[#FF0879]',
            accentShadow: 'shadow-[#FF0879]/20',
            glow: 'drop-shadow-[0_0_8px_rgba(172,213,248,0.8)]',
            text: 'text-[#FF0879]',
            hoverText: 'hover:text-[#FF0879]',
            dimText: 'text-[#ACD5F8]/60',
            bgGlow: 'bg-[#ACD5F8]/40' // Stronger blue glow for contrast
        }
    };

    const styles = themeConfig[theme] || themeConfig.default;

    return (
        <section className={`relative w-full aspect-[16/9] ${styles.bg} overflow-hidden flex flex-col items-center pt-20 px-6 md:px-12`}>
            {/* Noise Overlay */}
            <div
                className="absolute inset-0 z-50 pointer-events-none opacity-[0.15] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Background Graffiti Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 select-none">
                <span className="font-spray text-[15vw] md:text-[20vw] leading-none text-white/10 scale-y-150 inline-block tracking-tighter">
                    MERCHANDISE
                </span>
            </div>

            <div className="w-full max-w-[1400px] relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 h-full items-end pb-12">

                {/* Left Column: Title & Controls */}
                <div className="md:col-span-4 flex flex-col justify-center space-y-12 text-white h-full pb-12">
                    <div className="space-y-2">
                        <div className={`flex gap-4 text-[10px] md:text-xs tracking-[0.2em] ${styles.dimText} uppercase`}>
                            <span>Special Stage No. 1</span>
                            <span>|</span>
                            <span>Signed</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bebas tracking-wide leading-[0.9]">
                            COLLECTION<br />
                            <span className="">ARTIC 01™</span>
                        </h1>
                    </div>

                    {/* Barcode Image */}
                    <div className="relative w-48 h-24 opacity-80 hover:opacity-100 transition-opacity">
                        <Image
                            src="/images/barcode.png"
                            alt="Product Barcode"
                            fill
                            className="object-contain object-left"
                        />
                    </div>

                    {/* Add to Cart Circle */}
                    <div className="relative group cursor-pointer mt-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 flex items-center justify-center relative overflow-hidden group-hover:bg-white/5 transition-all">
                            <ArrowUpRight className="w-8 h-8 text-white mb-4" />
                            <span className="absolute bottom-6 text-[10px] tracking-widest uppercase">Add to Cart</span>
                        </div>
                        <div className="absolute top-1/2 left-32 md:left-40 -translate-y-1/2 text-2xl font-mono">
                            $899.99
                        </div>
                    </div>
                </div>

                {/* Center Column: Main Image */}
                <div className="md:col-span-5 relative flex items-end justify-center h-full">
                    {/* Background Glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] ${styles.bgGlow} blur-[100px] rounded-full pointer-events-none`} />

                    <div className="relative w-full h-[90%] md:h-[95%] flex items-end transition-opacity duration-500 ease-in-out">
                        <div className="relative w-full h-full">
                            <Image
                                key={activeView} // Remount on change for animation
                                src={views[activeView].image}
                                alt={`Arctic Collection ${views[activeView].name}`}
                                fill
                                className="object-contain object-bottom scale-110 drop-shadow-2xl animate-fade-in"
                                priority
                            />
                        </div>
                        {/* Small Tag on Jacket */}
                        <div className="absolute top-[35%] right-[25%] text-white/30 font-spray text-4xl -rotate-12 z-20 mix-blend-overlay opacity-60">
                            TRN
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Gallery & Social elements */}
                <div className="md:col-span-3 flex flex-col h-full relative">
                    {/* Centered Group: Tiles & Counter */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col gap-6 items-end">
                        <div className="flex gap-4 opacity-80 justify-end">
                            {/* Tile 1 - Front */}
                            <div
                                onClick={() => setActiveView(0)}
                                className={`relative w-32 h-40 p-[1px] cursor-pointer transition-all duration-300 ${activeView === 0 ? `${styles.accentBg} scale-105 shadow-lg ${styles.accentShadow}` : 'bg-white/20 hover:bg-white/40'}`}
                                style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
                            >
                                <div className="w-full h-full bg-arctic-dark relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                    <Image src={views[0].image} alt="Front View" fill className="object-cover opacity-80" />
                                    {activeView === 0 && <div className={`absolute inset-0 ${styles.accentBg}/10`} />}
                                </div>
                            </div>

                            {/* Tile 2 - Back */}
                            <div
                                onClick={() => setActiveView(1)}
                                className={`relative w-32 h-40 p-[1px] cursor-pointer transition-all duration-300 ${activeView === 1 ? `${styles.accentBg} scale-105 shadow-lg ${styles.accentShadow}` : 'bg-white/20 hover:bg-white/40'}`}
                                style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
                            >
                                <div className="w-full h-full bg-arctic-dark relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                    <Image src={views[1].image} alt="Back View" fill className="object-cover opacity-80" />
                                    {activeView === 1 && <div className={`absolute inset-0 ${styles.accentBg}/10`} />}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-[10px] tracking-widest text-white font-mono">
                            <div className="flex items-center gap-2">
                                <span className={`transition-colors duration-300 ${activeView === 0 ? `${styles.text} font-bold text-sm ${styles.glow}` : 'text-white'}`}>01</span>
                                <span className="text-white">--------</span>
                                <span className={`transition-colors duration-300 ${activeView === 1 ? `${styles.text} font-bold text-sm ${styles.glow}` : 'text-white'}`}>02</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Socials */}
                    <div className="absolute bottom-12 right-0 flex justify-end gap-6 text-white/50">
                        <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
                        <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
                    </div>
                </div>

            </div>
        </section>
    );
}
