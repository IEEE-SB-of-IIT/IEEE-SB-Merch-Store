import Image from 'next/image';
import { ArrowUpRight, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ArcticHero() {
    return (
        <section className="relative w-full aspect-[16/9] bg-arctic-base overflow-hidden flex flex-col items-center pt-20 px-6 md:px-12">
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
                        <div className="flex gap-4 text-[10px] md:text-xs tracking-[0.2em] text-arctic-light/60 uppercase">
                            <span>Special Stage No. 1</span>
                            <span>|</span>
                            <span>Signed</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                            COLLECTION<br />
                            ARTIC 01™
                        </h1>
                    </div>

                    <div className="space-y-6">
                        {/* Size Selector */}
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-arctic-light/60 uppercase tracking-widest text-xs">Size</span>
                            <div className="flex gap-6 font-bold">
                                <span className="cursor-pointer hover:text-arctic-cyan">S</span>
                                <span className="cursor-pointer hover:text-arctic-cyan">M</span>
                                <span className="cursor-pointer hover:text-arctic-cyan">L</span>
                                <span className="cursor-pointer hover:text-arctic-cyan">XL</span>
                            </div>
                        </div>

                        {/* Colour Selector */}
                        <div className="flex items-center gap-8 text-sm">
                            <span className="text-arctic-light/60 uppercase tracking-widest text-xs">Colour</span>
                            <div className="flex gap-6 font-bold">
                                <span className="cursor-pointer hover:text-arctic-cyan">White</span>
                                <span className="cursor-pointer text-arctic-light/40">Silver</span>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Circle */}
                    <div className="relative group cursor-pointer mt-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-arctic-light/30 flex items-center justify-center relative overflow-hidden group-hover:bg-white/5 transition-all">
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative w-full h-[90%] md:h-[95%] flex items-end">
                        <Image
                            src="/images/hero.png"
                            alt="Arctic Collection Hero"
                            fill
                            className="object-contain object-bottom scale-110 drop-shadow-2xl"
                            priority
                        />
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
                            {/* Tile 1 */}
                            <div className="relative w-32 h-40 bg-white/20 p-[1px]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                <div className="w-full h-full bg-arctic-dark relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                    <Image src="/images/product_1.png" alt="Preview 1" fill className="object-cover opacity-80" />
                                </div>
                            </div>
                            {/* Tile 2 */}
                            <div className="relative w-32 h-40 bg-white/20 p-[1px]" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                <div className="w-full h-full bg-arctic-dark relative" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}>
                                    <Image src="/images/product_1.png" alt="Preview 2" fill className="object-cover opacity-80" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-[10px] tracking-widest text-arctic-light/50">
                            <span>01 -------- 07</span>
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
