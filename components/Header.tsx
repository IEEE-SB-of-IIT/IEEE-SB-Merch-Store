'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

const NAV_LINKS = [
    { name: 'HOME', path: '/codesprint' },
    { name: 'SHOP', path: '/codesprint#product-grid' }
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { openSearch } = useUI();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 60);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* ── Nav bar ── */}
            <div
                className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isScrolled
                        ? 'top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl px-0'
                        : 'top-0 left-0 w-full px-0'
                }`}
                style={{ willChange: 'top, width' }}
            >
                <nav
                    className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled
                            ? 'rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.04)]'
                            : 'rounded-none px-6 md:px-12 py-7'
                    }`}
                    style={isScrolled ? {
                        background: 'rgba(18,14,12,0.55)',
                        backdropFilter: 'blur(28px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.10)',
                    } : {
                        background: 'transparent',
                    }}
                >
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/codesprint" className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity">
                            <Image
                                src={isScrolled
                                    ? '/images/logo merch v2 - white n orange.webp'
                                    : '/images/logo merch v2 - black n orange.webp'}
                                alt="CodeSprint × Cicada"
                                width={3840}
                                height={389}
                                className={`w-auto transition-all duration-500 ${isScrolled ? 'h-6 md:h-7' : 'h-7 md:h-9'}`}
                                priority
                            />
                        </Link>

                        {/* Right: links + actions */}
                        <div className={`flex items-center gap-5 md:gap-7 transition-colors duration-500 ${isScrolled ? 'text-white' : 'text-black'}`}>
                            {/* Desktop nav */}
                            <div className="hidden md:flex items-center gap-7 lg:gap-10 mr-2">
                                {NAV_LINKS.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className="relative group text-sm font-rajdhani font-semibold tracking-[0.2em] overflow-hidden"
                                    >
                                        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                                            {item.name}
                                        </span>
                                        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 text-[#ff6a3d] group-hover:translate-y-0">
                                            {item.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            <button onClick={openSearch} className="hover:text-[#ff6a3d] transition-colors">
                                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </button>

                            <button onClick={toggleCart} className="relative hover:text-[#ff6a3d] transition-colors">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6a3d] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-4 w-4 text-[10px] bg-[#ff6a3d] text-white font-bold items-center justify-center">
                                            {cartCount}
                                        </span>
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden hover:text-[#ff6a3d] transition-colors z-50"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* ── Mobile menu overlay ── */}
            <div
                className={`fixed inset-0 z-40 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden flex flex-col items-center justify-center space-y-8 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
                style={{ background: 'rgba(10,8,6,0.96)' }}
            >
                {NAV_LINKS.map((item, i) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-3xl font-rajdhani font-semibold tracking-[0.2em] text-white transition-all duration-300 hover:text-[#ff6a3d] ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        {item.name}
                    </Link>
                ))}
                <div className="absolute bottom-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-px bg-white/20" />
                    <p className="text-xs font-rajdhani text-white/40 uppercase tracking-widest">CodeSprint × Cicada · IEEE SB IIT</p>
                </div>
            </div>
        </>
    );
}
