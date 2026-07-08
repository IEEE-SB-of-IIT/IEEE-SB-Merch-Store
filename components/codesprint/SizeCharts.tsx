'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Dashed dimension line drawn over the garment render.
   Coordinates are percentages of the image box: `at` fixes the cross axis,
   `from`/`to` span the main axis. */
interface MLine {
    dir: 'h' | 'v';
    at: number;
    from: number;
    to: number;
    label: string;
    /** h: 'above' | 'below' the line · v: 'left' | 'right' of the line */
    side: 'above' | 'below' | 'left' | 'right';
}

interface Diagram {
    src: string;
    alt: string;
    /** Intrinsic aspect ratio so overlay % maps 1:1 onto the image */
    aspect: string;
    views: { label: string; x: number }[];
    lines: MLine[];
}

interface Chart {
    title: string;
    applies: string;
    diagram: Diagram;
    sizes: string[];
    rows: { label: string; values: (string | number)[] }[];
    note: string;
}

const CHARTS: Chart[] = [
    {
        title: 'Regular',
        applies: 'Tees · Jerseys',
        diagram: {
            src: '/images/codesprint-merch-images/cut/tee-sublimation-v5.png',
            alt: 'Ember Jersey front and back, showing where width and height are measured',
            aspect: '1649 / 1096',
            views: [
                { label: 'Front', x: 25 },
                { label: 'Back', x: 74 },
            ],
            lines: [
                { dir: 'h', at: 41, from: 9.5, to: 41, label: 'Width', side: 'below' },
                { dir: 'v', at: 74, from: 7, to: 95, label: 'Height', side: 'right' },
            ],
        },
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        rows: [
            { label: 'Width', values: [18, 19, 20, 21, 22, 23, 24] },
            { label: 'Height', values: [25, 26, 27, 28, 29, 30, 31] },
        ],
        note: 'Width — armpit to armpit, straight across the chest. Height — from the shoulder point down to the hem.',
    },
    {
        title: 'Hoodie',
        applies: 'CS11 Zip Hoodie',
        diagram: {
            src: '/images/codesprint-merch-images/cut/hoodie-black-orange-lace.png',
            alt: 'CS11 Zip Hoodie front and back, showing where shoulder, chest and length are measured',
            aspect: '1739 / 1131',
            views: [
                { label: 'Front', x: 24 },
                { label: 'Back', x: 75 },
            ],
            lines: [
                { dir: 'h', at: 26, from: 60, to: 91.5, label: 'Shoulder', side: 'above' },
                { dir: 'h', at: 44, from: 57, to: 94, label: 'Chest', side: 'below' },
                { dir: 'v', at: 99, from: 5, to: 93, label: 'Length', side: 'left' },
            ],
        },
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        rows: [
            { label: 'CF length for HPS', values: [23.6, 24.6, 25.6, 26.6, 27.6, 28.5] },
            { label: 'Chest width', values: [44.9, 45.9, 46.9, 47.8, 48.8, 49.8] },
            { label: 'Hem width', values: [39.8, 40.7, 41.7, 42.7, 43.7, 44.7] },
            { label: 'Shoulder width', values: [18.1, 18.9, 19.7, 20.5, 21.3, 22] },
            { label: 'Sleeve length', values: [22.4, 23.2, 24, 24.8, 25.6, 26.4] },
            { label: 'Sleeve open', values: [7.1, 7.5, 7.9, 8.3, 8.7, 9.1] },
        ],
        note: 'Length measured from the high point of the shoulder; chest and hem measured flat, straight across.',
    },
];

const CHIP =
    'absolute font-rajdhani font-semibold uppercase tracking-[0.2em] text-[9px] md:text-[10px] text-cs11-orange bg-black/75 border border-cs11-orange/30 rounded-sm px-2 py-0.5 whitespace-nowrap';

