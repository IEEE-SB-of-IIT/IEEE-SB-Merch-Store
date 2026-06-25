'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { formatPrice } from '../lib/format';
import { groupProducts, MerchType, ProductRow } from '../lib/groupProducts';
import ParallaxY from './codesprint/ParallaxY';

interface ProductGridProps {
    products?: ProductRow[];
}

const reveal = {
    hidden: { opacity: 0, y: 36 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

const SWATCH_BG: Record<string, string> = {
    black: '#1a1a1a',
    white: '#f2f2f2',
};

function MerchItem({ merch, index, anim }: { merch: MerchType; index: number; anim: (i: number) => object }) {
    const { openProductModal } = useUI();
    const [activeIdx, setActiveIdx] = useState(0);

    const active = merch.variants[activeIdx];
    const product = active.product;
    const hasColors = merch.variants.length > 1;
    const allSoldOut = merch.variants.every((v) => v.product.sold_out);

    const open = () => {
        if (product.sold_out) return;
        openProductModal({
            ...product,
            baseName: merch.name,
            variants: hasColors ? merch.variants : undefined,
        });
    };

    return (
        <motion.article {...anim(index)} className="group">
            <button
                type="button"
                onClick={open}
                disabled={!!product.sold_out}
                className="block w-full text-left disabled:cursor-not-allowed"
                aria-label={`${product.name}, ${formatPrice(product.price)}${product.sold_out ? ', sold out' : ''}`}
            >
                {/*
                  Mobile: square aspect ratio, no parallax, full padding so image is never clipped.
                  Desktop (sm+): 4/3 ratio with parallax depth effect.
                */}
                <div className="relative overflow-hidden rounded-xl bg-white/[0.03]">
                    {/* Mobile image area */}
                    <div className="sm:hidden relative aspect-square">
                        <div
                            aria-hidden
                            className="absolute inset-0 opacity-0 group-active:opacity-20 transition-opacity duration-300 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at 50% 60%, #ff6a3d 0%, transparent 65%)' }}
                        />
                        {merch.variants.map((v, vi) => (
                            <Image
                                key={v.product.id}
                                src={v.product.image}
                                alt={vi === activeIdx ? `${v.product.name} — ${merch.description}` : ''}
                                aria-hidden={vi !== activeIdx}
                                fill
                                sizes="390px"
                                className={`object-contain p-8 drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)] transition-opacity duration-500
                                    ${vi !== activeIdx
                                        ? 'opacity-0'
                                        : v.product.sold_out
                                            ? 'opacity-40 grayscale'
                                            : 'opacity-100'}`}
                            />
                        ))}
                    </div>

                    {/* Desktop image area — parallax, 4/3 */}
                    <div className="hidden sm:block relative aspect-[4/3]">
                        <div
                            aria-hidden
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-3xl pointer-events-none"
                            style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
                        />
                        <ParallaxY range={index % 2 === 0 ? ['9%', '-5%'] : ['14%', '-9%']} className="absolute inset-0">
                            {merch.variants.map((v, vi) => (
                                <Image
                                    key={v.product.id}
                                    src={v.product.image}
                                    alt={vi === activeIdx ? `${v.product.name} — ${merch.description}` : ''}
                                    aria-hidden={vi !== activeIdx}
                                    fill
                                    sizes="700px"
                                    className={`object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out
                                        ${vi !== activeIdx
                                            ? 'opacity-0'
                                            : v.product.sold_out
                                                ? 'opacity-40 grayscale'
                                                : 'opacity-100 group-hover:scale-[1.04] group-hover:-rotate-1'}`}
                                />
                            ))}
                        </ParallaxY>
                    </div>
                </div>
            </button>

            {/* Product info */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <h3 className="font-manrope font-bold uppercase text-base md:text-xl tracking-tight leading-tight">
                        {merch.name}
                    </h3>
                    <p className="mt-0.5 font-rajdhani uppercase tracking-[0.12em] text-[11px] text-white/40">
                        {merch.description}
                    </p>
                    {(allSoldOut || product.sold_out) && (
                        <p className="mt-1 font-rajdhani font-semibold uppercase tracking-[0.2em] text-[10px] text-white/50">
                            {allSoldOut ? 'Sold out' : `${active.color} sold out`}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-rajdhani font-semibold tracking-[0.1em] text-cs11-orange text-base md:text-lg">
                        {formatPrice(product.price)}
                    </span>
                    {hasColors && (
                        <div className="flex items-center gap-2" role="group" aria-label={`${merch.name} colors`}>
                            {merch.variants.map((v, vi) => (
                                <button
                                    key={v.product.id}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setActiveIdx(vi); }}
                                    aria-label={`${merch.name} in ${v.color}${v.product.sold_out ? ', sold out' : ''}`}
                                    aria-pressed={vi === activeIdx}
                                    className={`w-4 h-4 rounded-full border transition-all duration-300
                                        ${vi === activeIdx ? 'border-cs11-orange scale-110' : 'border-white/30 hover:border-white/60'}`}
                                    style={{ backgroundColor: SWATCH_BG[v.color.toLowerCase()] ?? '#666' }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

export default function ProductGrid({ products }: ProductGridProps) {
    const reduceMotion = useReducedMotion();
    const merchTypes = groupProducts(products || []);

    const anim = (i: number) => ({
        variants: reveal,
        custom: i,
        initial: reduceMotion ? false : ('hidden' as const),
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-60px' },
    });

    if (merchTypes.length === 0) {
        return (
            <section id="product-grid" className="text-white py-32 px-5 md:px-12 bg-cs11-bg border-t border-white/[0.06] text-center">
                <p className="font-garamond italic text-3xl text-white/60">Nothing on the rack yet.</p>
                <p className="mt-3 font-manrope text-sm text-white/40">The drop is being stocked. Check back soon.</p>
            </section>
        );
    }

    return (
        <section id="product-grid" className="bg-cs11-bg text-white py-16 md:py-36 px-4 md:px-12 relative overflow-hidden cs11-void">
            <div className="w-full max-w-[1500px] mx-auto relative z-10">
                <motion.div {...anim(0)} className="mb-10 md:mb-24 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <h2
                        className="font-manrope font-extrabold uppercase tracking-[-0.02em] leading-none"
                        style={{ fontSize: 'clamp(2.2rem, 8vw, 7rem)' }}
                    >
                        The line<span className="cs11-outline">up</span>
                    </h2>
                    <p className="font-garamond italic text-xl md:text-3xl text-white/60">
                        {merchTypes.length} {merchTypes.length === 1 ? 'piece' : 'pieces'}, one run.
                    </p>
                </motion.div>

                {/* 1 col on mobile, 2 on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-20">
                    {merchTypes.map((merch, i) => (
                        <MerchItem key={merch.name} merch={merch} index={i} anim={anim} />
                    ))}
                </div>
            </div>
        </section>
    );
}
