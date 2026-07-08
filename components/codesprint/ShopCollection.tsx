'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Ruler } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { formatPrice } from '../../lib/format';
import { groupProducts, MerchType, ProductRow } from '../../lib/groupProducts';
import ParallaxY from './ParallaxY';

interface ShopCollectionProps {
    products?: ProductRow[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

const SWATCH_BG: Record<string, string> = {
    black: '#1a1a1a',
    white: '#f2f2f2',
};

/** Rack section a merch type hangs under, derived from its name/description. */
function categoryOf(merch: MerchType): string {
    const t = `${merch.name} ${merch.description}`.toLowerCase();
    if (t.includes('hoodie')) return 'Hoodies';
    if (t.includes('jersey')) return 'Jerseys';
    if (t.includes('cap') || t.includes('hat')) return 'Caps';
    if (t.includes('tee') || t.includes('shirt')) return 'Tees';
    if (
        t.includes('accessor') ||
        t.includes('lanyard') ||
        t.includes('keychain') ||
        t.includes('badge') ||
        t.includes('sticker') ||
        t.includes('pin') ||
        t.includes('wristband') ||
        t.includes('patch') ||
        t.includes('bottle') ||
        t.includes('bag')
    )
        return 'Accessories';
    return 'More';
}

/* ── Single rack item — numbered unit, register ticks, colorway swatches ── */
function ShopItem({
    merch,
    number,
    index,
    reduceMotion,
}: {
    merch: MerchType;
    number: string;
    index: number;
    reduceMotion: boolean | null;
}) {
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
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 16, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: EASE }}
            className={`group ${index % 2 === 1 ? 'sm:translate-y-16 lg:translate-y-24' : ''}`}
        >
            {/* Unit ledger line */}
            <div className="flex items-baseline justify-between mb-3">
                <span className="font-rajdhani font-semibold uppercase tracking-[0.25em] text-[11px] text-cs11-orange">
                    № {number}
                </span>
                <span className="font-rajdhani font-semibold uppercase tracking-[0.25em] text-[10px] text-white/30">
                    {categoryOf(merch)}
                </span>
            </div>

            <button
                type="button"
                onClick={open}
                disabled={!!product.sold_out}
                className="block w-full text-left disabled:cursor-not-allowed"
                aria-label={`${product.name}, ${formatPrice(product.price)}${product.sold_out ? ', sold out' : ''}`}
            >
                <div className="relative overflow-hidden rounded-xl bg-white/[0.03]">
                    {/* Register ticks surface on hover — the piece is "framed" for inspection */}
                    <div aria-hidden className="absolute inset-3 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="cs11-tick tl" />
                        <span className="cs11-tick tr" />
                        <span className="cs11-tick bl" />
                        <span className="cs11-tick br" />
                    </div>

                    {/* Orange under-glow */}
                    <div
                        aria-hidden
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-full opacity-0 group-hover:opacity-25 group-active:opacity-25 transition-opacity duration-700 blur-3xl pointer-events-none"
                        style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
                    />

                    {/* Mobile image area — square, no parallax */}
                    <div className="sm:hidden relative aspect-square">
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

