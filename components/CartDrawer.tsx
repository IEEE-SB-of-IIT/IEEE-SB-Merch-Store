"use client";

import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, cartCount } = useCart();

    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return acc + price * item.quantity;
    }, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0f172a]/90 backdrop-blur-xl border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-arctic-cyan" />
                        <h2 className="text-xl font-bold tracking-wide text-white">YOUR CART <span className="text-white/40 ml-2">({cartCount})</span></h2>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p className="text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                {/* Image */}
                                <div className="relative w-20 h-24 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white text-sm line-clamp-1 pr-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-white/30 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-arctic-cyan mt-0.5">{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-white/60">
                                        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                                            {item.selectedSize}
                                        </div>
                                        <span>Qty: {item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
                        <div className="flex justify-between items-center text-white">
                            <span className="text-white/60 text-sm uppercase tracking-wider">Subtotal</span>
                            <span className="text-xl font-bold font-mono">${subtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-white/40 text-center">Shipping and taxes calculated at checkout</p>
                        <Link href="/checkout" onClick={toggleCart} className="block w-full text-center py-4 bg-arctic-cyan text-black font-bold uppercase tracking-widest hover:bg-white transition-colors rounded-sm">
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
