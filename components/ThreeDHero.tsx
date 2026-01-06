"use client";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShoppingBag, PlayCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { HeroItem } from "../types";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Data Handling
const HERO_DATA_GENERAL: HeroItem[] = [
    {
        id: "hoodies",
        subtitle: "Streetwear Clothing Cyberpunk",
        title: "Hoodie",
        desc: "Introducing our innovative Double Layered Zipper Mask Hoodie - the epitome of functionality and style. Crafted from a robust blend of heavy-duty cotton.",
        image: "/models/placeholder-model.png",
        specs: ["Double-Layered Design", "Secure Kangaroo Pockets", "Techwear Functionality"],
        color: "Teal"
    },
    {
        id: "tees",
        subtitle: "Summer Collection 2024",
        title: "Tees",
        desc: "Lightweight, breathable, and designed for the urban heat. Our graphic tees feature bold prints and a relaxed oversized fit.",
        image: "/models/placeholder-durability.png",
        specs: ["100% Organic Cotton", "Oversized Fit", "Screen Printed Graphics"],
        color: "Black"
    },
    {
        id: "accessories",
        subtitle: "Essential Gear",
        title: "Accessories",
        desc: "Complete your look with our range of tactical bags, caps, and utility belts. Functionality meets aesthetic.",
        image: "/models/placeholder-model.png",
        specs: ["Water Resistant", "Modular Attachments", "Heavy Duty Zippers"],
        color: "Grey"
    }
];

const HERO_DATA_CODESPRINT: HeroItem[] = [
    {
        id: "cs-main",
        subtitle: "Annual Programming Competition",
        title: "Codesprint",
        desc: "A New Dawn Approaches. Prepare for ignition. Join the most prestigious coding battle of the year. Equip yourself with limited edition merch.",
        image: "/models/placeholder-codesprint.png",
        specs: ["Hacker Rank", "Global Leaderboard", "24h Marathon"],
        color: "Red"
    },
    {
        id: "cs-merch",
        subtitle: "Official Gear",
        title: "Space Merch",
        desc: "Wear the void. Our Codesprint collection features deep space aesthetics and high-contrast red accents.",
        image: "/models/placeholder-model.png",
        specs: ["NASA Grade Fabric", "Glow in Dark", "Limited Run"],
        color: "Black"
    }
];

const HERO_DATA_IX: HeroItem[] = [
    {
        id: "ix-main",
        subtitle: "Designathon 2024",
        title: "IX Design",
        desc: "Bigger, Smarter, Wilder. 36 Hours of non-stop creativity. Grab the neon-infused collection now.",
        image: "/models/placeholder-ix.png",
        specs: ["36h Non-stop", "UX/UI Battle", "Neon Aesthetics"],
        color: "Pink"
    },
    {
        id: "ix-merch",
        subtitle: "Cyber Collection",
        title: "Neon Hoodies",
        desc: "Stand out in the dark. High visibility neon prints on jet black fabric.",
        image: "/models/placeholder-model.png",
        specs: ["Reflective Print", "Cyberpunk Fit", "Waterproof"],
        color: "Cyan"
    }
];