                    {/* Desktop image area — 4/3 with parallax depth */}
                    <div className="hidden sm:block relative aspect-[4/3]">
                        <ParallaxY range={index % 2 === 0 ? ['8%', '-4%'] : ['12%', '-7%']} className="absolute inset-0">
                            {merch.variants.map((v, vi) => (
                                <Image
                                    key={v.product.id}
                                    src={v.product.image}
                                    alt={vi === activeIdx ? `${v.product.name} — ${merch.description}` : ''}
                                    aria-hidden={vi !== activeIdx}
                                    fill
                                    sizes="700px"
                                    className={`object-contain p-4 drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out
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

            {/* Ledger row — name, price, colorways */}
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
                    <div className="flex flex-col items-end leading-none gap-1">
                        {product.normal_price && (
                            <span className="font-rajdhani font-medium tracking-[0.1em] text-white/40 line-through text-xs md:text-sm">
                                {formatPrice(product.normal_price)}
                            </span>
                        )}
                        <span className="font-rajdhani font-semibold tracking-[0.1em] text-cs11-orange text-base md:text-lg">
                            {formatPrice(product.price)}
                        </span>
                    </div>
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

/* ── The shop — editorial header, hairline filter rail, offset rack grid ── */
export default function ShopCollection({ products }: ShopCollectionProps) {
    const reduceMotion = useReducedMotion();
    const [filter, setFilter] = useState('All');

    const merchTypes = useMemo(() => groupProducts(products || []), [products]);

    // Stable unit numbers by rack position, independent of the active filter.
    const numbered = useMemo(
        () => merchTypes.map((merch, i) => ({ merch, number: String(i + 1).padStart(2, '0') })),
        [merchTypes],
    );

    const categories = useMemo(() => {
        const seen: string[] = [];
        for (const m of merchTypes) {
            const c = categoryOf(m);
            if (!seen.includes(c)) seen.push(c);
        }
        return seen;
    }, [merchTypes]);

    const visible = filter === 'All'
        ? numbered
        : numbered.filter(({ merch }) => categoryOf(merch) === filter);

    const heroAnim = (i: number) => ({
        initial: reduceMotion ? false : ({ opacity: 0, y: 32 } as const),
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE },
    });

    if (merchTypes.length === 0) {
        return (
            <section className="text-white pt-52 pb-40 px-5 md:px-12 bg-cs11-bg text-center">
                <p className="font-garamond italic text-3xl text-white/60">Nothing on the rack yet.</p>
                <p className="mt-3 font-manrope text-sm text-white/40">The drop is being stocked. Check back soon.</p>
            </section>
        );
    }

    return (
        <section className="bg-cs11-bg text-white relative overflow-hidden cs11-void">
            <div className="w-full max-w-[1500px] mx-auto px-4 md:px-12 pt-36 md:pt-48 pb-24 md:pb-36 relative z-10">

                {/* ── Editorial header ── */}
                <header className="mb-12 md:mb-20">
                    <motion.p
                        {...heroAnim(0)}
                        className="font-rajdhani font-semibold uppercase tracking-[0.3em] text-[11px] md:text-xs text-cs11-orange"
                    >
                        CodeSprint 11 × Cicada — Official Drop
                    </motion.p>

                    <motion.h1 {...heroAnim(1)} className="mt-5 leading-[0.92] tracking-tight">
                        <span className="block font-garamond italic font-normal text-3xl md:text-6xl text-white/90">
                            The drop,
                        </span>
                        <span
                            className="block font-manrope font-extrabold uppercase tracking-[-0.02em] mt-1"
                            style={{ fontSize: 'clamp(2.8rem, 10vw, 8rem)' }}
                        >
                            All of <span className="cs11-outline">it.</span>
                        </span>
                    </motion.h1>

                    <motion.p {...heroAnim(2)} className="mt-6 font-manrope text-sm md:text-base text-white/50 max-w-md leading-relaxed">
                        {merchTypes.length} {merchTypes.length === 1 ? 'piece' : 'pieces'}, one numbered run.
                        When the batch is gone, that is the end of it.
                    </motion.p>
                </header>

                {/* ── Filter rail — hairline tabs, only when the rack has sections ── */}
                {categories.length > 1 && (
                    <motion.nav
                        {...heroAnim(3)}
                        aria-label="Filter products"
                        className="mb-14 md:mb-20 border-y border-white/[0.08] flex flex-wrap items-center gap-x-8 md:gap-x-12"
                    >
                        {['All', ...categories].map((tab) => {
                            const count = tab === 'All'
                                ? merchTypes.length
                                : merchTypes.filter((m) => categoryOf(m) === tab).length;
                            const isActive = filter === tab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setFilter(tab)}
                                    aria-pressed={isActive}
                                    className={`relative py-5 font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs transition-colors duration-300
                                        ${isActive ? 'text-white' : 'text-white/40 hover:text-white/75'}`}
                                >
                                    {tab}
                                    <sup className={`ml-1.5 text-[9px] tracking-normal transition-colors duration-300 ${isActive ? 'text-cs11-orange' : 'text-white/25'}`}>
                                        {count}
                                    </sup>
                                    {isActive && (
                                        <motion.span
                                            layoutId="shop-filter-underline"
                                            aria-hidden
                                            className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cs11-orange"
                                            transition={{ duration: 0.45, ease: EASE }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                        <span className="ml-auto py-5 font-rajdhani font-semibold uppercase tracking-[0.2em] text-[10px] text-white/30 hidden sm:block">
                            {visible.length} shown
                        </span>
                    </motion.nav>
                )}

                {/* ── Rack grid — asymmetric: odd columns ride low ── */}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={filter}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12 md:gap-y-20 sm:pb-16 lg:pb-24"
                    >
                        {visible.map(({ merch, number }, i) => (
                            <ShopItem
                                key={merch.name}
                                merch={merch}
                                number={number}
                                index={i}
                                reduceMotion={reduceMotion}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* ── Closing statement ── */}
                <motion.footer
                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="mt-28 md:mt-40 pt-14 md:pt-20 border-t border-white/[0.08] text-center"
                >
                    <p className="font-garamond italic text-2xl md:text-4xl text-white/80">
                        One run. Numbered units.
                    </p>
                    <p className="mt-3 font-manrope text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                        Sampled, stress-tested through a 24-hour hackathon, printed in one batch.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                        <Link
                            href="/codesprint/size-chart"
                            className="group inline-flex items-center gap-2 font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-cs11-orange hover:text-white transition-colors duration-300"
                        >
                            <Ruler className="w-3.5 h-3.5" strokeWidth={2} />
                            Size chart
                        </Link>
                        <Link
                            href="/codesprint#details"
                            className="group inline-flex items-center gap-2 font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-cs11-orange hover:text-white transition-colors duration-300"
                        >
                            Read how it&apos;s built
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                        </Link>
                    </div>
                </motion.footer>
            </div>
        </section>
    );
}
