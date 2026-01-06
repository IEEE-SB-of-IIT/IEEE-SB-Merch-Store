import Image from 'next/image';

export default function GraffitiFooter() {
    return (
        <section className="relative w-full h-[600px] md:h-[800px] bg-arctic-dark py-24 px-6 overflow-hidden flex items-end">
            {/* Graffiti Background */}
            <Image
                src="/images/graffiti.png"
                alt="Graffiti Background"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-arctic-base via-transparent to-transparent opacity-90" />

            <div className="relative z-10 w-full max-w-[1400px] mx-auto text-white">
                <div className="md:w-1/2 space-y-4">
                    <div className="flex gap-4 text-[10px] tracking-widest uppercase opacity-60">
                        <span>[ PROTOCOL: ALTITUDE ]</span>
                        <span>[ SPEC-01 ]</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase">
                        Built for Cold<br />
                        Made for Height<br />
                        Forged to Last
                    </h2>
                    <p className="text-xs md:text-sm text-white/60 max-w-md pt-4 leading-relaxed uppercase tracking-wider">
                        TORN was born in the mountains. Not as a trend, but as a response. For those who climb, not for the crowd.
                    </p>
                </div>

                <div className="mt-24 flex justify-between items-end border-t border-white/10 pt-8 opacity-40 text-[10px] uppercase tracking-widest">
                    <div>IEEE SB Merch Store © 2026</div>
                    <div className="text-right">Rights Reserved<br />Designed by Agent</div>
                </div>
            </div>
        </section>
    )
}
