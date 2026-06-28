"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LENS = 380;

function AstronautImg({ src, greyscale = false }: { src: string; greyscale?: boolean }) {
  return (
    <div className="absolute inset-0">
      {/* Mobile: full bleed. md+: right column only */}
      <div className="absolute inset-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[56%] overflow-hidden">
        <Image
          src={src}
          alt="Astronaut"
          fill
          className="object-cover"
          style={{
            objectPosition: "center top",
            transform: "scale(1.15)",
            transformOrigin: "top center",
            ...(greyscale ? { filter: "grayscale(1) brightness(0.5)" } : {}),
          }}
          priority
        />
        {/* top fade */}
        <div className="absolute top-0 left-0 right-0 h-[18%] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        {/* left blend — desktop only, where this is a right column */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-black to-transparent pointer-events-none" />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

const HEADLINE = [
  { text: "The battle", outline: false },
  { text: "has a",      outline: true  },
  { text: "uniform.",   outline: false },
] as const;

export default function HeroReveal() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState({ x: 0, y: 0 });
  const [client, setClient] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);

  const updatePosition = useCallback((x: number, y: number) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLocal({ x: x - rect.left, y: y - rect.top });
    setClient({ x, y });
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    setOn(true);
    updatePosition(touch.clientX, touch.clientY);
  }, [updatePosition]);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    updatePosition(touch.clientX, touch.clientY);
  }, [updatePosition]);

  const r = LENS / 2;
  const holeMask = on
    ? `radial-gradient(circle ${r}px at ${local.x}px ${local.y}px, transparent ${r}px, black ${r}px)`
    : "none";

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] overflow-hidden bg-black select-none cursor-none"
      onMouseMove={onMove}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setOn(false)}
      onTouchCancel={() => setOn(false)}
    >
      {/* Layer 0: astro2 — merch astronaut (bottom) */}
      <AstronautImg src="/images/astro2.webp" />

      {/* Layer 1: astro1 — greyscale with peephole mask */}
      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: holeMask, maskImage: holeMask }}
      >
        <AstronautImg src="/images/astro1.webp" greyscale />
      </div>

      {/* Mobile text backdrop — gradient from bottom so text stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/75 to-transparent md:hidden pointer-events-none" />

      {/* Custom cursor ring */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{ left: client.x, top: client.y, transform: "translate(-50%,-50%)" }}
      >
        <motion.div
          style={{ width: LENS, height: LENS }}
          className="rounded-full border border-cs11-orange/70 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <span className="font-manrope text-[8px] text-cs11-orange tracking-[0.22em] uppercase">
            Shop
          </span>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col min-h-[100svh] justify-end md:justify-between px-6 py-8 md:px-16 md:py-10">

        {/* Desktop navbar spacer */}
        <div className="hidden md:block pt-20" />

        {/* Headline block */}
        <div className="w-full md:max-w-[min(580px,46vw)] mb-8 md:mb-0">

          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex items-center gap-3 mb-5 md:mb-7"
          >
            <span className="block w-5 h-px bg-cs11-orange/50 shrink-0" />
            <span className="font-manrope text-[9px] text-cs11-orange/55 tracking-[0.55em] uppercase">
              CodeSprint 11 × Cicada
            </span>
          </motion.div>

          {/* Three-line headline */}
          {HEADLINE.map(({ text, outline }, i) => (
            <div key={text} className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.48 + i * 0.1 }}
                className="block font-sans uppercase tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(2.75rem, 9vw, 9.5rem)",
                  lineHeight: "0.85",
                  color: outline ? "transparent" : "white",
                  WebkitTextStroke: outline ? "1.5px #ff6a3d" : undefined,
                }}
              >
                {text}
              </motion.h1>
            </div>
          ))}

          {/* Descriptor */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.88 }}
            className="mt-6 md:mt-9 text-white/35 font-manrope text-[11px] md:text-[13px] leading-relaxed max-w-[210px] md:max-w-[260px] tracking-wide"
          >
            One numbered run. When a batch sells out, it stays sold out.
          </motion.p>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-end pb-2 md:pb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-6 h-px bg-white/20" />
            <span className="text-white/25 font-manrope text-[9px] tracking-[0.35em] uppercase">
              Scroll to explore
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.15 }}
            className="hidden md:block text-white/20 font-manrope text-[9px] tracking-[0.3em] uppercase"
          >
            Hover to reveal
          </motion.p>
        </div>
      </div>
    </section>
  );
}
