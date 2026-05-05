'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Warp speed streaks (CSS-animated) ── */
function WarpStreak({ delay, x, width, color, speed }: {
    delay: number; x: string; width: number; color: string; speed: number;
}) {
    return (
        <motion.div
            className="absolute pointer-events-none"
            style={{
                left: x,
                top: '-10%',
                width: width,
                height: '120%',
                background: `linear-gradient(180deg, transparent, ${color} 30%, ${color} 70%, transparent)`,
                opacity: 0,
            }}
            animate={{
                opacity: [0, 0.08, 0.15, 0.08, 0],
                scaleY: [0.5, 1, 1.2, 1, 0.5],
            }}
            transition={{
                duration: speed,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}

export default function WarpCallToAction() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
    const textY = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);
    const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

    const [streaks, setStreaks] = useState<Array<{
        id: number; delay: number; x: string; width: number; color: string; speed: number;
    }>>([]);

    useEffect(() => {
        const colors = ['rgba(255,91,65,0.4)', 'rgba(242,162,101,0.3)', 'rgba(255,136,102,0.3)', 'rgba(255,170,119,0.2)'];
        setStreaks(
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                delay: Math.random() * 6,
                x: `${Math.random() * 100}%`,
                width: 1 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 3 + Math.random() * 4,
            }))
        );
    }, []);

    const scrollToProducts = useCallback(() => {
        document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <section
            ref={ref}
            className="relative w-full py-32 md:py-48 bg-cs-midnight overflow-hidden"
        >
            {/* Deep space nebula bg */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 50%, rgba(255,91,65,0.06) 0%, transparent 50%), ' +
                            'radial-gradient(ellipse at 20% 80%, rgba(242,162,101,0.04) 0%, transparent 40%), ' +
                            'radial-gradient(ellipse at 80% 20%, rgba(255,102,68,0.05) 0%, transparent 45%)',
                    }}
                />
            </div>

            {/* Warp streaks */}
            {streaks.map((s) => (
                <WarpStreak key={s.id} {...s} />
            ))}

            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[300, 500, 700, 900].map((size, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border"
                        style={{
                            width: size,
                            height: size,
                            borderColor: `rgba(255,91,65,${0.06 - i * 0.012})`,
                            rotate: ringRotate,
                        }}
                    />
                ))}
            </div>

            {/* Center content */}
            <motion.div
                className="relative z-10 max-w-4xl mx-auto px-6 text-center"
                style={{ y: textY, scale }}
            >
                {/* Beacon */}
                <motion.div
                    className="mx-auto mb-12 relative"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: 'spring' }}
                >
                    <div className="w-20 h-20 mx-auto relative">
                        {/* Outer pulse */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-cs-coral/20"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                        />
                        {/* Inner pulse */}
                        <motion.div
                            className="absolute inset-2 rounded-full border border-cs-coral/30"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                        />
                        {/* Core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-4 h-4 rounded-full bg-cs-coral"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    boxShadow: '0 0 20px rgba(255,91,65,0.6), 0 0 40px rgba(255,91,65,0.3), 0 0 60px rgba(255,91,65,0.1)',
                                }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-mortend text-4xl md:text-6xl lg:text-[5.5rem] leading-[0.85] text-white uppercase tracking-tight"
                >
                    Don&apos;t Just
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-coral via-cs-amber to-cs-coral">
                        Watch The Launch
                    </span>
                    <br />
                    <span className="text-white/80">Be Part Of It</span>
                </motion.h2>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-8 text-sm md:text-base text-white/25 max-w-lg mx-auto leading-relaxed font-tommy"
                >
                    Rep the code. Wear the legacy. This isn&apos;t merch — it&apos;s a statement from the frontier.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {/* Primary CTA */}
                    <button
                        onClick={scrollToProducts}
                        className="group relative px-10 py-4 rounded-full overflow-hidden font-mortend text-sm uppercase tracking-[0.2em]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cs-coral to-cs-amber" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cs-amber to-cs-coral"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ boxShadow: '0 0 40px rgba(255,91,65,0.4), 0 0 80px rgba(255,91,65,0.2)' }}
                        />
                        <span className="relative z-10 text-white">Shop Now</span>
                    </button>

                    {/* Secondary CTA */}
                    <button
                        onClick={scrollToProducts}
                        className="group px-10 py-4 rounded-full border border-white/10 hover:border-cs-coral/40 font-mortend text-sm uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all duration-300"
                    >
                        View All Items
                    </button>
                </motion.div>

                {/* Bottom decorative */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 flex items-center justify-center gap-3"
                >
                    <motion.div
                        className="w-1 h-1 rounded-full bg-cs-coral/40"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em]">
                        Signal Locked — Coordinates Verified
                    </span>
                    <motion.div
                        className="w-1 h-1 rounded-full bg-cs-coral/40"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
