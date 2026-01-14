'use client';

import { useEffect, useState } from 'react';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';

const TERMINAL_LINES = [
    "INITIALIZING KERNEL...",
    "LOADING NEURAL INTERFACE...",
    "ALLOCATING MEMORY BLOCKS...",
    "DECRYPTING ASSETS...",
    "ESTABLISHING SECURE CONNECTION...",
    "SYSTEM READY."
];

export default function Preloader() {
    const { isLoading } = useUI();
    const { theme } = useTheme();
    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    // Initial load sequence
    useEffect(() => {
        // Line typewriting effect
        let lineIndex = 0;
        const lineInterval = setInterval(() => {
            if (lineIndex < TERMINAL_LINES.length) {
                setLines(prev => [...prev, TERMINAL_LINES[lineIndex]]);
                lineIndex++;
            } else {
                clearInterval(lineInterval);
            }
        }, 300);

        // Progress bar simulation
        const startTime = Date.now();
        const duration = 2000; // slightly less than the 2.2s total

        const progressFrame = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const p = Math.min(100, (elapsed / duration) * 100);

            setProgress(p);

            if (p < 100) {
                requestAnimationFrame(progressFrame);
            }
        };
        requestAnimationFrame(progressFrame);

        return () => clearInterval(lineInterval);
    }, []);

    // Handle exit
    useEffect(() => {
        if (!isLoading) {
            // Wait a brief moment for "SYSTEM READY" to register visually
            setTimeout(() => {
                setIsVisible(false);
            }, 200);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] font-mono flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out ${!isLoading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}
            style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text
            }}
        >
            <div className="w-full max-w-md space-y-8">
                {/* Logo / Brand */}
                <div className="flex justify-center mb-12">
                    <div className="relative">
                        <div
                            className="absolute inset-0 blur-xl rounded-full animate-pulse opacity-50"
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                        <h1
                            className="relative text-4xl md:text-5xl font-bebas tracking-widest text-transparent bg-clip-text"
                            style={{
                                backgroundImage: `linear-gradient(to right, #fff, ${theme.colors.primary})`
                            }}
                        >
                            IEEE SB
                        </h1>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs tracking-wider" style={{ color: theme.colors.primary, opacity: 0.8 }}>
                        <span>SYSTEM_BOOT_SEQUENCE</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full shadow-[0_0_10px_currentColor] transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.primary
                            }}
                        />
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="h-48 overflow-hidden font-secondary text-xs md:text-sm space-y-1 p-4 border border-white/5 bg-white/[0.02] rounded-md font-bold shadow-inner" style={{ color: theme.colors.primary }}>
                    {lines.map((line, i) => (
                        <div key={i} className="animate-fade-in-up">
                            <span className="opacity-50 mr-2">{`>`}</span>
                            {line}
                        </div>
                    ))}
                    <div className="w-2 h-4 animate-pulse inline-block align-middle ml-1" style={{ backgroundColor: theme.colors.primary, opacity: 0.5 }} />
                </div>
            </div>

            {/* Background noise/grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay z-[-1]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
