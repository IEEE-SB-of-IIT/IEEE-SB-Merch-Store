'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { scrollToSection } from '../SmoothScroll';

/* Staggered rise for the wordmark — each word masked by its own overflow wrapper. */
const rise = {
    hidden: { y: '110%' },
    visible: (i: number) => ({
        y: '0%',
        transition: { duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

const fade = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 0.7 + i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

export default function CodeSprintHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });
    // Product drifts up slower than the page (parallax); wordmark sinks slightly.
    const productY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '18%']);
    const markY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-8%']);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-cs11-bg cs11-grain cs11-void"
        >
            {/* Void: faint orange floor-glow behind the product */}
            <div
                aria-hidden
                className="absolute right-[-10%] top-[8%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none opacity-[0.14]"
                style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 65%)' }}
            />

            {/* Floating product — the real CS11 hoodie */}
            <motion.div
                style={{ y: productY }}
                initial={reduceMotion ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-[-6%] sm:right-[0%] lg:right-[3%] top-[10%] sm:top-[8%] w-[92vw] sm:w-[64vw] lg:w-[46vw] max-w-[820px] z-0"
            >
                <div className="cs11-float relative aspect-[3/2]">
                    <Image
                        src="/images/codesprint-merch-images/cut/hoodie-black-orange-lace.png"
                        alt="CS11 zip hoodie, front and back, black with signal-orange drawstrings"
                        fill
                        priority
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 64vw, 46vw"
                        className="object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.8)]"
                    />
                </div>
                {/* Ground shadow */}
                <div
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 -bottom-[6%] w-[60%] h-10 rounded-[100%] bg-black/80 blur-2xl"
                />
            </motion.div>

            {/* Type block */}
            <motion.div style={{ y: markY }} className="relative z-10 w-full px-5 md:px-12 pb-10 md:pb-14">
                <motion.p
                    variants={fade}
                    custom={0}
                    initial={reduceMotion ? false : 'hidden'}
                    animate="visible"
                    className="font-garamond italic text-white/85 text-2xl md:text-4xl mb-2 md:mb-4"
                >
                    The battle has a uniform.
                </motion.p>

                <h1
                    aria-label="CodeSprint 11"
                    className="font-manrope font-extrabold uppercase text-white leading-[0.84] tracking-[-0.03em] select-none"
                    style={{ fontSize: 'clamp(2rem, 11.2vw, 11rem)' }}
                >
                    <span className="block overflow-hidden">
                        <motion.span
                            variants={rise}
                            custom={0}
                            initial={reduceMotion ? false : 'hidden'}
                            animate="visible"
                            className="block whitespace-nowrap"
                        >
                            COD<span className="inline-block" style={{ transform: 'scaleX(-1)' }}>E</span>SPRINT
                            <span className="text-cs11-orange">11</span>
                        </motion.span>
                    </span>
                </h1>

                <div className="mt-6 md:mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <motion.p
                        variants={fade}
                        custom={1}
                        initial={reduceMotion ? false : 'hidden'}
                        animate="visible"
                        className="font-manrope text-sm md:text-base text-white/70 max-w-md leading-relaxed"
                    >
                        The official CodeSprint 11 drop, designed in-house by the IEEE Student Branch
                        of IIT. One numbered run; when a batch sells out, it stays sold out.
                    </motion.p>

                    <motion.div
                        variants={fade}
                        custom={2}
                        initial={reduceMotion ? false : 'hidden'}
                        animate="visible"
                        className="flex items-center gap-8 shrink-0"
                    >
                        <button
                            onClick={() => scrollToSection('#product-grid')}
                            className="group inline-flex items-center gap-3 bg-cs11-orange text-black font-rajdhani font-semibold uppercase tracking-[0.2em] text-sm px-8 py-4 hover:bg-cs11-gold transition-colors duration-300"
                        >
                            Shop the drop
                            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={2} />
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
