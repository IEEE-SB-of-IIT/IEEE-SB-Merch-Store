'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Truck, Copy, CheckCheck, Info } from 'lucide-react';
import Link from 'next/link';

// ── Bank account details — update these as needed ────────────────────────────
const BANK_DETAILS = {
    bankName: 'Bank of Ceylon',
    accountName: 'IEEE Student Branch — IIT',
    accountNumber: '8001234567890',
    branch: 'Colombo Fort',
    branchCode: '001',
    swiftCode: 'BCEYLKLX',
};
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : typeof item.price === 'number' ? item.price : 0;
        return acc + price * item.quantity;
    }, 0);

    const shipping = 25.00;
    const total = subtotal + shipping;

    const copyToClipboard = (value: string, field: string) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

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
                    total,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error ?? 'Something went wrong. Please try again.');
                return;
            }

            const orderPayload = {
                orderId: data.orderId,
                customerName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                items: cartItems,
                subtotal,
                shipping,
                total,
                createdAt: new Date().toISOString(),
            };

            clearCart();
            const encoded = encodeURIComponent(btoa(JSON.stringify(orderPayload)));
            router.push(`/checkout/success?order=${encoded}`);
        } catch {
            setError('Network error. Please check your connection and try again.');
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

                {/* ── Left Column ── */}
                <div className="flex-1 space-y-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </button>

                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black uppercase">Checkout</h1>
                        <p className="text-white/50">Fill in your details and complete payment via bank transfer.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg flex items-center gap-3">
                            <Info className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">

                        {/* ── Shipping ── */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <Truck className="w-5 h-5 text-arctic-cyan" />
                                <h2 className="text-xl font-bold uppercase tracking-wide">Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">First Name</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Last Name</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Email Address</label>
                                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Address</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">City</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">Postal Code</label>
                                    <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-arctic-cyan transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* ── Bank Transfer Instructions ── */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                <div className="w-5 h-5 text-arctic-cyan flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-wide">Bank Transfer</h2>
                            </div>

                            {/* Info banner */}
                            <div className="flex gap-3 p-4 bg-arctic-cyan/5 border border-arctic-cyan/20 rounded-lg">
                                <Info className="w-5 h-5 text-arctic-cyan flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-white/70 leading-relaxed">
                                    After placing your order you will receive an <strong className="text-white">Order ID</strong>. Transfer the exact amount to the account below, using your Order ID as the payment reference. Then upload your receipt on the next page.
                                </p>
                            </div>

                            {/* Bank details card */}
                            <div className="bg-[#0d1a2e] border border-arctic-cyan/20 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 bg-arctic-cyan/10 border-b border-arctic-cyan/20 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-arctic-cyan animate-pulse" />
                                    <span className="text-arctic-cyan text-xs font-bold uppercase tracking-widest">Bank Account Details</span>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {[
                                        { label: 'Bank Name', value: BANK_DETAILS.bankName },
                                        { label: 'Account Name', value: BANK_DETAILS.accountName },
                                        { label: 'Account Number', value: BANK_DETAILS.accountNumber, copyable: true },
                                        { label: 'Branch', value: BANK_DETAILS.branch },
                                        { label: 'Branch Code', value: BANK_DETAILS.branchCode, copyable: true },
                                        { label: 'SWIFT Code', value: BANK_DETAILS.swiftCode, copyable: true },
                                    ].map(({ label, value, copyable }) => (
                                        <div key={label} className="flex items-center justify-between px-6 py-3.5 group">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
                                                <p className="font-mono font-bold text-white text-sm">{value}</p>
                                            </div>
                                            {copyable && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(value, label)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-arctic-cyan/20 text-white/40 hover:text-arctic-cyan transition-all text-xs font-bold border border-white/10 hover:border-arctic-cyan/30"
                                                >
                                                    {copiedField === label ? (
                                                        <><CheckCheck className="w-3.5 h-3.5 text-arctic-cyan" /> Copied</>
                                                    ) : (
                                                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Amount to pay */}
                                <div className="px-6 py-4 bg-arctic-cyan/5 border-t border-arctic-cyan/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Amount to Transfer</p>
                                        <p className="font-mono font-black text-arctic-cyan text-xl">LKR {total.toFixed(2)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(total.toFixed(2), 'amount')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arctic-cyan/10 hover:bg-arctic-cyan/20 text-arctic-cyan transition-all text-xs font-bold border border-arctic-cyan/20"
                                    >
                                        {copiedField === 'amount' ? (
                                            <><CheckCheck className="w-3.5 h-3.5" /> Copied</>
                                        ) : (
                                            <><Copy className="w-3.5 h-3.5" /> Copy</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { step: '01', title: 'Place Order', desc: 'Complete the form and click Place Order to get your Order ID.' },
                                    { step: '02', title: 'Transfer Payment', desc: 'Transfer the exact amount using your Order ID as the reference.' },
                                    { step: '03', title: 'Upload Receipt', desc: 'Upload your bank receipt on the confirmation page.' },
                                ].map(({ step, title, desc }) => (
                                    <div key={step} className="p-4 bg-white/[0.03] border border-white/8 rounded-xl space-y-2">
                                        <div className="text-arctic-cyan font-black text-2xl font-mono">{step}</div>
                                        <p className="font-bold text-white text-sm">{title}</p>
                                        <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* ── Right Column — Order Summary ── */}
                <div className="lg:w-[400px]">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 sticky top-8 space-y-8">
                        <h2 className="text-xl font-bold uppercase tracking-wide border-b border-white/10 pb-4">Order Summary</h2>

                        <div className="space-y-5 max-h-[300px] overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-arctic-cyan text-black font-black rounded-full flex items-center justify-center text-[10px]">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm leading-tight mb-1 truncate">{item.name}</p>
                                        <p className="text-xs text-white/40 uppercase">
                                            {item.selectedColor !== 'Default' ? `${item.selectedColor} / ` : ''}{item.selectedSize}
                                        </p>
                                        <p className="text-sm font-mono mt-2 text-arctic-cyan">{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-white/10 pt-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-white/50">Subtotal</span>
                                <span className="font-mono">LKR {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/50">Shipping</span>
                                <span className="font-mono">LKR {shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-4">
                                <span>Total</span>
                                <span className="font-mono text-arctic-cyan">LKR {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isProcessing}
                            className="w-full py-4 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-arctic-cyan/20"
                        >
                            {isProcessing ? 'Placing Order…' : 'Place Order →'}
                        </button>

                        <p className="text-center text-white/30 text-xs leading-relaxed">
                            By placing your order you agree to complete payment via bank transfer. Your order will be processed once payment is verified.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