function MeasureLine({ line, delay, reduceMotion }: { line: MLine; delay: number; reduceMotion: boolean | null }) {
    const draw = {
        initial: reduceMotion ? false : ({ scaleX: line.dir === 'h' ? 0 : 1, scaleY: line.dir === 'v' ? 0 : 1 } as const),
        whileInView: { scaleX: 1, scaleY: 1 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.9, delay, ease: EASE },
    };
    const fade = {
        initial: reduceMotion ? false : ({ opacity: 0 } as const),
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5, delay: delay + 0.55, ease: EASE },
    };

    if (line.dir === 'h') {
        return (
            <div
                aria-hidden
                className="absolute"
                style={{ top: `${line.at}%`, left: `${line.from}%`, width: `${line.to - line.from}%` }}
            >
                <motion.span {...draw} className="block border-t-[1.5px] border-dashed border-cs11-orange/90 origin-left" />
                <motion.span {...fade} className="absolute -top-[5px] left-0 w-[1.5px] h-[11px] bg-cs11-orange/90" />
                <motion.span {...fade} className="absolute -top-[5px] right-0 w-[1.5px] h-[11px] bg-cs11-orange/90" />
                <motion.span
                    {...fade}
                    className={`${CHIP} left-1/2 -translate-x-1/2 ${line.side === 'above' ? 'bottom-[9px]' : 'top-[9px]'}`}
                >
                    {line.label}
                </motion.span>
            </div>
        );
    }

    return (
        <div
            aria-hidden
            className="absolute"
            style={{ left: `${line.at}%`, top: `${line.from}%`, height: `${line.to - line.from}%` }}
        >
            <motion.span {...draw} className="block h-full border-l-[1.5px] border-dashed border-cs11-orange/90 origin-top" />
            <motion.span {...fade} className="absolute -left-[5px] top-0 h-[1.5px] w-[11px] bg-cs11-orange/90" />
            <motion.span {...fade} className="absolute -left-[5px] bottom-0 h-[1.5px] w-[11px] bg-cs11-orange/90" />
            <motion.span
                {...fade}
                className={`${CHIP} top-1/2 -translate-y-1/2 ${line.side === 'right' ? 'left-[10px]' : 'right-[10px]'}`}
            >
                {line.label}
            </motion.span>
        </div>
    );
}

