'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useUI } from '../context/UIContext';

/**
 * CS11 Preloader — minimal brand identity loader.
 *
 * Black void · collab lockup centred · % counter top-right ·
 * hairline wipe bar at bottom · curtain-slide exit upward.
 *
 * No product imagery. No fake status. Just the mark.
 * CSS lives in globals.css (pl-* classes).
 */
export default function Preloader() {
    const { isLoading } = useUI();
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(isLoading);
    const [mounted, setMounted] = useState(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        // tiny delay so the initial paint settles before animating
        const tMount = setTimeout(() => setMounted(true), 40);

        const startTime = Date.now();
        const duration = 900;
        const frame = () => {
            const p = Math.min(100, ((Date.now() - startTime) / duration) * 100);
            setCount(Math.floor(p));
            if (p < 100) rafRef.current = requestAnimationFrame(frame);
        };
        rafRef.current = requestAnimationFrame(frame);

        return () => {
            clearTimeout(tMount);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Unmount after curtain-slide finishes (550 ms)
    useEffect(() => {
        if (!isLoading) {
            const t = setTimeout(() => setIsVisible(false), 580);
            return () => clearTimeout(t);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className="pl-root"
            data-out={!isLoading ? 'true' : 'false'}
            aria-hidden="true"
        >
            {/* ── Collab lockup — dead centre ── */}
            <div className="pl-centre" data-in={mounted ? 'true' : 'false'}>
                <Image
                    src="/images/logo merch v2 - white n orange.webp"
                    alt="CodeSprint 11 × Cicada"
                    width={3840}
                    height={389}
                    className="pl-logo"
                    priority
                />
                <p className="pl-sub">Official Drop · IEEE SB IIT</p>
            </div>

            {/* ── Counter — top right ── */}
            <span className="pl-counter" data-in={mounted ? 'true' : 'false'}>
                {String(count).padStart(2, '0')}
            </span>

            {/* ── Hairline progress bar — bottom ── */}
            <div
                className="pl-bar-track"
                role="progressbar"
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className="pl-bar-fill" style={{ transform: `scaleX(${count / 100})` }} />
            </div>
        </div>
    );
}
