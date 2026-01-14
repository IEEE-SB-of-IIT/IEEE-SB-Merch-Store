'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-arctic-cyan/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center space-y-8">
                <div className="w-24 h-24 bg-arctic-cyan/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-arctic-cyan/50">
                    <CheckCircle className="w-10 h-10 text-arctic-cyan" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black uppercase">Order Confirmed!</h1>
                    <p className="text-white/60 text-lg">
                        Thank you for your purchase. Your order <span className="text-white font-mono font-bold">#IEEE-{Math.floor(100000 + Math.random() * 900000)}</span> has been confirmed.
                    </p>
                    <p className="text-sm text-white/40">
                        Check your email for shipping updates.
                    </p>
                </div>

                <div className="pt-8">
                    <Link href="/" className="inline-block px-10 py-4 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors rounded-sm shadow-lg shadow-arctic-cyan/20">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