/* Garment render with dashed dimension lines — the "how it's measured" plate. */
function MeasureDiagram({ diagram, reduceMotion }: { diagram: Diagram; reduceMotion: boolean | null }) {
    return (
        <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-8 overflow-hidden">
            {/* Register ticks — the garment is framed for inspection */}
            <div aria-hidden className="absolute inset-3 pointer-events-none">
                <span className="cs11-tick tl" />
                <span className="cs11-tick tr" />
                <span className="cs11-tick bl" />
                <span className="cs11-tick br" />
            </div>

            {/* Soft under-glow so dark garments lift off the void */}
            <div
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
            />

            {/* Aspect-locked box: overlay percentages map exactly onto the render */}
            <div className="relative mx-auto" style={{ aspectRatio: diagram.aspect }}>
                <Image
                    src={diagram.src}
                    alt={diagram.alt}
                    fill
                    sizes="(max-width: 768px) 92vw, 640px"
                    className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)]"
                />
                {diagram.lines.map((line, i) => (
                    <MeasureLine key={line.label} line={line} delay={0.2 + i * 0.18} reduceMotion={reduceMotion} />
                ))}
            </div>

            {/* View labels */}
            <div aria-hidden className="relative mt-3 h-4">
                {diagram.views.map((v) => (
                    <span
                        key={v.label}
                        className="absolute -translate-x-1/2 font-rajdhani font-semibold uppercase tracking-[0.3em] text-[9px] text-white/30"
                        style={{ left: `${v.x}%` }}
                    >
                        {v.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function ChartSection({ chart, index, reduceMotion }: { chart: Chart; index: number; reduceMotion: boolean | null }) {
    const anim = (delay: number) => ({
        initial: reduceMotion ? false : ({ opacity: 0, y: 28 } as const),
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.8, delay, ease: EASE },
    });

    return (
        <motion.section {...anim(index * 0.08)} aria-label={`${chart.title} size chart`}>
            {/* Chart ledger line */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-6">
                <h2 className="font-manrope font-extrabold uppercase tracking-tight text-2xl md:text-4xl">
                    {chart.title}
                    <span className="cs11-outline ml-3 hidden sm:inline">chart</span>
                </h2>
                <span className="font-rajdhani font-semibold uppercase tracking-[0.25em] text-[11px] text-cs11-orange">
                    {chart.applies}
                </span>
            </div>

            {/* How it's measured — annotated garment render */}
            <motion.div {...anim(0.1)} className="mb-8 max-w-[680px] mx-auto">
                <MeasureDiagram diagram={chart.diagram} reduceMotion={reduceMotion} />
            </motion.div>

            {/* Table — wide content scrolls inside its own container on mobile */}
            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <table className="w-full border-collapse min-w-[560px]">
                    <thead>
                        <tr>
                            <th scope="col" className="py-4 pl-6 pr-4 border-b border-white/[0.08]">
                                <span className="sr-only">Measurement</span>
                            </th>
                            {chart.sizes.map((s) => (
                                <th
                                    key={s}
                                    scope="col"
                                    className="py-4 px-3 text-center font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-cs11-orange border-b border-white/[0.08]"
                                >
                                    {s}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {chart.rows.map((row, ri) => (
                            <tr key={row.label} className="group">
                                <th
                                    scope="row"
                                    className={`py-4 pl-6 pr-4 text-left font-rajdhani font-semibold uppercase tracking-[0.2em] text-[11px] text-white/45 whitespace-nowrap group-hover:text-white/70 transition-colors duration-300
                                        ${ri < chart.rows.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                                >
                                    {row.label}
                                </th>
                                {row.values.map((v, vi) => (
                                    <td
                                        key={vi}
                                        className={`py-4 px-3 text-center font-manrope font-semibold text-white text-sm md:text-base tabular-nums group-hover:bg-white/[0.02] transition-colors duration-300
                                            ${ri < chart.rows.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
                                    >
                                        {v}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 font-manrope text-xs md:text-sm text-white/40 leading-relaxed max-w-xl">
                {chart.note}
            </p>
        </motion.section>
    );
}

export default function SizeCharts() {
    const reduceMotion = useReducedMotion();

    const heroAnim = (i: number) => ({
        initial: reduceMotion ? false : ({ opacity: 0, y: 32 } as const),
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE },
    });

    return (
        <section className="bg-cs11-bg text-white relative overflow-hidden cs11-void">
            <div className="w-full max-w-[1100px] mx-auto px-5 md:px-12 pt-36 md:pt-48 pb-24 md:pb-36 relative z-10">

                {/* ── Editorial header ── */}
                <header className="mb-14 md:mb-24">
                    <motion.p
                        {...heroAnim(0)}
                        className="font-rajdhani font-semibold uppercase tracking-[0.3em] text-[11px] md:text-xs text-cs11-orange"
                    >
                        Fit guide — CodeSprint 11 × Cicada
                    </motion.p>

                    <motion.h1 {...heroAnim(1)} className="mt-5 leading-[0.92] tracking-tight">
                        <span className="block font-garamond italic font-normal text-3xl md:text-5xl text-white/90">
                            Measure twice,
                        </span>
                        <span
                            className="block font-manrope font-extrabold uppercase tracking-[-0.02em] mt-1"
                            style={{ fontSize: 'clamp(2.6rem, 8vw, 6.5rem)' }}
                        >
                            Order <span className="cs11-outline">once.</span>
                        </span>
                    </motion.h1>

                    <motion.p {...heroAnim(2)} className="mt-6 font-manrope text-sm md:text-base text-white/50 max-w-md leading-relaxed">
                        One numbered run means no exchanges to count on — check your fit
                        before you commit. All dimensions are in inches, garments measured flat.
                    </motion.p>
                </header>

                {/* ── Charts ── */}
                <div className="space-y-20 md:space-y-32">
                    {CHARTS.map((chart, i) => (
                        <ChartSection key={chart.title} chart={chart} index={i} reduceMotion={reduceMotion} />
                    ))}
                </div>

                {/* ── Closing ── */}
                <motion.footer
                    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-white/[0.08] text-center"
                >
                    <p className="font-garamond italic text-2xl md:text-3xl text-white/80">
                        Fit sorted?
                    </p>
                    <Link
                        href="/codesprint/shop"
                        className="group mt-6 inline-flex items-center gap-2 font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-cs11-orange hover:text-white transition-colors duration-300"
                    >
                        Shop the drop
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                    </Link>
                </motion.footer>
            </div>
        </section>
    );
}
