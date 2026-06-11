'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/* Cinematic interlude — the launchpad at dawn. The scene scrolls slower than
   the page (depth), the statement drifts gently against it. The ember sky
   hands the page off to the orange drench of FinalCall. */
export default function LaunchScene() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const sceneY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
    const textY = useTransform(scrollYProgress, [0.2, 0.9], ['14%', '-8%']);

    return (
        <section
            ref={sectionRef}
            aria-label="A rocket on the launchpad at dawn — CodeSprint 11"
            className="relative h-[85svh] md:h-[105svh] overflow-hidden bg-cs11-bg"
        >
            {/* Scene layer — taller than the section so the drift never shows edges */}
            <motion.div
                aria-hidden
                style={reduceMotion ? undefined : { y: sceneY }}
                className="absolute inset-x-0 -top-[14%] -bottom-[14%]"
            >
                <Image
                    src="/images/rocket.webp"
                    alt=""
                    fill
                    sizes="100vw"
                    loading="eager"
                    className="object-cover"
                />
            </motion.div>

            {/* Blend the scene into the void above and below */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-40 md:h-56 bg-gradient-to-b from-black to-transparent z-[5]" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-black/90 to-transparent z-[5]" />

            {/* Statement */}
            <div className="relative z-10 h-full max-w-[1500px] mx-auto px-5 md:px-12 flex flex-col justify-end pb-16 md:pb-24">
                <motion.div style={reduceMotion ? undefined : { y: textY }}>
                    <motion.h2
                        initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-120px' }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="leading-[0.92] tracking-tight"
                    >
                        <span className="block font-garamond italic text-white/90 text-3xl md:text-5xl font-normal">
                            Built through the night,
                        </span>
                        <span
                            className="block font-manrope font-extrabold uppercase text-white tracking-[-0.02em] mt-2"
                            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}
                        >
                            launched at dawn.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-120px' }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 font-manrope text-white/70 text-sm md:text-base max-w-sm leading-relaxed"
                    >
                        Twenty-four hours of code end at sunrise. The drop is cut from
                        the same night.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
