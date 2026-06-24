'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useUI } from '../context/UIContext';

/* CS11 preloader — the wordmark over the void with a single hairline progress
   bar. Quiet and fast; no fake telemetry. */
export default function Preloader() {
    const { isLoading } = useUI();

    const [progress, setProgress] = useState(0);
    // Initialize from isLoading so remounts (client-side navigation back to
    // the storefront) don't flash the overlay after the intro already ran.
    const [isVisible, setIsVisible] = useState(isLoading);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const startTime = Date.now();
        const duration = 950;

        const progressFrame = () => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(100, (elapsed / duration) * 100);
            setProgress(p);
            if (p < 100) {
                rafRef.current = requestAnimationFrame(progressFrame);
            }
        };
        rafRef.current = requestAnimationFrame(progressFrame);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const timeout = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-6 transition-opacity duration-700 ease-out ${!isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{ willChange: 'opacity' }}
        >
            <Image
                src="/images/logo merch v2 - white n orange.webp"
                alt="CodeSprint × Cicada"
                width={3840}
                height={389}
                className="h-10 md:h-14 w-auto select-none"
                priority
            />

            <div className="mt-8 w-48 md:w-64 h-px bg-white/15 overflow-hidden" role="progressbar" aria-valuenow={Math.floor(progress)} aria-valuemin={0} aria-valuemax={100}>
                <div
                    className="h-full bg-cs11-orange"
                    style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
                />
            </div>

            <p className="mt-5 font-rajdhani font-semibold uppercase tracking-[0.3em] text-[10px] text-white/40">
                CodeSprint × Cicada · IEEE SB IIT
            </p>
        </div>
    );
}
