const LINE = ['CodeSprint 11', 'Limited drop', 'Built for builders', 'IEEE SB IIT'];

/* One marquee group; the track renders it twice for a seamless loop. */
function MarqueeGroup({ className }: { className?: string }) {
    return (
        <div aria-hidden className={`flex items-center shrink-0 ${className ?? ''}`}>
            {LINE.map((item) => (
                <span key={item} className="flex items-center">
                    <span className="px-6 md:px-10 whitespace-nowrap">{item}</span>
                    <span className="text-[0.6em] -translate-y-[0.05em]">✦</span>
                </span>
            ))}
        </div>
    );
}

/* Ranboo-style section divider: a tilted solid-orange band with a counter-running outline echo behind it. */
export default function DropMarquee() {
    return (
        <section aria-label="CodeSprint 11, limited drop, built for builders" className="relative bg-cs11-bg py-16 md:py-24 overflow-hidden">
            {/* Outline echo, running the other way */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[1.5deg] scale-x-105 opacity-70 pointer-events-none">
                <div
                    className="cs11-marquee-track is-reverse font-manrope font-extrabold uppercase text-4xl md:text-6xl cs11-outline"
                    style={{ '--marquee-duration': '46s' } as React.CSSProperties}
                >
                    <MarqueeGroup />
                    <MarqueeGroup />
                </div>
            </div>

            {/* Solid orange band */}
            <div className="relative -rotate-[1.5deg] scale-x-105 bg-cs11-orange py-4 md:py-5 shadow-[0_20px_80px_rgba(255,106,61,0.25)]">
                <div
                    className="cs11-marquee-track font-manrope font-extrabold uppercase text-black text-2xl md:text-4xl"
                    style={{ '--marquee-duration': '32s' } as React.CSSProperties}
                >
                    <MarqueeGroup />
                    <MarqueeGroup />
                </div>
            </div>
        </section>
    );
}
