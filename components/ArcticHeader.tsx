import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag } from 'lucide-react';

export default function ArcticHeader() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 text-white text-[12px] tracking-widest font-medium mix-blend-difference">
            {/* Left Brand - Logo */}
            <div className="relative w-80 h-24">
                <Image
                    src="/images/IEEE logo.png"
                    alt="IEEE SB Logo"
                    fill
                    className="object-contain object-left"
                />
            </div>

            {/* Center Nav */}
            <div className="hidden md:flex items-center gap-12">
                <Link href="#" className="hover:text-arctic-cyan transition-colors">[ COLLECTION ]</Link>
                <Link href="#" className="hover:text-arctic-cyan transition-colors">[ FEATURES ]</Link>
                <Link href="#" className="hover:text-arctic-cyan transition-colors">[ BOOTS ]</Link>
                <Link href="#" className="hover:text-arctic-cyan transition-colors">[ SOLIDS ]</Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <Search className="w-4 h-4 cursor-pointer" />
                <ShoppingBag className="w-4 h-4 cursor-pointer" />
            </div>
        </nav>
    )
}
