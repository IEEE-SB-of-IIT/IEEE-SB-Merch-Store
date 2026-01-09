'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartItems, cartCount } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return acc + price * item.quantity;
    }, 0);

    const shipping = 25.00;
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    items: cartItems,
                    total: total
                }),
            });

            if (!response.ok) {
                console.error('Order failed');
                // You might want to show an error message here
            } else {
                router.push('/checkout/success');
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-black mb-4">YOUR CART IS EMPTY</h1>
                <Link href="/" className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-arctic-cyan selection:text-black">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12">

                {/* Left Column - Forms */}
                <div className="flex-1 space-y-12">
                    <div className="flex items-center gap-4 text-white/50 hover:text-white transition-colors cursor-pointer w-fit" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest">Back to Cart</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Checkout</h1>
                        <p className="text-white/60">Complete your order to receive your gear.</p>
                    </div>

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                        {/* Shipping Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <Truck className="w-5 h-5 text-arctic-cyan" />
                                <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">First Name</label>
                                    <input required name="firstName" onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Last Name</label>
                                    <input required name="lastName" onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Email Address</label>
                                    <input required name="email" onChange={handleInputChange} type="email" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Address</label>
                                    <input required name="address" onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">City</label>
                                    <input required name="city" onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">Postal Code</label>
                                    <input required name="postalCode" onChange={handleInputChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <CreditCard className="w-5 h-5 text-arctic-cyan" />
                                <h2 className="text-xl font-bold uppercase tracking-wide">Payment Method</h2>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm flex flex-col gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-4 h-4 rounded-full border-4 border-arctic-cyan bg-transparent" />
                                    <span className="font-bold">Credit Card</span>
                                    <div className="ml-auto flex gap-2 opacity-50">
                                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/60">Card Number</label>
                                        <input required placeholder="0000 0000 0000 0000" type="text" className="w-full bg-black/20 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors font-mono" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/60">Expiry</label>
                                            <input required placeholder="MM/YY" type="text" className="w-full bg-black/20 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors font-mono" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/60">CVC</label>
                                            <input required placeholder="123" type="text" className="w-full bg-black/20 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors font-mono" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:w-[400px] space-y-8">
                    <div className="bg-white/5 border border-white/10 rounded-sm p-8 sticky top-8">
                        <h2 className="text-xl font-bold uppercase tracking-wide mb-8 border-b border-white/10 pb-4">Order Summary</h2>

                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-white/5 rounded-sm flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-arctic-cyan text-black textxs font-bold rounded-full flex items-center justify-center text-[10px]">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm leading-tight mb-1">{item.name}</h3>
                                        <p className="text-xs text-white/50 uppercase">{item.selectedColor} / {item.selectedSize}</p>
                                        <p className="text-sm font-mono mt-2 text-arctic-cyan">{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-white/10 pt-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/60">Subtotal</span>
                                <span className="font-mono">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/60">Shipping</span>
                                <span className="font-mono">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4 mt-4">
                                <span>Total</span>
                                <span className="font-mono text-arctic-cyan">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isProcessing}
                            className="w-full mt-8 py-4 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
