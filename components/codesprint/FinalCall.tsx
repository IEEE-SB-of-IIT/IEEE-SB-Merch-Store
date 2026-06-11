'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { scrollToSection } from '../SmoothScroll';

/* Orange drench closer — the only section where the surface IS the brand color. */
export default function FinalCall() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="relative bg-cs11-orange text-black overflow-hidden cs11-grain">
            <div className="max-w-[1500px] mx-auto px-5 md:px-12 py-28 md:py-44 relative z-10">
                <motion.h2
                    initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="leading-[0.9] tracking-tight"
                >
                    <span className="block font-garamond italic text-3xl md:text-6xl font-normal">
                        Rep the code,
                    </span>
                    <span
                        className="block font-manrope font-extrabold uppercase tracking-[-0.02em] mt-2"
                        style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6rem)' }}
                    >
                        wear the legacy.
                    </span>
                </motion.h2>

                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
                >
                    <button
                        onClick={() => scrollToSection('#product-grid')}
                        className="group inline-flex items-center justify-center gap-3 bg-black text-white font-rajdhani font-semibold uppercase tracking-[0.2em] text-sm px-10 py-5 hover:bg-[#1a1a1a] transition-colors duration-300 w-fit"
                    >
                        Shop the drop
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                    </button>
                    <p className="font-manrope text-black/70 text-sm max-w-xs leading-relaxed">
                        One run. Numbered units. When the batch is gone, that is the end of it.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
