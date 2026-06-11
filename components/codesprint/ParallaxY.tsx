'use client';

import { ReactNode, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxYProps {
    children: ReactNode;
    /** Vertical drift across the element's journey through the viewport, e.g. ['8%', '-8%']. */
    range?: [string, string];
    className?: string;
}

/** Drifts children vertically as they cross the viewport. Transform-only; inert under reduced motion. */
export default function ParallaxY({ children, range = ['8%', '-8%'], className }: ParallaxYProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], range);

    return (
        <motion.div ref={ref} style={reduceMotion ? undefined : { y }} className={className}>
            {children}
        </motion.div>
    );
}
