import Image from 'next/image';

interface FooterProps {
    theme?: 'default' | 'codesprint' | 'ix';
}

export default function Footer({ theme = 'default' }: FooterProps) {
    const bgColor = theme === 'codesprint' ? 'bg-[#602000]' : theme === 'ix' ? 'bg-[#450a25]' : 'bg-arctic-dark';

    return (
        <section className={`relative w-full h-[600px] md:h-[800px] ${bgColor} py-24 px-6 overflow-hidden flex items-end`}>
            {/* Graffiti Background */}
            <Image
                src={theme === 'codesprint' ? '/images/Codesprint_footer.png' : theme === 'ix' ? '/images/IX_footer.png' : '/images/graffiti.png'}
                alt="Graffiti Background"
                fill
                className="object-cover opacity-60 mix-blend-overlay"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'codesprint' ? 'from-[#602000]' : theme === 'ix' ? 'from-[#450a25]' : 'from-arctic-base'} via-transparent to-transparent opacity-90`} />

            <div className="relative z-10 w-full max-w-[1400px] mx-auto text-white">
                <div className="md:w-1/2 space-y-4">
                    <div className="flex gap-4 text-[10px] tracking-widest uppercase opacity-60">
                        <span>[ PROTOCOL: ALTITUDE ]</span>
                        <span>[ SPEC-01 ]</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black leading-[0.85]  uppercase">
                        Built for Innovation<br />
                        Designed for Impactight<br />
                        Forged to Last
                    </h2>
                    <p className="text-xs md:text-sm text-white/60 max-w-md pt-4 leading-relaxed uppercase tracking-wider">
                        TORN was born in the mountains. Not as a trend, but as a response. For those who climb, not for the crowd.
                    </p>
                </div>

                <div className="mt-24 flex justify-between items-end border-t border-white/10 pt-8 opacity-40 text-[10px] uppercase tracking-widest">
                    <div>IEEE SB Merch Store © 2026</div>
                    <div className="text-right flex flex-col items-end gap-2">
                        {/* Barcode Simulation */}
                        {/* Barcode Image */}
                        <div className="relative w-64 h-12 mb-4 opacity-80">
                            <Image
                                src="/images/barcode.png"
                                alt="Barcode"
                                fill
                                className="object-contain object-right"
                            />
                        </div>
                        <div>Rights Reserved<br />Designed by IEEE Student Branch of IIT</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
