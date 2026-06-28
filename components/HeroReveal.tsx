"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      op: Math.random() * 0.28 + 0.04,
      target: Math.random() * 0.28 + 0.04,
      vx: (Math.random() - 0.5) * 0.00007,
      vy: (Math.random() - 0.5) * 0.00007,
      orange: Math.random() < 0.07,
    }));

    const tick = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;
        s.op += (s.target - s.op) * 0.018;
        if (Math.abs(s.op - s.target) < 0.004) s.target = Math.random() * 0.28 + 0.04;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.orange
          ? `rgba(255,106,61,${(s.op * 1.8).toFixed(3)})`
          : `rgba(255,255,255,${s.op.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

const HEADLINE = [
  { text: "The battle", outline: false },
  { text: "has a",      outline: true  },
  { text: "uniform.",   outline: false },
] as const;

export default function HeroReveal() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1, h: 1 });
  const [local, setLocal] = useState({ x: 0, y: 0 });
  const [client, setClient] = useState({ x: 0, y: 0 });
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

  // Normalised cursor offset from center: -0.5 → 0.5. Resets to 0 when cursor leaves.
  const nx = on ? local.x / dims.w - 0.5 : 0;
  const ny = on ? local.y / dims.h - 0.5 : 0;
  const EASE = "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)";
  const px = (mul: number) =>
    ({ transform: `translate(${nx * mul}px, ${ny * mul}px)`, transition: EASE }) as React.CSSProperties;

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

      {/* Star field */}
      <StarField />

      {/* ── Rock field ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>

        {/* Rock collection — bottom-right, flipped vertically. Parallax mul=6 (anchored) */}
        <div className="absolute bottom-0 right-0 w-[55%] md:w-[44%]" style={{ opacity: 0.88, ...px(6) }}>
          <div style={{ transform: "scaleY(-1)", transformOrigin: "bottom right" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-collection-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Far — top-left, tiny, sharp. mul=5 */}
        <div className="absolute" style={{ top: "14%", left: "3%", width: "5%", filter: "blur(0px)", opacity: 0.55, ...px(5) }}>
          <div style={{ transform: "rotate(-22deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Far — upper-center, small, no blur. mul=4 */}
        <div className="absolute" style={{ top: "7%", left: "38%", width: "4%", filter: "blur(0px)", opacity: 0.45, ...px(4) }}>
          <div style={{ transform: "rotate(65deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Mid-far — right side, blur 1px. mul=11 */}
        <div className="absolute" style={{ top: "90%", right: "0%", width: "7%", filter: "blur(0px)", opacity: 0.5, ...px(11) }}>
          <div style={{ transform: "rotate(135deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Mid — lower-center, blur 2.5px. mul=17 */}
        <div className="absolute" style={{ top: "62%", left: "40%", width: "10%", filter: "blur(1px)", opacity: 0.5, ...px(17) }}>
          <div style={{ transform: "rotate(-80deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Close — upper-right, blur 5px. mul=24 */}
        <div className="absolute" style={{ top: "6%", right: "-6%", width: "16%", filter: "blur(3px)", opacity: 0.9, ...px(24) }}>
          <div style={{ transform: "rotate(-50deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

        {/* Very close foreground — left, blur 9px. mul=32 */}
        <div className="absolute" style={{ bottom: "18%", left: "-8%", width: "22%", filter: "blur(1px)", opacity: 0.22, ...px(32) }}>
          <div style={{ transform: "rotate(25deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
          </div>
        </div>

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
            <div key={text} className="overflow-hidden pt-[4px] -mt-[4px]">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.48 + i * 0.1 }}
                className="block font-sans uppercase tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(3.5rem, 9vw, 9.5rem)",
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
