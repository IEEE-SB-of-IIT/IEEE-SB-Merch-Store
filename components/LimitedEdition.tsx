"use client";
import React from 'react';

const LimitedEdition = () => {
    return (
        <section className="relative w-full h-[600px] bg-theme-secondary my-24 overflow-hidden flex items-center transition-colors duration-500">
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[12rem] md:text-[20rem] font-bold text-theme-bg opacity-5 whitespace-nowrap">2023</span>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-12 h-full">

                {/* Left Tag */}
                <div className="hidden md:flex flex-col justify-end pb-20 col-span-2">
                    <div className="bg-theme-bg/20 backdrop-blur-md p-6 w-16 h-96 rounded-full flex flex-col items-center justify-between border border-theme-text/10">
                        <span className="text-theme-bg -rotate-90 whitespace-nowrap font-bold tracking-widest text-lg mt-24">Fall Winter 2023</span>
                    </div>
                </div>

                {/* Vertical Title */}
                <div className="col-span-12 md:col-span-4 flex items-center z-10">
                    <div className="bg-theme-bg py-12 px-8 flex items-center h-[120%] -rotate-2 md:rotate-0 shadow-2xl transition-colors duration-500">
                        <h2 className="text-5xl md:text-7xl font-black text-theme-text -rotate-90 md:rotate-[-90deg] whitespace-nowrap leading-none tracking-tighter origin-center">
                            Limited Edition
                        </h2>
                    </div>
                </div>

                {/* Image Area */}
                <div className="col-span-12 md:col-span-6 relative h-full flex items-end justify-center">
                    {/* Model image placeholder */}
                    <div className="w-[400px] h-[500px] bg-theme-primary/20 backdrop-blur-sm rounded-t-full relative">
                        {/* Img would go here */}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default LimitedEdition;
