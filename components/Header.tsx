"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <header className="glass-nav">
            <div className="container-width h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-black tracking-tighter text-foreground">
                        IEEE SB <span className="text-ieee-blue">MERCH</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-secondary">
                    <Link href="#" className="hover:text-primary transition-colors">Store</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Men</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Women</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Accessories</Link>
                    <Link href="#" className="hover:text-primary transition-colors text-red-500 font-bold">Codesprint</Link>
                </nav>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-6 text-foreground">
                    <Search className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                    <User className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                    <div className="relative cursor-pointer group">
                        <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors" />
                        <span className="absolute -top-2 -right-2 bg-ieee-blue text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            2
                        </span>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 md:hidden shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-6 text-lg font-medium text-secondary">
                        <Link href="#" className="hover:text-primary">Store</Link>
                        <Link href="#" className="hover:text-primary">Men</Link>
                        <Link href="#" className="hover:text-primary">Women</Link>
                        <Link href="#" className="hover:text-primary">Accessories</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
