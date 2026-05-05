'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Floating astronaut silhouette (pure CSS) ── */
function AstronautSilhouette({ x, y, size, rotation, delay }: {
    x: string; y: string; size: number; rotation: number; delay: number;
}) {
    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{ left: x, top: y }}
            animate={{
                y: [0, -20, 0, 15, 0],
                rotate: [rotation, rotation + 15, rotation - 10, rotation + 5, rotation],
            }}
            transition={{ duration: 12, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
            <svg width={size} height={size} viewBox="0 0 80 100" fill="none" className="opacity-[0.06]">
                {/* Helmet */}
                <ellipse cx="40" cy="22" rx="18" ry="20" fill="currentColor" className="text-cs-coral" />
                {/* Visor */}
                <ellipse cx="40" cy="22" rx="12" ry="13" fill="currentColor" className="text-cs-amber" opacity="0.3" />
                {/* Body */}
                <rect x="22" y="40" width="36" height="30" rx="8" fill="currentColor" className="text-cs-coral" />
                {/* Backpack */}
                <rect x="15" y="42" width="8" height="24" rx="4" fill="currentColor" className="text-cs-coral" opacity="0.7" />
                {/* Legs */}
                <rect x="25" y="68" width="12" height="26" rx="6" fill="currentColor" className="text-cs-coral" />
                <rect x="43" y="68" width="12" height="26" rx="6" fill="currentColor" className="text-cs-coral" />
                {/* Left arm */}
                <rect x="8" y="44" width="14" height="8" rx="4" fill="currentColor" className="text-cs-coral" opacity="0.8" />
                {/* Right arm */}
                <rect x="58" y="48" width="14" height="8" rx="4" fill="currentColor" className="text-cs-coral" opacity="0.8" />
            </svg>
        </motion.div>
    );
}

const MARQUEE_ITEMS = [
    { label: 'PREMIUM COTTON', icon: '◆' },
    { label: 'SPACE GRADE', icon: '✦' },
    { label: 'LIMITED EDITION', icon: '◆' },
    { label: 'ZERO GRAVITY FIT', icon: '✦' },
    { label: 'MISSION READY', icon: '◆' },
    { label: 'COSMIC COMFORT', icon: '✦' },
    { label: 'BUILT TO LAST', icon: '◆' },
    { label: 'INTERSTELLAR DRIP', icon: '✦' },
];

export default function CosmicFeatureStrip() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
    const x2 = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

    const [astronauts, setAstronauts] = useState<Array<{
        id: number; x: string; y: string; size: number; rotation: number; delay: number;
    }>>([]);

    useEffect(() => {
        setAstronauts(
            Array.from({ length: 6 }, (_, i) => ({
                id: i,
                x: `${10 + Math.random() * 80}%`,
                y: `${10 + Math.random() * 80}%`,
                size: 60 + Math.random() * 40,
                rotation: Math.random() * 30 - 15,
                delay: Math.random() * 5,
            }))
        );
    }, []);

    return (
        <section
            ref={ref}
            className="relative w-full py-24 md:py-32 bg-cs-midnight overflow-hidden"
        >
            {/* Astronaut silhouettes floating */}
            {astronauts.map((a) => (
                <AstronautSilhouette key={a.id} {...a} />
            ))}

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cs-coral/30 to-transparent" />

            {/* Scrolling marquee row 1 */}
            <motion.div className="flex whitespace-nowrap mb-6" style={{ x: x1, scale }}>
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 mx-6 md:mx-10"
                    >
                        <span className="text-cs-coral/30 text-sm">{item.icon}</span>
                        <span className="font-mortend text-3xl md:text-5xl lg:text-6xl text-white/[0.07] uppercase tracking-wider">
                            {item.label}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Center content strip */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {[
                        {
                            number: '01',
                            title: 'Orbital Design',
                            desc: 'Every stitch calculated. Every thread placed with precision. Engineered for the cosmic coder.',
                            gradient: 'from-cs-coral to-cs-amber',
                        },
                        {
                            number: '02',
                            title: 'Zero-G Comfort',
                            desc: 'Premium heavyweight fabric that feels like floating in space. 24-hour hackathon tested.',
                            gradient: 'from-cs-amber to-[#ff8866]',
                        },
                        {
                            number: '03',
                            title: 'Mission Patches',
                            desc: 'Custom embroidered mission patches. Each piece tells the story of CodeSprint legacy.',
                            gradient: 'from-[#ff8866] to-cs-coral',
                        },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="group relative"
                        >
                            {/* Number */}
                            <div className={`text-6xl md:text-7xl font-mortend bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-500 leading-none`}>
                                {feature.number}
                            </div>

                            {/* Content */}
                            <div className="mt-4 space-y-3">
                                <h3 className="font-mortend text-lg md:text-xl text-white uppercase tracking-wider">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-white/30 leading-relaxed font-tommy">
                                    {feature.desc}
                                </p>
                            </div>

                            {/* Bottom accent */}
                            <motion.div
                                className={`mt-6 h-px bg-gradient-to-r ${feature.gradient} origin-left`}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Scrolling marquee row 2 (reverse direction) */}
            <motion.div className="flex whitespace-nowrap mt-6" style={{ x: x2, scale }}>
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 mx-6 md:mx-10"
                    >
                        <span className="text-cs-amber/20 text-sm">{item.icon}</span>
                        <span className="font-mortend text-3xl md:text-5xl lg:text-6xl text-white/[0.04] uppercase tracking-wider">
                            {item.label}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cs-amber/20 to-transparent" />
        </section>
    );
}
