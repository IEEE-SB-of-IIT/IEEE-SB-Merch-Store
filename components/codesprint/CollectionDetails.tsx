'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import ParallaxY from './ParallaxY';

const SPECS = [
    { label: 'Fabric', value: '300 GSM heavyweight cotton, pre-shrunk' },
    { label: 'Print', value: 'In-house artwork, drawn from scratch for CS11' },
    { label: 'Run', value: 'One numbered batch. No restock.' },
    { label: 'Fit', value: 'Unisex, true to size, S through XL' },
];

const reveal = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

export default function CollectionDetails() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();
    const anim = (i: number) => ({
        variants: reveal,
        custom: i,
        initial: reduceMotion ? false : ('hidden' as const),
        whileInView: 'visible' as const,
        viewport: { once: true, margin: '-80px' },
    });

    // The astronaut rises slower than the page — depth behind the statement.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const astroY = useTransform(scrollYProgress, [0, 1], ['16%', '-12%']);

    return (
        <section ref={sectionRef} id="details" className="relative bg-cs11-bg border-t border-white/[0.06] overflow-hidden cs11-void">
            <div className="max-w-[1500px] mx-auto px-5 md:px-12 pt-32 md:pt-48 relative">
                {/* Centered statement over the CS11 astronaut — the artwork on every Dream Tee */}
                <motion.div {...anim(0)} className="relative">
                    <motion.div
                        aria-hidden
                        style={reduceMotion ? { x: '-50%' } : { x: '-50%', y: astroY }}
                        className="absolute left-1/2 -top-24 md:-top-44 w-[min(78vw,560px)] pointer-events-none z-0"
                    >
                        <Image
                            src="/images/astronaut.webp"
                            alt=""
                            width={2392}
                            height={2995}
                            sizes="(max-width: 768px) 78vw, 560px"
                            className="w-full h-auto opacity-90 [mask-image:linear-gradient(to_bottom,black_50%,transparent_96%)]"
                        />
                    </motion.div>
                    <span aria-hidden className="hidden lg:flex items-center gap-3 absolute left-0 top-1/2 -translate-y-1/2 font-rajdhani font-semibold uppercase tracking-[0.25em] text-[10px] text-white/35 max-w-[140px] leading-relaxed z-10">
                        Sampled, then printed in one batch
                    </span>
                    <span aria-hidden className="hidden lg:flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2 font-rajdhani font-semibold uppercase tracking-[0.25em] text-[10px] text-white/35 max-w-[140px] leading-relaxed text-right z-10">
                        Original artwork, in-house
                    </span>
                    <h2 className="relative z-10 text-center leading-[0.95] tracking-tight mx-auto max-w-3xl pt-24 md:pt-40" style={{ textWrap: 'balance' }}>
                        <span className="block font-garamond italic text-white text-4xl md:text-6xl font-normal">
                            Built right,
                        </span>
                        <span className="block font-manrope font-extrabold uppercase text-3xl md:text-6xl text-white mt-2">
                            from the thread up.
                        </span>
                    </h2>
                </motion.div>
            </div>
            <div className="max-w-[1500px] mx-auto px-5 md:px-12 pt-16 md:pt-24 pb-24 md:pb-36 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative">

                {/* Statement + supporting image */}
                <div className="relative">
                    <motion.p {...anim(1)} className="font-manrope text-white/70 text-base leading-relaxed max-w-md">
                        Every piece in the drop is sampled, stress-tested through a 24-hour
                        hackathon, and printed in one batch. The artwork is original, the
                        fabric is heavy, and the count is final.
                    </motion.p>

                    <motion.div
                        {...anim(2)}
                        className="relative mt-14 w-[78%] max-w-[460px] aspect-[3/2] -rotate-3"
                    >
                        <div
                            aria-hidden
                            className="absolute inset-0 scale-110 rounded-full opacity-20 blur-3xl"
                            style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
                        />
                        <ParallaxY range={['6%', '-6%']} className="absolute inset-0">
                            <Image
                                src="/images/codesprint-merch-images/cut/tee-sublimation-v5.png"
                                alt="Ember jersey, black fading to ember orange, front and back"
                                fill
                                sizes="(max-width: 1024px) 78vw, 460px"
                                className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
                            />
                        </ParallaxY>
                    </motion.div>
                </div>

                {/* Spec sheet — hairlines draw in as each row reveals */}
                <div className="lg:pt-4 self-start lg:sticky lg:top-28">
                    {SPECS.map((spec, i) => (
                        <motion.div
                            key={spec.label}
                            {...anim(i + 1)}
                            className="group relative flex items-baseline justify-between gap-8 py-7 md:py-9"
                        >
                            {i === 0 && (
                                <motion.span
                                    aria-hidden
                                    initial={reduceMotion ? false : { scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute top-0 left-0 right-0 h-px bg-white/[0.08] origin-left"
                                />
                            )}
                            <motion.span
                                aria-hidden
                                initial={reduceMotion ? false : { scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true, margin: '-80px' }}
                                transition={{ duration: 0.9, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.08] origin-left"
                            />
                            <span className="font-rajdhani font-semibold uppercase tracking-[0.25em] text-xs text-cs11-orange shrink-0">
                                {spec.label}
                            </span>
                            <span className="font-manrope text-white text-lg md:text-2xl text-right transition-transform duration-500 ease-out group-hover:-translate-x-1">
                                {spec.value}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
