'use client';

import { useEffect, useState, useRef } from 'react';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_LINES = [
    "INITIALIZING KERNEL...",
    "LOADING NEURAL INTERFACE...",
    "ALLOCATING MEMORY BLOCKS...",
    "DECRYPTING ASSETS...",
    "ESTABLISHING SECURE CONNECTION...",
    "SYSTEM READY."
];

const CODESPRINT_LINES = [
    "LAUNCHING MISSION SEQUENCE...",
    "CALIBRATING ORBITAL SYSTEMS...",
    "SYNCING STAR CHARTS...",
    "ENGAGING HYPERDRIVE...",
    "DEPLOYING PAYLOAD...",
    "T-MINUS ZERO. IGNITION."
];

export default function Preloader() {
    const { isLoading } = useUI();
    const { theme, currentEvent } = useTheme();
    const isCodesprint = currentEvent === 'codesprint';

    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const rafRef = useRef<number | null>(null);

    const terminalLines = isCodesprint ? CODESPRINT_LINES : DEFAULT_LINES;

    useEffect(() => {
        setLines([]);
        setProgress(0);

        let lineIndex = 0;
        const lineInterval = setInterval(() => {
            if (lineIndex < terminalLines.length) {
                setLines(prev => [...prev, terminalLines[lineIndex]]);
                lineIndex++;
            } else {
                clearInterval(lineInterval);
            }
        }, 300);

        const startTime = Date.now();
        const duration = 2000;

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
            clearInterval(lineInterval);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [currentEvent]);

    useEffect(() => {
        if (!isLoading) {
            const timeout = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    const primary = isCodesprint ? '#ff5b41' : theme.colors.primary;
    const bg = isCodesprint ? '#0d1117' : theme.colors.background;
    const headingLabel = isCodesprint ? 'CODESPRINT' : 'IEEE SB';
    const subLabel = isCodesprint ? 'MISSION CONTROL · ONLINE' : 'MERCH STORE';
    const progressLabel = isCodesprint ? 'LAUNCH_SEQUENCE' : 'SYSTEM_BOOT_SEQUENCE';

    return (
        <div
            className={`fixed inset-0 z-[100] font-mono flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out ${!isLoading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundColor: bg, color: theme.colors.text, willChange: 'opacity, transform' }}
        >
            <div className="w-full max-w-md space-y-8">

                {/* Logo / Brand */}
                <div className="flex justify-center mb-12">
                    <div className="relative">

                        <div className="relative text-center">
                            <h1
                                className={`relative text-4xl md:text-5xl tracking-widest text-transparent bg-clip-text ${isCodesprint ? 'font-mortend' : 'font-bebas'}`}
                                style={{
                                    backgroundImage: isCodesprint
                                        ? 'linear-gradient(135deg, #ff5b41, #F2A265)'
                                        : `linear-gradient(to right, #fff, ${primary})`
                                }}
                            >
                                {headingLabel}
                            </h1>
                            <p
                                className={`text-[10px] tracking-[0.25em] uppercase mt-1 ${isCodesprint ? 'font-tommy' : 'font-mono'}`}
                                style={{ color: primary, opacity: 0.6 }}
                            >
                                {subLabel}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div
                        className="flex justify-between text-xs tracking-wider"
                        style={{ color: primary, opacity: 0.8 }}
                    >
                        <span>{progressLabel}</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                background: isCodesprint
                                    ? 'linear-gradient(to right, #ff5b41, #F2A265)'
                                    : primary,
                                boxShadow: `0 0 10px ${primary}`,
                            }}
                        />
                    </div>
                </div>

                {/* Terminal Output */}
                <div
                    className={`h-48 overflow-hidden text-xs md:text-sm space-y-1 p-4 border border-white/5 bg-white/[0.02] rounded-md shadow-inner ${isCodesprint ? 'font-tommy' : 'font-secondary font-bold'}`}
                    style={{ color: primary }}
                >
                    {lines.map((line, i) => (
                        <div key={i} className="animate-fade-in-up">
                            <span className="opacity-50 mr-2">{isCodesprint ? '›' : '>'}</span>
                            {line}
                        </div>
                    ))}
                    <div
                        className="w-2 h-4 animate-pulse inline-block align-middle ml-1"
                        style={{ backgroundColor: primary, opacity: 0.5 }}
                    />
                </div>
            </div>

            {/* Background grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay z-[-1]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </div>
    );
}
