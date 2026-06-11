import Image from 'next/image';

// CodeSprint 11 footer — dark, matching codesprint.lk (black, orange #ff6a3d, Garamond/Manrope/Rajdhani).
export default function Footer() {
    return (
        <footer className="relative w-full bg-cs11-bg border-t border-white/[0.06] overflow-hidden">
            {/* Orange glow blob */}
            <div
                className="absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(circle, #ff6a3d 0%, transparent 70%)' }}
            />
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <h2 className="leading-[0.95] tracking-tight">
                        <span className="block font-garamond italic text-white text-4xl md:text-6xl font-normal">
                            Built for
                        </span>
                        <span className="block font-manrope font-extrabold uppercase text-3xl md:text-5xl mt-1 text-cs11-orange">
                            innovation.
                        </span>
                    </h2>
                    <p className="font-manrope text-base text-white/50 max-w-md leading-relaxed">
                        CodeSprint merch is designed, sampled, and shipped by the IEEE Student Branch of IIT.
                        For the builders, by the builders.
                    </p>
                </div>

                <div className="mt-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-white/[0.08] pt-8">
                    <div className="font-rajdhani text-xs uppercase tracking-widest text-white/40">
                        CodeSprint 11 × IEEE SB © 2026 — All Rights Reserved
                    </div>
                    <div className="relative w-48 h-10 opacity-60 invert">
                        <Image src="/images/barcode.png" alt="Barcode" fill sizes="192px" className="object-contain object-right" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
