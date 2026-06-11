'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { formatPrice } from '../lib/format';
import ParallaxY from './codesprint/ParallaxY';

interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    image: string;
    sold_out?: boolean;
}

interface ProductGridProps {
    products?: Product[];
}

const reveal = {
    hidden: { opacity: 0, y: 36 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

/* CodeSprint 11 lineup — products float free on black, no card chrome. */
export default function ProductGrid({ products }: ProductGridProps) {
    const { openProductModal } = useUI();
    const reduceMotion = useReducedMotion();

    const allProducts = products || [];

    const anim = (i: number) => ({
        variants: reveal,
        custom: i,
        initial: reduceMotion ? false : ('hidden' as const),
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-60px' },
    });

    if (allProducts.length === 0) {
        return (
            <section id="product-grid" className="text-white py-32 px-5 md:px-12 bg-cs11-bg border-t border-white/[0.06] text-center">
                <p className="font-garamond italic text-3xl text-white/60">Nothing on the rack yet.</p>
                <p className="mt-3 font-manrope text-sm text-white/40">The drop is being stocked. Check back soon.</p>
            </section>
        );
    }

    const [featured, ...rest] = allProducts;

    return (
        <section id="product-grid" className="bg-cs11-bg text-white py-24 md:py-36 px-5 md:px-12 relative overflow-hidden cs11-void">
            <div className="w-full max-w-[1500px] mx-auto relative z-10">

                {/* Section header */}
                <motion.div {...anim(0)} className="mb-16 md:mb-24 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <h2
                        className="font-manrope font-extrabold uppercase tracking-[-0.02em] leading-none"
                        style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
                    >
                        The line<span className="cs11-outline">up</span>
                    </h2>
                    <p className="font-garamond italic text-xl md:text-3xl text-white/60">
                        {allProducts.length} {allProducts.length === 1 ? 'piece' : 'pieces'}, one run.
                    </p>
                </motion.div>

                {/* Featured piece — full width */}
                <motion.article {...anim(0)} className="group mb-8 md:mb-12">
                    <button
                        type="button"
                        onClick={() => !featured.sold_out && openProductModal(featured)}
                        disabled={featured.sold_out}
                        className="block w-full text-left disabled:cursor-not-allowed"
                        aria-label={`${featured.name}, ${formatPrice(featured.price)}${featured.sold_out ? ', sold out' : ''}`}
                    >
                        <div className="relative aspect-[16/9] md:aspect-[21/9]">
                            {/* Register marks framing the featured piece */}
                            <div aria-hidden className="absolute inset-0 pointer-events-none">
                                <span className="cs11-tick tl" />
                                <span className="cs11-tick tr" />
                                <span className="cs11-tick bl" />
                                <span className="cs11-tick br" />
                            </div>
                            <div
                                aria-hidden
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-3xl pointer-events-none"
                                style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
                            />
                            <ParallaxY range={['5%', '-5%']} className="absolute inset-0">
                                <Image
                                    src={featured.image}
                                    alt={`${featured.name} — ${featured.description}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 1400px"
                                    className={`object-contain drop-shadow-[0_50px_70px_rgba(0,0,0,0.75)] transition-transform duration-700 ease-out ${featured.sold_out ? 'opacity-40 grayscale' : 'group-hover:scale-[1.03]'}`}
                                />
                            </ParallaxY>
                        </div>
                        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-baseline justify-between gap-3">
                            <div className="flex items-baseline gap-4">
                                <h3 className="font-manrope font-extrabold uppercase text-2xl md:text-4xl tracking-tight">
                                    {featured.name}
                                </h3>
                                {featured.sold_out && (
                                    <span className="font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-white/50">
                                        Sold out
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-6">
                                <p className="font-garamond italic text-white/50 text-base md:text-lg hidden sm:block">
                                    {featured.description}
                                </p>
                                <span className="font-rajdhani font-semibold tracking-[0.15em] text-cs11-orange text-lg md:text-2xl">
                                    {formatPrice(featured.price)}
                                </span>
                            </div>
                        </div>
                    </button>
                </motion.article>

                {/* Remaining pieces */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-14 md:gap-y-20">
                    {rest.map((p, i) => (
                        <motion.article key={p.id} {...anim(i)} className="group">
                            <button
                                type="button"
                                onClick={() => !p.sold_out && openProductModal(p)}
                                disabled={p.sold_out}
                                className="block w-full text-left disabled:cursor-not-allowed"
                                aria-label={`${p.name}, ${formatPrice(p.price)}${p.sold_out ? ', sold out' : ''}`}
                            >
                                <div className="relative aspect-[4/3]">
                                    <div
                                        aria-hidden
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-3xl pointer-events-none"
                                        style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
                                    />
                                    {/* Adjacent columns drift at different rates — staggered depth on scroll */}
                                    <ParallaxY range={i % 2 === 0 ? ['9%', '-5%'] : ['14%', '-9%']} className="absolute inset-0">
                                        <Image
                                            src={p.image}
                                            alt={`${p.name} — ${p.description}`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, 700px"
                                            className={`object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out ${p.sold_out ? 'opacity-40 grayscale' : 'group-hover:scale-[1.04] group-hover:-rotate-1'}`}
                                        />
                                    </ParallaxY>
                                </div>
                                <div className="mt-5 pt-4 border-t border-white/10 flex items-baseline justify-between gap-4">
                                    <div className="min-w-0">
                                        <h3 className="font-manrope font-bold uppercase text-lg md:text-xl tracking-tight truncate">
                                            {p.name}
                                            {p.sold_out && (
                                                <span className="ml-3 font-rajdhani font-semibold uppercase tracking-[0.2em] text-[11px] text-white/50">
                                                    Sold out
                                                </span>
                                            )}
                                        </h3>
                                        <p className="mt-1 font-rajdhani uppercase tracking-[0.15em] text-[11px] text-white/40 truncate">
                                            {p.description}
                                        </p>
                                    </div>
                                    <span className="font-rajdhani font-semibold tracking-[0.15em] text-cs11-orange text-base md:text-lg shrink-0">
                                        {formatPrice(p.price)}
                                    </span>
                                </div>
                            </button>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
