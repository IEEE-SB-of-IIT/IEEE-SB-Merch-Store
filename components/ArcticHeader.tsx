'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu } from 'lucide-react';

export default function ArcticHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${isScrolled
                ? 'py-4 bg-arctic-dark/60 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
                : 'py-8 bg-transparent border-transparent'
                }`}
        >
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between relative">

                {/* Left Brand - Logo */}
                <Link href="/" className="relative w-48 h-12 md:w-64 md:h-16 flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity">
                    <Image
                        src="/images/IEEE logo.png"
                        alt="IEEE SB Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </Link>

                {/* Center Nav */}
                <div className="hidden md:flex items-center gap-12 lg:gap-16 absolute left-1/2 -translate-x-1/2">
                    {[
                        { name: 'HOME', path: '/' },
                        { name: 'CODESPRINT', path: '/codesprint' },
                        { name: 'IX 26', path: '/ix' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="relative group text-lg md:text-xl font-bebas tracking-wider text-white overflow-hidden"
                        >
                            <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                                {item.name}
                            </span>
                            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 text-black group-hover:translate-y-0">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6 md:gap-8 text-white">
                    <button className="hover:text-black transition-colors">
                        <Search className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    </button>
                    <button className="relative hover:text-black transition-colors group">
                        <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arctic-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-arctic-cyan"></span>
                        </span>
                    </button>
                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden hover:text-black transition-colors">
                        <Menu className="w-7 h-7" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
