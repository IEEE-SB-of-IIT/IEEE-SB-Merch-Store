'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
    interface Window {
        __lenis?: Lenis;
    }
}

/** Page-wide inertial scrolling. Mounts on the storefront only; respects reduced motion. */
export default function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo out
        });
        window.__lenis = lenis;

        let raf = requestAnimationFrame(function loop(time) {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
        });

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);

    return null;
}

/** Scroll helper that uses Lenis when active, native smooth scroll otherwise. */
export function scrollToSection(selector: string) {
    if (typeof window === 'undefined') return;
    if (window.__lenis) {
        window.__lenis.scrollTo(selector, { offset: -24 });
    } else {
        document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }
}
