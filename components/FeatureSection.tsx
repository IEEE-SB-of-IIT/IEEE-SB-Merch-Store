"use client";
import React from 'react';

const FeatureSection = () => {
    return (
        <section className="py-24 px-6 md:px-12 w-full max-w-7xl mx-auto space-y-40 transition-colors duration-500">

            {/* Feature 1: Streetwear - Text Left, Image Right (Arch) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">
                <div className="order-2 md:order-1 relative z-10">
                    {/* Background Watermark */}
                    <h2 className="absolute -top-32 -left-20 text-[10rem] md:text-[14rem] font-bold text-theme-secondary opacity-10 -z-10 select-none pointer-events-none leading-none">
                        Hoodie
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-black text-theme-text mb-8 relative z-10">
                        Streetwear
                    </h3>
                    <p className="text-theme-secondary text-sm md:text-base max-w-md leading-relaxed mb-6">
                        Experience the perfect blend of style and comfort. Our streetwear collection is
                        crafted for those who dare to stand out. Premium fabrics meeting urban design.
                    </p>
                </div>

                <div className="order-1 md:order-2 flex justify-center relative">
                    {/* Arch Shape Container */}
                    <div className="w-[400px] h-[500px] bg-theme-accent rounded-t-full relative overflow-hidden flex items-end justify-center shadow-2xl">
                        {/* Placeholder for Model Image */}
                        <div className="w-[90%] h-[90%] bg-theme-bg rounded-t-full relative overflow-hidden">
                            {/* Simulate image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                            <img
                                src="/models/placeholder-model.png"
                                alt="Streetwear Model"
                                className="w-full h-full object-cover object-top"
                                // Fallback if image missing
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature 2: Durability - Image Left (Circle), Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="flex justify-center relative">
                    {/* Circle Shape Container */}
                    <div className="w-[450px] h-[450px] bg-theme-accent rounded-full relative overflow-hidden flex items-center justify-center shadow-2xl z-10">
                        <img
                            src="/models/placeholder-durability.png"
                            alt="Durability Model"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {/* Circle overlay ring/cutout effect */}
                        <div className="absolute inset-0 border-[20px] border-theme-bg rounded-full pointer-events-none transition-colors duration-500"></div>
                    </div>

                    {/* Decorative Circle behind */}
                    <div className="absolute top-10 -left-10 w-24 h-24 bg-theme-primary opacity-20 rounded-full blur-xl -z-10"></div>
                </div>

                <div className="relative z-10 pl-8">
                    <h3 className="text-4xl md:text-5xl font-black text-theme-text mb-8">
                        Durability
                    </h3>
                    <p className="text-theme-secondary text-sm md:text-base max-w-md leading-relaxed mb-8">
                        Built to last. Every stitch is reinforced, every fabric tested.
                        We guarantee quality that withstands the test of time and weather.
                    </p>

                    {/* "Cool" decorative line */}
                    <div className="w-24 h-1 bg-theme-text mb-4"></div>
                </div>
            </div>

        </section>
    );
};

export default FeatureSection;
