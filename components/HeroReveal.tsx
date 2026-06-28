"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Diameter of the peephole/cursor ring in px
const LENS = 380;

function AstronautImg({
  src,
  greyscale = false,
}: {
  src: string;
  greyscale?: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {/* overflow-hidden clips the scale(1.5) zoom */}
      <div className="absolute right-0 top-0 bottom-0 w-[62%] md:w-[56%] overflow-hidden">
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
        {/* thin top fade for any white background remnant */}
        <div className="absolute top-0 left-0 right-0 h-[18%] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        {/* left edge blends into dark hero */}
        <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-black to-transparent pointer-events-none" />
        {/* bottom anchor */}
        <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default function HeroReveal() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [local, setLocal] = useState({ x: 0, y: 0 }); // relative to hero
  const [client, setClient] = useState({ x: 0, y: 0 }); // viewport, for fixed cursor
  const [on, setOn] = useState(false);

  useEffect(() => {
    const measure = () => {
      const r = heroRef.current?.getBoundingClientRect();
      if (r) setDims({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (heroRef.current) ro.observe(heroRef.current);
    return () => ro.disconnect();
  }, []);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLocal({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setClient({ x: e.clientX, y: e.clientY });
  }, []);

  const r = LENS / 2; // hole radius

  // CSS mask: a hard-edged circular hole cut out of the top layer.
  // transparent inside = hole reveals layer below. black outside = opaque.
  const holeMask = on
    ? `radial-gradient(circle ${r}px at ${local.x}px ${local.y}px, transparent ${r}px, black ${r}px)`
    : "none";

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden bg-black select-none cursor-none"
      onMouseMove={onMove}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
    >
      {/* ── LAYER 0 (bottom): astro2 — the merch astronaut, always present ──
          Replace src with /images/astronaut-merch.webp once you have that asset. */}
      <AstronautImg src="/images/astro2.webp" />

      {/* ── LAYER 1 (top): astro1 — full screen, greyscale, with a circular
          hole cut at the cursor position that reveals astro2 below ── */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: holeMask,
          maskImage: holeMask,
        }}
      >
        <AstronautImg src="/images/astro1.webp" greyscale />
      </div>

      {/* ── CURSOR: orange ring that outlines the peephole exactly ── */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: client.x,
          top: client.y,
          transform: "translate(-50%, -50%)",
        }}
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

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between px-8 py-8 md:px-16 md:py-10">

        {/* spacer for fixed navbar */}
        <div className="pt-20" />

        {/* main headline */}
        <div className="max-w-[min(600px,48vw)]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-manrope text-[9px] text-cs11-orange/70 tracking-[0.55em] uppercase mb-7"
          >
            CodeSprint 11 × Cicada
          </motion.p>

          {[
            { text: "The battle", serif: false, size: "clamp(4rem, 9vw, 9.5rem)",    leading: "0.85" },
            { text: "has a",      serif: true,  size: "clamp(5.5rem, 12vw, 13rem)",  leading: "0.82" },
            { text: "uniform.",   serif: false, size: "clamp(4rem, 9vw, 9.5rem)",    leading: "0.85" },
          ].map(({ text, serif, size, leading }, i) => (
            <div key={text} className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.55 + i * 0.1,
                }}
                className={`block ${
                  serif
                    ? "font-garamond italic font-normal text-cs11-orange"
                    : "font-sans uppercase tracking-[-0.02em] text-white"
                }`}
                style={{ fontSize: size, lineHeight: leading }}
              >
                {text}
              </motion.h1>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.97 }}
            className="mt-9 text-white/40 font-manrope text-[13px] leading-relaxed max-w-[260px] tracking-wide"
          >
            One numbered run. When a batch sells out, it stays sold out.
          </motion.p>
        </div>

        {/* bottom bar */}
        <div className="flex justify-between items-end pb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex items-center gap-4"
          >
            <div className="w-7 h-px bg-white/20" />
            <span className="text-white/25 font-manrope text-[9px] tracking-[0.35em] uppercase">
              Scroll to explore
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-white/20 font-manrope text-[9px] tracking-[0.3em] uppercase"
          >
            Hover to reveal
          </motion.p>
        </div>
      </div>
    </section>
  );
}
