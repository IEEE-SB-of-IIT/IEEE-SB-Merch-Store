"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ColdSection() {
    return (
        <section className="w-full bg-arctic-base text-white py-24 md:py-32 overflow-hidden relative min-h-[90vh] flex items-center">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
            </div>

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative w-full h-full flex flex-col md:flex-row items-center justify-center">

                {/* Top Left Typography */}
                <div className="absolute top-0 left-6 md:top-10 md:left-12 z-20 max-w-2xl mix-blend-screen pointer-events-none">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-bebas font-black  leading-[0.85] uppercase text-white/90"
                    >
                        WEAR THE <span className="text-white/40">VISION,</span><br />
                        SHAPE <br />
                        THE <span className="text-white/40">FUTURE</span>
                    </motion.h2>
                </div>

                {/* Center Image */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 w-full max-w-2xl aspect-square md:aspect-[4/3] flex items-center justify-center"
                >
                    {/* Floating Animation Wrapper */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src="/images/hero.png"
                            alt="Cold Puffer"
                            fill
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            priority
                        />
                    </motion.div>

                    {/* Graffiti Tag overlaid on image/text intersection */}
                    <motion.div
                        initial={{ scale: 0, rotate: 10 }}
                        whileInView={{ scale: 1, rotate: -5 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute bottom-20 left-0 md:-left-10 z-30 opacity-90"
                    >
                        <span className="font-spray text-6xl md:text-8xl text-white drop-shadow-md">IEEE SB</span>
                    </motion.div>
                </motion.div>

                {/* Bottom Right Typography */}
                <div className="absolute bottom-10 right-6 md:bottom-20 md:right-12 z-20 max-w-3xl text-right pointer-events-none">
                    <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bebas font-black  leading-[0.85] uppercase text-white/80"
                    >
                        POWERED BY <br />
                        <span className="text-white/40">IDEAS</span> DRIVEN BY <span className="text-white">YOU</span>
                    </motion.h2>
                </div>

                {/* Technical Details (Absolute decorative) */}
                <div className="absolute bottom-16 left-6 md:left-12 space-y-2 hidden md:block opacity-60">
                    {['[ IEEE IIT SB ]', '[ INNOVATION ]', '[ TECHNOLOGY ]', '[ COMMUNITY ]'].map((text, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="font-secondary text-[10px] tracking-widest uppercase"
                        >
                            {text}
                        </motion.p>
                    ))}
                </div>

                <div className="absolute bottom-6 left-6 md:left-12 opacity-40 font-secondary text-[10px] tracking-widest uppercase">
                    [ STATUS: ONLINE ] [ VERIFIED ]
                </div>

                <div className="absolute top-10 right-6 md:right-12 opacity-60 font-secondary text-xs text-right hidden md:block max-w-[200px]">
                    THE OFFICIAL MERCHANDISE OF IEEE IIT STUDENT BRANCH.
                </div>

            </div>
        </section>
    );
}
