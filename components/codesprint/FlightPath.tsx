'use client';

import { useRef } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/* Scroll-drawn flight plan — a dashed trajectory weaves down through the
   lineup; the solid orange stroke draws along it with scroll progress and a
   rocket rides the tip, descending into the LaunchScene. Sits between the
   section backgrounds (below) and their z-10 content (above), so the line
   threads behind products and type. */

const TRAJECTORY =
    'M 80 0 ' +
    'C 420 120, 820 260, 860 560 ' +
    'C 890 800, 640 880, 480 980 ' +
    'C 280 1105, 130 1180, 120 1400 ' +
    'C 110 1640, 320 1700, 520 1780 ' +
    'C 760 1875, 880 1980, 870 2200 ' +
    'C 860 2420, 600 2560, 540 2760 ' +
    'C 515 2845, 520 2920, 525 3000';

export default function FlightPath() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const rocketRef = useRef<HTMLDivElement>(null);
    const totalLen = useRef(0);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: wrapRef,
        offset: ['start 0.7', 'end 1.1'],
    });
    const pathLength = useTransform(scrollYProgress, [0, 1], [0.015, 1]);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        if (reduceMotion) return;
        const path = pathRef.current;
        const rocket = rocketRef.current;
        const wrap = wrapRef.current;
        if (!path || !rocket || !wrap) return;
        if (!totalLen.current) totalLen.current = path.getTotalLength();
        const len = totalLen.current;
        const d = Math.min(Math.max(v, 0.015), 1) * len;
        const ctm = path.getScreenCTM();
        if (!ctm) return;
        // Two nearby points -> position + heading, in real screen pixels so
        // the rocket never distorts with the stretched SVG.
        const a = path.getPointAtLength(Math.max(0, d - 2)).matrixTransform(ctm);
        const b = path.getPointAtLength(d).matrixTransform(ctm);
        const rect = wrap.getBoundingClientRect();
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        rocket.style.transform = `translate(${b.x - rect.left - 16}px, ${b.y - rect.top - 16}px) rotate(${angle + 90}deg)`;
        rocket.style.opacity = v > 0.015 && v < 1 ? '1' : '0';
    });

    return (
        <div ref={wrapRef} aria-hidden className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 3000"
                preserveAspectRatio="none"
                fill="none"
                className="absolute inset-0"
            >
                {/* The planned route — faint dashed guide */}
                <path
                    d={TRAJECTORY}
                    stroke="rgba(255,106,61,0.22)"
                    strokeWidth="1.5"
                    strokeDasharray="3 12"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
                {/* The flown route — draws with scroll. No non-scaling-stroke here:
                    it moves dash math into screen space and breaks pathLength. */}
                <motion.path
                    ref={pathRef}
                    d={TRAJECTORY}
                    stroke="#ff6a3d"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={reduceMotion ? undefined : { pathLength }}
                    opacity={reduceMotion ? 0 : 0.85}
                />
            </svg>

            {/* The rocket at the head of the flown route */}
            {!reduceMotion && (
                <div ref={rocketRef} className="absolute left-0 top-0 w-8 h-8 opacity-0 will-change-transform">
                    <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,106,61,0.7)]">
                        {/* body */}
                        <path
                            d="M12 1.5 C14.2 4 15.2 7 15.2 10.2 L15.2 14.5 L8.8 14.5 L8.8 10.2 C8.8 7 9.8 4 12 1.5 Z"
                            fill="#ff6a3d"
                        />
                        {/* fins */}
                        <path d="M8.8 11.5 L5.8 15.5 L8.8 15 Z" fill="#ffc371" />
                        <path d="M15.2 11.5 L18.2 15.5 L15.2 15 Z" fill="#ffc371" />
                        {/* window */}
                        <circle cx="12" cy="8.5" r="1.7" fill="#000" stroke="#fff" strokeWidth="0.8" />
                        {/* exhaust */}
                        <path d="M10.4 15 L12 19.5 L13.6 15 Z" fill="#ffc371" opacity="0.9" />
                    </svg>
                </div>
            )}
        </div>
    );
}
