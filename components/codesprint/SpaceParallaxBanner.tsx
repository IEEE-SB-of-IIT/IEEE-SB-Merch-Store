'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ── Floating space debris / particles ── */
function FloatingParticle({ delay, size, x, y, duration, color }: {
    delay: number; size: number; x: string; y: string; duration: number; color: string;
}) {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
                width: size,
                height: size,
                left: x,
                top: y,
                background: color,
                boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40`,
            }}
            animate={{
                y: [0, -30, 0, 20, 0],
                x: [0, 15, -10, 5, 0],
                opacity: [0.3, 0.8, 0.5, 0.9, 0.3],
                scale: [1, 1.3, 0.9, 1.1, 1],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    );
}

/* ── Orbital ring ── */
function OrbitalRing({ size, rotation, speed, color }: {
    size: number; rotation: number; speed: number; color: string;
}) {
    return (
        <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
            style={{
                width: size,
                height: size,
                borderColor: color,
                borderWidth: 1,
                rotate: rotation,
            }}
            animate={{ rotate: [rotation, rotation + 360] }}
            transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
            {/* Orbiting dot */}
            <motion.div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                style={{
                    background: color,
                    boxShadow: `0 0 12px ${color}, 0 0 24px ${color}60`,
                }}
            />
        </motion.div>
    );
}

/* ── Main component ── */
export default function SpaceParallaxBanner() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
    const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Generate particles on client only to avoid hydration mismatch
    const [particles, setParticles] = useState<Array<{
        id: number; delay: number; size: number; x: string; y: string;
        duration: number; color: string;
    }>>([]);

    useEffect(() => {
        const colors = ['#ff5b41', '#F2A265', '#ff8866', '#ffaa77', '#ff6644'];
        const generated = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            delay: Math.random() * 5,
            size: Math.random() * 4 + 2,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            duration: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(generated);
    }, []);

    return (
        <section
            ref={ref}
            className="relative w-full min-h-[100vh] bg-cs-midnight overflow-hidden flex items-center justify-center"
        >
            {/* Deep space gradient background */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: bgY }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-cs-midnight via-[#1a1015] to-cs-midnight" />
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background:
                            'radial-gradient(ellipse at 30% 50%, rgba(255,91,65,0.15) 0%, transparent 60%), ' +
                            'radial-gradient(ellipse at 70% 30%, rgba(242,162,101,0.12) 0%, transparent 50%), ' +
                            'radial-gradient(ellipse at 50% 80%, rgba(255,102,68,0.08) 0%, transparent 40%)',
                    }}
                />
                {/* Star field */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        backgroundImage: `
                            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
                            radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
                            radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,200,150,0.5) 0%, transparent 100%),
                            radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
                            radial-gradient(1.5px 1.5px at 15% 90%, rgba(255,91,65,0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(2px 2px at 60% 70%, rgba(242,162,101,0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.5) 0%, transparent 100%)
                        `,
                    }}
                />
            </motion.div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                    <FloatingParticle key={p.id} {...p} />
                ))}
            </div>

            {/* Orbital rings */}
            <motion.div className="absolute inset-0 pointer-events-none" style={{ scale: ringScale }}>
                <OrbitalRing size={500} rotation={0} speed={40} color="rgba(255,91,65,0.15)" />
                <OrbitalRing size={700} rotation={60} speed={55} color="rgba(242,162,101,0.1)" />
                <OrbitalRing size={350} rotation={120} speed={30} color="rgba(255,102,68,0.12)" />
            </motion.div>

            {/* Center content */}
            <motion.div
                className="relative z-10 text-center max-w-5xl mx-auto px-6"
                style={{ y: textY, opacity }}
            >
                {/* Decorative top label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-center gap-4 mb-8"
                >
                    <span className="w-12 h-px bg-cs-coral/40" />
                    <span className="text-[11px] font-mono text-cs-coral/60 uppercase tracking-[0.4em]">
                        Transmission Incoming
                    </span>
                    <span className="w-12 h-px bg-cs-coral/40" />
                </motion.div>

                {/* Main heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="font-mortend text-5xl md:text-7xl lg:text-[6rem] leading-[0.85] text-white uppercase tracking-tight"
                >
                    Gear Up For
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cs-coral via-cs-amber to-cs-coral">
                        The Mission
                    </span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-8 text-sm md:text-base text-white/40 max-w-xl mx-auto leading-relaxed font-tommy"
                >
                    Official CodeSprint merchandise — engineered for those who code beyond the atmosphere.
                    Limited edition. Zero gravity comfort.
                </motion.p>

                {/* Animated CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-12 inline-flex items-center gap-3"
                >
                    <button
                        onClick={() => document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 rounded-full overflow-hidden font-mortend text-sm uppercase tracking-[0.2em]"
                    >
                        {/* Button glow bg */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cs-coral to-cs-amber opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cs-coral to-cs-amber opacity-0 group-hover:opacity-40 blur-xl transition-opacity" />
                        <span className="relative z-10 text-white flex items-center gap-2">
                            Explore Collection
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </span>
                    </button>
                </motion.div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-16 flex items-center justify-center gap-8 md:gap-16"
                >
                    {[
                        { value: '24H', label: 'Hackathon' },
                        { value: '500+', label: 'Coders' },
                        { value: 'LTD', label: 'Edition' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-mortend text-cs-coral">{stat.value}</div>
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Bottom fade to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cs-midnight to-transparent pointer-events-none" />
        </section>
    );
}
