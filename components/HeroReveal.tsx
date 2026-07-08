"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { scrollToSection } from "./SmoothScroll";

const LENS = 380;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* Cursor springs — one config so the ring and the reveal hole stay in lockstep. */
const CURSOR_SPRING = { stiffness: 300, damping: 30, mass: 0.7 };
const ROCK_SPRING = { stiffness: 120, damping: 20 };

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

/* ── Rock field config — depth ordered far → near ── */
interface RockCfg {
  pos: React.CSSProperties;
  width: string;
  blur: number;
  opacity: number;
  rotate: number;
  mul: number;
  spin: string;
  reverse?: boolean;
}

const ROCKS: RockCfg[] = [
  { pos: { top: "14%", left: "3%" },    width: "5%",  blur: 0, opacity: 0.55, rotate: -22, mul: 5,  spin: "140s" },
  { pos: { top: "7%",  left: "38%" },   width: "4%",  blur: 0, opacity: 0.45, rotate: 65,  mul: 4,  spin: "110s", reverse: true },
  { pos: { top: "90%", right: "0%" },   width: "7%",  blur: 0, opacity: 0.5,  rotate: 135, mul: 11, spin: "130s" },
  { pos: { top: "62%", left: "40%" },   width: "10%", blur: 1, opacity: 0.5,  rotate: -80, mul: 17, spin: "95s",  reverse: true },
  { pos: { top: "6%",  right: "-6%" },  width: "16%", blur: 3, opacity: 0.9,  rotate: -50, mul: 24, spin: "120s" },
  { pos: { bottom: "18%", left: "-8%" }, width: "22%", blur: 1, opacity: 0.22, rotate: 25, mul: 32, spin: "160s", reverse: true },
];

