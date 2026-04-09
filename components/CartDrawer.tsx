"use client";

import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
    const { currentEvent } = useTheme();
    const isCS = currentEvent === 'codesprint';

    const accent       = isCS ? '#ff5b41' : '#00f3ff';
    const accentClass  = isCS ? 'text-cs-coral' : 'text-arctic-cyan';
    const borderAccent = isCS ? 'border-cs-coral/30' : 'border-arctic-cyan/30';
    const bgAccent     = isCS ? 'bg-cs-coral/10' : 'bg-arctic-cyan/10';
    const hoverCard    = isCS ? 'hover:border-cs-coral/30' : 'hover:border-arctic-cyan/30';
    const sizeChip     = isCS ? 'text-cs-coral border-cs-coral/30 bg-cs-coral/10' : 'text-arctic-cyan border-arctic-cyan/30 bg-arctic-cyan/10';
    const checkoutBtn  = isCS
        ? 'bg-cs-coral text-white hover:bg-cs-amber hover:text-black shadow-cs-coral/20'
        : 'bg-arctic-cyan text-black hover:bg-white shadow-arctic-cyan/20';
    const drawerBg     = isCS ? 'bg-cs-midnight/95' : 'bg-[#0f172a]/90';
    const headingFont  = isCS ? 'font-tommy' : 'font-secondary';

    const subtotal = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : typeof item.price === 'number' ? item.price : 0;
        return acc + price * item.quantity;
    }, 0);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleCart}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] ${drawerBg} backdrop-blur-xl border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isCS ? 'border-cs-coral/15' : 'border-white/10'}`}>
                    <div className="flex items-center gap-3">
                        <ShoppingBag className={`w-5 h-5 ${accentClass}`} />
                        <h2 className={`text-xl font-bold tracking-wide text-white ${headingFont}`}>
                            YOUR CART <span className="text-white/40 ml-2">({cartCount})</span>
                        </h2>
                    </div>
                    <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p className={`text-lg ${isCS ? 'font-tommy' : ''}`}>Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className={`flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 ${hoverCard} hover:bg-white/[0.07] transition-all group backdrop-blur-md`}>
                                <div className="relative w-20 h-24 bg-black/20 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold text-white text-sm line-clamp-1 pr-2 tracking-wide ${isCS ? 'font-tommy' : ''}`}>{item.name}</h3>
                                            <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className={`text-sm ${accentClass} mt-1 font-secondary`}>{item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-white/60 mt-3">
                                        <div className="flex items-center gap-2 bg-black/20 px-2 py-1 rounded border border-white/5">
                                            {item.selectedColor && item.selectedColor !== 'Default' && (
                                                <span className="text-white/50 text-xs">{item.selectedColor}</span>
                                            )}
                                            <span className={`font-secondary uppercase text-xs font-bold border px-1.5 py-0.5 rounded-sm ${sizeChip}`}>
                                                {item.selectedSize}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 font-secondary bg-black/20 rounded border border-white/5 px-2 py-1">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-white transition-colors w-4 text-center disabled:opacity-30" disabled={item.quantity <= 1}>-</button>
                                            <span className="text-white w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-white transition-colors w-4 text-center">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className={`p-6 border-t ${isCS ? 'border-cs-coral/15' : 'border-white/10'} bg-black/40 backdrop-blur-xl space-y-4`}>
                        <div className="flex justify-between items-center text-white">
                            <span className={`text-white/60 text-sm uppercase tracking-wider ${headingFont}`}>Subtotal</span>
                            <span className={`text-xl font-bold font-secondary ${accentClass}`}>LKR {subtotal.toFixed(2)}</span>
                        </div>
                        <p className={`text-[10px] text-white/40 text-center ${headingFont}`}>Shipping and taxes calculated at checkout</p>
                        <Link
                            href="/checkout"
                            onClick={() => {
                                sessionStorage.setItem('ieee_checkout_theme', currentEvent);
                                toggleCart();
                            }}
                            className={`block w-full text-center py-4 font-bold uppercase tracking-widest transition-colors rounded-sm shadow-lg ${checkoutBtn}`}
                        >
                            {isCS ? 'Proceed to Checkout →' : 'Checkout'}
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
