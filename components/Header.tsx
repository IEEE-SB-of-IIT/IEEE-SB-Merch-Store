'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

const NAV_LINKS = [
    { name: 'HOME', path: '/codesprint' },
    { name: 'SHOP', path: '/codesprint#product-grid' },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { openSearch } = useUI();
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 60);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on viewport resize to desktop
    useEffect(() => {
        if (!mobileOpen) return;
        const close = () => setMobileOpen(false);
        window.addEventListener('resize', close);
        return () => window.removeEventListener('resize', close);
    }, [mobileOpen]);

    return (
        <>
            {/* SVG filter: maps black→white, leaves orange #ff6a3d unchanged.
                R channel: always 1 (black R=0 → 1, orange R=1 → 1)
                G channel: −R + G + 1  (black G=0 → 1, orange G=0.416 → 0.416)
                B channel: −R + 0.5754·G + 1  (black B=0 → 1, orange B=0.239 → 0.239) */}
            <svg style={{ display: 'none', position: 'absolute' }} aria-hidden="true">
                <defs>
                    <filter id="cs-logo-white-filter" colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values="
                            0  0       0  0  1
                           -1  1       0  0  1
                           -1  0.5754  0  0  1
                            0  0       0  1  0
                        " />
                    </filter>
                </defs>
            </svg>

            {/* ── Navbar ──────────────────────────────────────────────── */}
            <div
                ref={navRef}
                className="header-root"
                data-scrolled={scrolled ? 'true' : 'false'}
            >
                {/* Liquid glass shimmer highlight (decorative) */}
                <div className="header-shimmer" aria-hidden="true" />

                {/* ── Left: Logo lockup ─────────────────────────────── */}
                <Link
                    href="/codesprint"
                    className="header-logo"
                    onClick={() => setMobileOpen(false)}
                >
                    {/* Both CS11 logos always rendered — opacity cross-fades on scroll */}
                    <span className="header-logo-cs-wrap">
                        <Image
                            src="/images/logo.webp"
                            alt="CodeSprint 11"
                            width={3942}
                            height={389}
                            className="header-logo-cs header-logo-cs--white"
                            priority
                        />
                        <Image
                            src="/images/logo.webp"
                            alt=""
                            aria-hidden="true"
                            width={3942}
                            height={389}
                            className="header-logo-cs header-logo-cs--black"
                            priority
                        />
                    </span>

                    <span className="header-logo-x">×</span>

                    {/* Both Cicada images always rendered — CSS opacity cross-fades.
                        No src-swap means no flash/reload glitch on scroll. */}
                    <span className="header-logo-cicada-wrap">
                        <Image
                            src="/images/Cicada - white text.webp"
                            alt="Cicada"
                            width={2988}
                            height={1336}
                            className="header-logo-cicada header-logo-cicada--white"
                            priority
                        />
                        <Image
                            src="/images/Cicada - Black text.webp"
                            alt=""
                            aria-hidden="true"
                            width={2988}
                            height={1336}
                            className="header-logo-cicada header-logo-cicada--black"
                            priority
                        />
                    </span>
                </Link>

                {/* ── Right: actions + nav links ────────────────────── */}
                <div className="header-actions">
                    {/* Desktop nav links */}
                    <nav className="header-nav" aria-label="Main navigation">
                        {NAV_LINKS.map((item) => (
                            <Link key={item.name} href={item.path} className="header-nav-link">
                                <span className="header-nav-text">{item.name}</span>
                                <span className="header-nav-text header-nav-text--hover" aria-hidden="true">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Search */}
                    <button
                        onClick={openSearch}
                        className="header-icon-btn"
                        aria-label="Open search"
                    >
                        <Search strokeWidth={1.5} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                    </button>

                    {/* Cart */}
                    <button
                        onClick={toggleCart}
                        className="header-icon-btn header-cart-btn"
                        aria-label={`Open cart, ${cartCount} items`}
                    >
                        <ShoppingBag strokeWidth={1.5} className="w-5 h-5 md:w-[22px] md:h-[22px]" />
                        {cartCount > 0 && (
                            <span className="header-cart-badge" aria-live="polite">
                                <span className="header-cart-ping" />
                                <span className="header-cart-count">{cartCount}</span>
                            </span>
                        )}
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        className="header-icon-btn md:hidden"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen
                            ? <X strokeWidth={1.5} className="w-6 h-6" />
                            : <Menu strokeWidth={1.5} className="w-6 h-6" />
                        }
                    </button>
                </div>
            </div>

            {/* ── Mobile fullscreen menu ─────────────────────────────── */}
            <div
                className="mobile-menu"
                data-open={mobileOpen ? 'true' : 'false'}
                aria-hidden={!mobileOpen}
            >
                <div className="mobile-menu-bg" aria-hidden="true" />

                <nav className="mobile-menu-links" aria-label="Mobile navigation">
                    {NAV_LINKS.map((item, i) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setMobileOpen(false)}
                            className="mobile-menu-link"
                            style={{ '--i': i } as React.CSSProperties}
                        >
                            <span className="mobile-menu-link-num">0{i + 1}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <footer className="mobile-menu-footer">
                    <div className="mobile-menu-footer-line" />
                    <p className="mobile-menu-footer-text">CodeSprint 11 × Cicada · IEEE SB IIT</p>
                </footer>
            </div>
        </>
    );
}
