'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export default function ScrollReveal({
    children,
    width = "100%",
    delay = 0,
    direction = "up"
}: ScrollRevealProps) {

    // Direction variants
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 75 : direction === 'down' ? -75 : 0,
            x: direction === 'left' ? 75 : direction === 'right' ? -75 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.8,
                delay: delay,
                ease: [0.25, 0.4, 0.25, 1] as const, // Smooth ease-out curve
            }
        }
    };

    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
