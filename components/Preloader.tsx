'use client';

import { useEffect, useState, useRef } from 'react';
import { useUI } from '../context/UIContext';

const TERMINAL_LINES = [
    "LAUNCHING MISSION SEQUENCE...",
    "CALIBRATING ORBITAL SYSTEMS...",
    "SYNCING STAR CHARTS...",
    "ENGAGING HYPERDRIVE...",
    "DEPLOYING PAYLOAD...",
    "T-MINUS ZERO. IGNITION."
];

// CS11 palette — matches codesprint.lk
const PRIMARY = '#ff6a3d';
const GOLD = '#ffc371';
const BG = '#000000';

export default function Preloader() {
    const { isLoading } = useUI();

    const [lines, setLines] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        setLines([]);
        setProgress(0);

        let lineIndex = 0;
        const lineInterval = setInterval(() => {
            if (lineIndex < TERMINAL_LINES.length) {
                setLines(prev => [...prev, TERMINAL_LINES[lineIndex]]);
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
            className={`fixed inset-0 z-[100] font-mono flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out ${!isLoading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}
            style={{ backgroundColor: BG, color: '#ffffff', willChange: 'opacity, transform' }}
        >
            <div className="w-full max-w-md space-y-8">

                {/* Logo / Brand */}
                <div className="flex justify-center mb-12">
                    <div className="relative">

                        <div className="relative text-center">
                            <h1
                                className="relative text-4xl md:text-5xl tracking-widest text-transparent bg-clip-text font-manrope font-extrabold uppercase"
                                style={{ backgroundImage: `linear-gradient(135deg, ${PRIMARY}, ${GOLD})` }}
                            >
                                CODESPRINT
                            </h1>
                            <p
                                className="text-[10px] tracking-[0.25em] uppercase mt-1 font-rajdhani"
                                style={{ color: PRIMARY, opacity: 0.6 }}
                            >
                                MISSION CONTROL · ONLINE
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div
                        className="flex justify-between text-xs tracking-wider"
                        style={{ color: PRIMARY, opacity: 0.8 }}
                    >
                        <span>LAUNCH_SEQUENCE</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                background: `linear-gradient(to right, ${PRIMARY}, ${GOLD})`,
                                boxShadow: `0 0 10px ${PRIMARY}`,
                            }}
                        />
                    </div>
                </div>

                {/* Terminal Output */}
                <div
                    className="h-48 overflow-hidden text-xs md:text-sm space-y-1 p-4 border border-white/5 bg-white/[0.02] rounded-md shadow-inner font-rajdhani"
                    style={{ color: PRIMARY }}
                >
                    {lines.map((line, i) => (
                        <div key={i} className="animate-fade-in-up">
                            <span className="opacity-50 mr-2">›</span>
                            {line}
                        </div>
                    ))}
                    <div
                        className="w-2 h-4 animate-pulse inline-block align-middle ml-1"
                        style={{ backgroundColor: PRIMARY, opacity: 0.5 }}
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