const ThreeDHero: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { currentEvent } = useTheme();

    // Determine which data to use based on key
    const currentHeroData: HeroItem[] = currentEvent === 'codesprint'
        ? HERO_DATA_CODESPRINT
        : currentEvent === 'ix'
            ? HERO_DATA_IX
            : HERO_DATA_GENERAL;

    // Reset index when event changes to avoid out-of-bounds
    useEffect(() => {
        setActiveIndex(0);
    }, [currentEvent]);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3000",
                scrub: true,
                pin: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const length = currentHeroData.length;
                    // Ensure smooth transition between indices
                    const rawIndex = progress * (length - 0.01);
                    const newIndex = Math.min(Math.floor(rawIndex), length - 1);

                    setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
                },
            },
        });
        tl.to({}, { duration: 1 });
    }, { scope: containerRef, dependencies: [currentHeroData] });

    const activeContent: HeroItem = currentHeroData[activeIndex] || currentHeroData[0];

    return (
        <section ref={containerRef} className="relative w-full h-screen bg-theme-bg overflow-hidden flex transition-colors duration-500">
            {/* Background Light Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-theme-primary opacity-20 rounded-full blur-[120px] mix-blend-screen animate-pulse contrast-150"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-theme-primary opacity-10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-75"></div>
            </div>

            {/* Left Sidebar Menu - Interactive */}
            <div className="hidden md:flex flex-col justify-center gap-12 pl-12 w-32 border-r border-theme-accent z-10 h-full">
                <h2 className="text-2xl font-bold text-theme-text mb-8">
                    {currentEvent === 'general' ? 'Shop' : 'Event'}
                </h2>
                <div className="flex flex-col gap-6 text-sm font-medium">
                    {currentHeroData.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                alert("Scroll to see more!");
                            }}
                            className={`text-left transition-colors ${index === activeIndex ? "text-theme-primary font-bold scale-110 origin-left" : "text-theme-secondary hover:text-theme-text"}`}
                        >
                            {currentHeroData.length > 2 ? item.title : item.subtitle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative grid grid-cols-1 lg:grid-cols-12 h-screen">

                {/* Center Left: Info */}
                <div className="lg:col-span-5 flex flex-col justify-center px-12 z-20 pointer-events-none">
                    <div className="pointer-events-auto transition-opacity duration-500 key={currentEvent + activeIndex}">
                        <span className="text-theme-secondary text-sm tracking-widest uppercase mb-2 block animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeContent.subtitle}
                        </span>
                        <h1 className="text-7xl md:text-8xl font-black text-theme-text tracking-tighter leading-none mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            {activeContent.title}
                        </h1>

                        <p className="text-theme-secondary text-sm leading-relaxed max-w-sm mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            {activeContent.desc}
                        </p>

                        {/* Selectors */}
                        <div className="flex gap-6 mb-8 border-b border-theme-accent pb-8 w-max animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <div className="flex flex-col">
                                <label className="text-xs text-theme-secondary mb-1">Qty</label>
                                <select className="bg-transparent text-theme-text font-bold text-sm focus:outline-none"><option>1</option></select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-theme-secondary mb-1">Size</label>
                                <select className="bg-transparent text-theme-text font-bold text-sm focus:outline-none"><option>M</option></select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-theme-secondary mb-1">Color</label>
                                <select className="bg-transparent text-theme-text font-bold text-sm focus:outline-none"><option>{activeContent.color}</option></select>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                            <button className="bg-theme-text text-theme-bg px-8 py-4 rounded-lg flex items-center gap-2 hover:opacity-80 transition-opacity">
                                <ShoppingBag className="w-4 h-4" />
                                {currentEvent === 'general' ? 'Add To Cart' : 'Register Now'}
                            </button>
                            <button className="border border-theme-secondary text-theme-text px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-theme-accent transition-colors">
                                <PlayCircle className="w-4 h-4" /> Watch Intro
                            </button>
                        </div>

                        {/* Bottom Info Specs */}
                        <div className="flex gap-4 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                            {activeContent.specs.map((item, i) => (
                                <div key={i} className="border border-theme-accent rounded p-2 w-24 h-32 flex items-end">
                                    <span className="text-[10px] font-bold text-theme-secondary -rotate-90 origin-bottom-left translate-x-3 mb-1 whitespace-nowrap">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center Right: Static Image - Swapping */}
                <div className="lg:col-span-6 h-full relative z-10 flex items-center justify-center">
                    <div className="w-[80%] h-[80%] relative transition-all duration-700 ease-out transform key={currentEvent + activeIndex} animate-in fade-in zoom-in-95">
                        <img
                            src={activeContent.image}
                            alt={activeContent.title}
                            className="w-full h-full object-contain drop-shadow-2xl"
                            onError={(e) => {
                                // Fallback
                                const target = e.target as HTMLImageElement;
                                if (activeContent.image !== "/models/placeholder-model.png") {
                                    target.src = "/models/placeholder-model.png";
                                } else {
                                    target.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Far Right: Indicators */}
                <div className="lg:col-span-1 hidden lg:flex flex-col justify-center items-center gap-8 pr-8 z-10">
                    {currentHeroData.map((_, i) => (
                        <span key={i} className={`text-sm font-bold transition-all duration-300 ${i === activeIndex ? "text-theme-primary scale-150" : "text-theme-secondary"}`}>
                            {`0${i + 1}`}
                        </span>
                    ))}
                </div>

            </div>

            {/* Floating Navigation Controls */}
            <div className="absolute bottom-8 right-12 bg-theme-text text-theme-bg p-6 rounded-xl flex gap-8 z-30 opacity-80 hover:opacity-100 transition-opacity">
                <span className="cursor-pointer hover:opacity-60">❮</span>
                <span className="cursor-pointer hover:opacity-60">❯</span>
            </div>

        </section>
    );
};

export default ThreeDHero;
