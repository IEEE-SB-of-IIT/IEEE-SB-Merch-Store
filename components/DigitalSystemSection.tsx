"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface DigitalSystemSectionProps {
    theme?: 'default' | 'codesprint' | 'ix';
}

// Deterministic pseudo-random to avoid hydration mismatch
function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export default function DigitalSystemSection({ theme = 'default' }: DigitalSystemSectionProps) {
    const themeConfig = {
        default: {
            bg: 'bg-arctic-base',
            accent: 'text-white/90',
            barcode: 'bg-white',
            headingFont: 'font-bebas'
        },
        codesprint: {
            bg: 'bg-cs-midnight',
            accent: 'text-cs-coral',
            barcode: 'bg-cs-mist',
            headingFont: 'font-mortend'
        },
        ix: {
            bg: 'bg-[#450a25]',
            accent: 'text-[#FF0879]',
            barcode: 'bg-[#ACD5F8]',
            headingFont: 'font-bebas'
        }
    };

    const styles = themeConfig[theme] || themeConfig.default;

    // Generate barcode deterministically to avoid hydration mismatch
    const barcodeWidths = useMemo(() =>
        Array.from({ length: 40 }, (_, i) => ({
            width: seededRandom(i + 1) > 0.5 ? '4px' : '1px',
            height: `${Math.max(40, seededRandom(i + 100) * 100)}%`,
        })),
    []);

    return (
        <section className={`w-full ${styles.bg} text-white py-24 md:py-32 overflow-hidden relative content-lazy`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

                {/* Main Typography Block */}
                <div className="flex flex-col gap-0 leading-[0.85] md:leading-[0.85]">
                    {/* Row 1 */}
                    <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
                        <motion.h2
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-[12vw] md:text-[8rem] ${styles.headingFont} font-black`}
                            style={{ willChange: 'transform, opacity' }}
                        >
                            STREET ENERGY
                        </motion.h2>

                        {/* Graffiti Tag Absolute/Relative positioning dance */}
                        <div className="relative hidden md:block">
                            <motion.span
                                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                                whileInView={{ scale: 1, rotate: -12, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                                className={`absolute -top-16 -left-4 text-6xl ${styles.accent} font-spray whitespace-nowrap drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                            >
                                IEEE SB
                            </motion.span>
                            <motion.h2
                                initial={{ y: 100, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`text-[12vw] md:text-[8rem] ${styles.headingFont} font-black`}
                            >
                                KEPT
                            </motion.h2>
                        </div>

                        {/* Mobile only KEPT to reflow properly */}
                        <motion.h2
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`md:hidden text-[12vw] md:text-[8rem] ${styles.headingFont} font-black`}
                        >
                            KEPT
                        </motion.h2>
                    </div>

                    {/* Row 2 */}
                    <motion.h2
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`text-[12vw] md:text-[8rem] ${styles.headingFont} font-black text-left`}
                    >
                        INTACT, JUST ALIGNED
                    </motion.h2>

                    {/* Row 3 - Flex container for text + barcode */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mt-4 md:mt-0">
                        <motion.h2
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`text-[12vw] md:text-[8rem] ${styles.headingFont} font-black leading-[0.85]`}
                        >
                            INTO A DIGITAL <br className="hidden md:block" /> SYSTEM
                        </motion.h2>

                        {/* Description & Barcode Block */}
                        <div className="w-full md:w-[400px] flex flex-col gap-6 md:pb-8">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="font-secondary text-xs md:text-sm text-white/80 leading-relaxed text-justify uppercase tracking-wide"
                            >
                                This is a conceptual e-commerce build for IEEE SB. The goal was to digitize a raw street brand without smoothing its edges — keeping the aggression, but structuring it into a usable system.
                            </motion.p>

                            {/* Barcode Visual — deterministic widths */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                whileInView={{ scaleX: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="h-16 w-full flex items-end gap-[2px] opacity-80 origin-left"
                            >
                                {barcodeWidths.map((bar, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.barcode} h-full`}
                                        style={{
                                            width: bar.width,
                                            height: bar.height,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