function Rock({
  cfg,
  nx,
  ny,
  reduceMotion,
}: {
  cfg: RockCfg;
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const x = useTransform(nx, (v) => v * cfg.mul);
  const y = useTransform(ny, (v) => v * cfg.mul);
  return (
    <motion.div
      className="absolute"
      style={{
        ...cfg.pos,
        width: cfg.width,
        filter: cfg.blur ? `blur(${cfg.blur}px)` : undefined,
        opacity: cfg.opacity,
        ...(reduceMotion ? {} : { x, y }),
      }}
    >
      <div
        className="cs11-rock-spin"
        style={{ "--rock-spin": cfg.spin, animationDirection: cfg.reverse ? "reverse" : undefined } as React.CSSProperties}
      >
        <div style={{ transform: `rotate(${cfg.rotate}deg)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/rock-nobg.png" alt="" className="w-full h-auto block" />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Per-character display line — rises out of a line clip, char by char ── */
function CharsLine({
  text,
  base,
  outline = false,
  reduceMotion,
}: {
  text: string;
  base: number;
  outline?: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <span className="block overflow-hidden pt-[6px] -mt-[2px]">
      <span className="sr-only">{text}</span>
      <span
        aria-hidden
        className="block font-manrope font-extrabold uppercase tracking-[-0.02em]"
        style={{
          fontSize: "clamp(3.1rem, 8.4vw, 8.5rem)",
          lineHeight: 0.88,
          ...(outline
            ? { color: "transparent", WebkitTextStroke: "1.5px #ff6a3d" }
            : { color: "#ffffff" }),
        }}
      >
        {text.split("").map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block"
            initial={reduceMotion ? false : { y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.95, ease: EASE_OUT, delay: base + i * 0.035 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/* ── Magnetic wrapper — element leans toward the cursor, springs back on leave ── */
function Magnetic({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const x = useSpring(tx, { stiffness: 220, damping: 16, mass: 0.5 });
  const y = useSpring(ty, { stiffness: 220, damping: 16, mass: 0.5 });

  if (disabled) return <div className="w-fit">{children}</div>;

  return (
    <motion.div
      ref={ref}
      className="w-fit"
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        tx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        ty.set((e.clientY - (r.top + r.height / 2)) * 0.35);
      }}
      onMouseLeave={() => {
        tx.set(0);
        ty.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroReveal() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [on, setOn] = useState(false);

  /* Cursor engine — motion values only, so mousemove never re-renders React.
     mx/my: raw targets. s*: spring-smoothed. Local coords drive the mask,
     client coords drive the fixed ring; same spring keeps them aligned. */
  const mxc = useMotionValue(-LENS);
  const myc = useMotionValue(-LENS);
  const mxl = useMotionValue(0);
  const myl = useMotionValue(0);
  const sxc = useSpring(mxc, CURSOR_SPRING);
  const syc = useSpring(myc, CURSOR_SPRING);
  const sxl = useSpring(mxl, CURSOR_SPRING);
  const syl = useSpring(myl, CURSOR_SPRING);

  /* Iris — the reveal hole's radius springs between 0 and LENS/2. */
  const lensR = useMotionValue(0);
  const sr = useSpring(lensR, { stiffness: 210, damping: 26 });
  const srEdge = useTransform(sr, (v) => v + 1.5);
  const holeMask = useMotionTemplate`radial-gradient(circle at ${sxl}px ${syl}px, transparent ${sr}px, black ${srEdge}px)`;

  /* Ring geometry derived from the same iris spring — ring and hole match exactly. */
  const ringSize = useTransform(sr, (v) => v * 2);
  const ringOffset = useTransform(sr, (v) => -v);

  /* Normalised cursor offset (-0.5 → 0.5) for the rock parallax; springs back to 0 on leave. */
  const nxT = useMotionValue(0);
  const nyT = useMotionValue(0);
  const nx = useSpring(nxT, ROCK_SPRING);
  const ny = useSpring(nyT, ROCK_SPRING);

  useEffect(() => {
    lensR.set(on ? LENS / 2 : 0);
  }, [on, lensR]);

  const track = useCallback((cx: number, cy: number) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mxc.set(cx);
    myc.set(cy);
    mxl.set(cx - rect.left);
    myl.set(cy - rect.top);
    nxT.set((cx - rect.left) / rect.width - 0.5);
    nyT.set((cy - rect.top) / rect.height - 0.5);
  }, [mxc, myc, mxl, myl, nxT, nyT]);

  /* Teleport all cursor values on entry so the lens irises open in place
     instead of springing across the viewport from its last position. */
  const jumpCursor = useCallback((cx: number, cy: number) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pairs: Array<[MotionValue<number>, MotionValue<number>, number]> = [
      [mxc, sxc, cx],
      [myc, syc, cy],
      [mxl, sxl, cx - rect.left],
      [myl, syl, cy - rect.top],
    ];
    for (const [src, spring, v] of pairs) {
      src.jump(v);
      spring.jump(v);
    }
  }, [mxc, myc, mxl, myl, sxc, syc, sxl, syl]);

  const resetParallax = useCallback(() => {
    nxT.set(0);
    nyT.set(0);
  }, [nxT, nyT]);

  // Scroll-out choreography: content drifts down and fades while the image
  // plate slowly zooms — the hero recedes instead of just sliding away.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : ({ opacity: 0, y: 14 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100svh] overflow-hidden bg-black select-none cursor-none cs11-grain"
      onMouseMove={(e) => track(e.clientX, e.clientY)}
      onMouseEnter={(e) => {
        jumpCursor(e.clientX, e.clientY);
        track(e.clientX, e.clientY);
        setOn(true);
      }}
      onMouseLeave={() => {
        setOn(false);
        resetParallax();
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (!t) return;
        jumpCursor(t.clientX, t.clientY);
        track(t.clientX, t.clientY);
        setOn(true);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) track(t.clientX, t.clientY);
      }}
      onTouchEnd={() => {
        setOn(false);
        resetParallax();
      }}
      onTouchCancel={() => {
        setOn(false);
        resetParallax();
      }}
    >
      {/* ── Image plate — slow zoom on scroll-out, Ken Burns drift at idle ── */}
      <motion.div className="absolute inset-0" style={reduceMotion ? undefined : { scale: plateScale }}>
        <div className={reduceMotion ? "absolute inset-0" : "absolute inset-0 cs11-drift"}>
          {/* Layer 0: astro2 — merch astronaut (bottom, revealed by the lens) */}
          <AstronautImg src="/images/astro2.webp" />

          {/* Layer 1: astro1 — greyscale, the iris punches through it */}
          <motion.div
            className="absolute inset-0"
            style={{ WebkitMaskImage: holeMask, maskImage: holeMask }}
          >
            <AstronautImg src="/images/astro1.webp" greyscale />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Rock field — cursor parallax + ultra-slow rotation ── */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {ROCKS.map((cfg, i) => (
          <Rock key={i} cfg={cfg} nx={nx} ny={ny} reduceMotion={reduceMotion} />
        ))}
      </div>

      {/* Warm bloom anchoring the headline block */}
      <div
        aria-hidden
        className="hidden md:block absolute -left-[8%] bottom-[4%] w-[44vw] h-[44vw] rounded-full pointer-events-none"
        style={{ zIndex: 2, background: "radial-gradient(circle, rgba(255,106,61,0.09) 0%, transparent 62%)" }}
      />

      {/* Mobile text backdrop — gradient from bottom so text stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/75 to-transparent md:hidden pointer-events-none" />

      {/* ── Custom cursor — the ring IS the iris: same spring, same size ── */}
      <motion.div className="fixed top-0 left-0 z-50 pointer-events-none" style={{ x: sxc, y: syc }}>
        <motion.div
          className="relative rounded-full border border-cs11-orange/70 flex items-center justify-center"
          style={{ width: ringSize, height: ringSize, marginLeft: ringOffset, marginTop: ringOffset }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            aria-hidden
            className="absolute inset-2 rounded-full border border-dashed border-cs11-orange/25 motion-safe:animate-[spin_16s_linear_infinite]"
          />
          <motion.span
            className="font-rajdhani font-semibold text-[9px] text-cs11-orange tracking-[0.3em] uppercase whitespace-nowrap"
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.3, delay: on ? 0.12 : 0 }}
          >
            Reveal
          </motion.span>
        </motion.div>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 flex flex-col min-h-[100svh] justify-end md:justify-between px-6 py-8 md:px-16 md:py-10"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >

        {/* Desktop navbar spacer */}
        <div className="hidden md:block pt-20" />

        {/* Headline block */}
        <div className="w-full md:max-w-[min(620px,48vw)] mb-8 md:mb-0">

          {/* Eyebrow label */}
          <motion.div {...fadeUp(0.35)} className="flex items-center gap-3 mb-5 md:mb-7">
            <span className="block w-6 h-px bg-cs11-orange/60 shrink-0" />
            <span className="font-rajdhani font-semibold text-[10px] text-cs11-orange/75 tracking-[0.45em] uppercase">
              CodeSprint 11 × Cicada
            </span>
          </motion.div>

          {/* Voice line + display wordmark — one h1; display lines rise char by char */}
          <h1>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <motion.span
                initial={reduceMotion ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.45 }}
                className="block font-garamond italic font-normal text-white/90"
                style={{ fontSize: "clamp(1.7rem, 3.8vw, 3.4rem)", lineHeight: 1.05 }}
              >
                The battle
              </motion.span>
            </span>
            <CharsLine text="has a" base={0.56} outline reduceMotion={reduceMotion} />
            <CharsLine text="uniform." base={0.7} reduceMotion={reduceMotion} />
          </h1>

          {/* Descriptor */}
          <motion.p
            {...fadeUp(0.98)}
            className="mt-6 md:mt-8 text-white/45 font-manrope text-xs md:text-sm leading-relaxed max-w-[240px] md:max-w-[300px]"
          >
            One numbered run. When a batch sells out, it stays sold out.
          </motion.p>

          {/* CTAs — the lens yields to real pointers here */}
          <motion.div
            {...fadeUp(1.1)}
            className="mt-7 md:mt-9 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
            onMouseEnter={() => setOn(false)}
            onMouseLeave={() => setOn(true)}
          >
            <Magnetic disabled={!!reduceMotion}>
              <Link
                href="/codesprint/shop"
                className="group cursor-pointer inline-flex items-center justify-center gap-3 bg-cs11-orange text-black font-rajdhani font-semibold uppercase tracking-[0.2em] text-sm px-9 py-4 hover:bg-cs11-gold transition-colors duration-300 w-fit"
              >
                Shop the drop
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => scrollToSection('#product-grid')}
              className="group cursor-pointer inline-flex items-center gap-2 font-rajdhani font-semibold uppercase tracking-[0.2em] text-xs text-white/50 hover:text-white transition-colors duration-300 w-fit"
            >
              See the lineup
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={2} />
            </button>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-end pb-2 md:pb-4">
          <motion.div {...fadeUp(1.22)} className="flex items-center gap-3">
            {/* Descending pulse — reads as "go down" */}
            <span className="relative block w-px h-8 bg-white/10 overflow-hidden" aria-hidden>
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-cs11-orange/80"
                animate={reduceMotion ? undefined : { y: [-14, 34] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <span className="text-white/30 font-rajdhani font-semibold text-[10px] tracking-[0.35em] uppercase">
              Scroll
            </span>
          </motion.div>
          <motion.p
            {...fadeUp(1.32)}
            className="text-white/25 font-rajdhani font-semibold text-[10px] tracking-[0.3em] uppercase"
          >
            <span className="hidden md:inline">Hover to reveal</span>
            <span className="md:hidden">Touch to reveal</span>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
