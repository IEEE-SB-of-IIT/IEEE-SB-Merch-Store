'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

interface HeaderProps {
    theme?: 'default' | 'codesprint' | 'ix';
}

export default function Header({ theme = 'default' }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { openSearch } = useUI();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const themeConfig = {
        default: {
            bg: 'bg-arctic-dark/60',
            border: 'border-white/10',
            badge: 'bg-arctic-cyan',
            text: 'text-cyan-400',
            hoverText: 'hover:text-cyan-400'
        },
        codesprint: {
            bg: 'bg-cs-midnight/80',
            border: 'border-cs-coral/20',
            badge: 'bg-cs-coral',
            text: 'text-cs-coral',
            hoverText: 'hover:text-cs-coral'
        },
        ix: {
            bg: 'bg-[#450a25]/80',
            border: 'border-[#FF0879]/20',
            badge: 'bg-[#FF0879]',
            text: 'text-[#FF0879]',
            hoverText: 'hover:text-[#FF0879]'
        }
    };

    const styles = themeConfig[theme] || themeConfig.default;

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${isScrolled
                ? `py-4 ${styles.bg} backdrop-blur-xl ${styles.border} shadow-[0_4px_30px_rgba(0,0,0,0.1)]`
                : 'py-8 bg-transparent border-transparent'
                }`}
            style={{ willChange: 'padding, background-color' }}
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

                {/* Right Section: Nav + Actions */}
                <div className="flex items-center gap-6 md:gap-8 text-white">
                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8 lg:gap-12 mr-4">
                        {[
                            { name: 'HOME', path: '/' },
                            { name: 'CODESPRINT', path: '/codesprint' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="relative group text-lg md:text-xl font-bebas tracking-wider text-white overflow-hidden"
                            >
                                <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                                    {item.name}
                                </span>
                                <span className={`absolute top-0 left-0 block translate-y-full transition-transform duration-300 ${styles.text} group-hover:translate-y-0`}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={openSearch}
                        className={`${styles.hoverText} transition-colors`}
                    >
                        <Search className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={toggleCart}
                        className={`relative ${styles.hoverText} transition-colors group`}
                    >
                        <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles.badge} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-4 w-4 ${styles.badge} text-black font-bold items-center justify-center`}>
                                    {cartCount}
                                </span>
                            </span>
                        )}
                    </button>
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden ${styles.hoverText} transition-colors z-50`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-7 h-7" strokeWidth={1.5} />
                        ) : (
                            <Menu className="w-7 h-7" strokeWidth={1.5} />
                        )}
                    </button>
                </div>
            </div>
            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden flex flex-col items-center justify-center space-y-8 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                {[
                    { name: 'HOME', path: '/' },
                    { name: 'CODESPRINT', path: '/codesprint' }
                ].map((item, i) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-4xl font-bebas tracking-widest text-white transition-opacity duration-300 hover:opacity-50 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                    >
                        {item.name}
                    </Link>
                ))}

                <div className="absolute bottom-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-[1px] bg-white/20" />
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Est. 2024</p>
                </div>
            </div>
        </nav >
    );
}
