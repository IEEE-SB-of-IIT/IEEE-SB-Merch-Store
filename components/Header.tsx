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
            {/*
              Outer wrapper always stays: fixed, full-width, top-0.
              Never toggle left/translate on it — that's what caused the jump.
              The pill shrinks inward via padding instead.
            */}
            <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
                <div
                    className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto mx-auto"
                    style={{
                        maxWidth: isScrolled ? '1100px' : '100%',
                        marginTop: isScrolled ? '14px' : '0',
                        paddingLeft: isScrolled ? '16px' : '0',
                        paddingRight: isScrolled ? '16px' : '0',
                    }}
                >
                    <nav
                        className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={isScrolled ? {
                            borderRadius: '16px',
                            padding: '14px 28px',
                            background: 'rgba(15,12,10,0.6)',
                            backdropFilter: 'blur(32px) saturate(200%)',
                            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                            border: '1px solid rgba(255,255,255,0.11)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)',
                        } : {
                            borderRadius: '0',
                            padding: '28px 48px',
                            background: 'transparent',
                            backdropFilter: 'none',
                            WebkitBackdropFilter: 'none',
                            border: '1px solid transparent',
                            boxShadow: 'none',
                        }}
                    >
                        <div className="flex items-center justify-between">

                            {/* Logo — both variants stacked, crossfaded to avoid src-swap flash */}
                            <Link href="/codesprint" className="flex-shrink-0 opacity-90 hover:opacity-100 transition-opacity relative">
                                <div className={`transition-all duration-500 ${isScrolled ? 'h-6 md:h-7' : 'h-7 md:h-9'}`}>
                                    {/* Dark variant (unscrolled, light hero bg) */}
                                    <Image
                                        src="/images/logo merch v2 - black n orange.webp"
                                        alt="CodeSprint × Cicada"
                                        width={3840}
                                        height={389}
                                        className={`h-full w-auto absolute top-0 left-0 transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
                                        priority
                                    />
                                    {/* Light variant (scrolled, dark glass bg) */}
                                    <Image
                                        src="/images/logo merch v2 - white n orange.webp"
                                        alt="CodeSprint × Cicada"
                                        width={3840}
                                        height={389}
                                        className={`h-full w-auto transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
                                        priority
                                    />
                                </div>
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
