'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Floating debris chunk ── */
function SpaceDebris({ delay, x, y, size, rotation, speed }: {
    delay: number; x: string; y: string; size: number; rotation: number; speed: number;
}) {
    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{ left: x, top: y }}
            animate={{
                y: [0, -40, 10, -20, 0],
                x: [0, 20, -15, 8, 0],
                rotate: [rotation, rotation + 180, rotation + 360],
                opacity: [0.05, 0.15, 0.08, 0.12, 0.05],
            }}
            transition={{ duration: speed, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div
                className="bg-cs-coral/20"
                style={{
                    width: size,
                    height: size * 0.6,
                    clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                }}
            />
        </motion.div>
    );
}

export default function MissionControlSection() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.06, 0.06, 0]);
    const contentY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

    const [debris, setDebris] = useState<Array<{
        id: number; delay: number; x: string; y: string; size: number; rotation: number; speed: number;
    }>>([]);

    useEffect(() => {
        setDebris(
            Array.from({ length: 10 }, (_, i) => ({
                id: i,
                delay: Math.random() * 4,
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                size: 20 + Math.random() * 40,
                rotation: Math.random() * 360,
                speed: 10 + Math.random() * 10,
            }))
        );
    }, []);

    const missionData = [
        {
            code: 'CS::001',
            label: 'MATERIAL SPEC',
            items: ['300 GSM Premium Cotton', 'Reactive Print Technology', 'Reinforced Stitching'],
        },
        {
            code: 'CS::002',
            label: 'DESIGN INTEL',
            items: ['Custom Woven Labels', 'Embossed Branding', 'Space-Grade Ink'],
        },
        {
            code: 'CS::003',
            label: 'MISSION PATCH',
            items: ['Limited Numbered Series', 'UV Reactive Elements', 'Collector Tags'],
        },
        {
            code: 'CS::004',
            label: 'FIT PROFILE',
            items: ['Oversized Drop Shoulder', 'Ribbed Cuff & Hem', 'Comfort-First Cut'],
        },
    ];

    return (
        <section
            ref={ref}
            className="relative w-full py-32 md:py-40 bg-cs-midnight overflow-hidden"
        >
            {/* Animated grid background */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: gridOpacity }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,91,65,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,91,65,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Perspective overlay for depth */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, transparent 30%, rgba(21,25,34,1) 70%)',
                    }}
                />
            </motion.div>

            {/* Floating debris */}
            {debris.map((d) => (
                <SpaceDebris key={d.id} {...d} />
            ))}

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12"
                style={{ y: contentY }}
            >
                {/* Section header */}
                <div className="mb-20 md:mb-28">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        {/* Pulsing dot */}
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cs-coral opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cs-coral" />
                        </span>
                        <span className="text-[11px] font-mono text-cs-coral/60 uppercase tracking-[0.4em]">
                            Mission Control — Live Feed
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="font-mortend text-4xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.9] max-w-4xl"
                    >
                        Every Detail
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-coral via-cs-amber to-[#ff8866]">
                            Meticulously Crafted
                        </span>
                    </motion.h2>
                </div>

                {/* Mission data grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {missionData.map((mission, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative p-6 md:p-8 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cs-coral/20 transition-all duration-500 h-full">
                                {/* Glow on hover */}
                                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        boxShadow: 'inset 0 0 40px rgba(255,91,65,0.05), 0 0 60px rgba(255,91,65,0.03)',
                                    }}
                                />

                                {/* Code label */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-mono text-cs-coral/50 tracking-[0.3em]">
                                        {mission.code}
                                    </span>
                                    <span className="w-2 h-2 rounded-full bg-cs-coral/20 group-hover:bg-cs-coral/60 transition-colors duration-300" />
                                </div>

                                {/* Label */}
                                <h3 className="font-mortend text-base md:text-lg text-white uppercase tracking-wider mb-6">
                                    {mission.label}
                                </h3>

                                {/* Items */}
                                <ul className="space-y-3">
                                    {mission.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-cs-coral/40 flex-shrink-0" />
                                            <span className="text-xs text-white/30 font-tommy leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Bottom line */}
                                <motion.div
                                    className="mt-6 h-px bg-gradient-to-r from-cs-coral/30 to-transparent origin-left"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom ticker */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-16 md:mt-24 flex items-center justify-center gap-6"
                >
                    <span className="w-16 h-px bg-gradient-to-r from-transparent to-cs-coral/20" />
                    <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.5em]">
                        [ CODESPRINT × IEEE SB — MERCH DIVISION ]
                    </span>
                    <span className="w-16 h-px bg-gradient-to-l from-transparent to-cs-coral/20" />
                </motion.div>
            </motion.div>
        </section>
    );
}
