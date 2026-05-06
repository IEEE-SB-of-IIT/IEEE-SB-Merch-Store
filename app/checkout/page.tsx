'use client';

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Truck, Copy, CheckCheck, Info } from 'lucide-react';
import Link from 'next/link';

const BANK_DETAILS = {
    bankName: 'Bank of Ceylon',
    accountName: 'IEEE Student Branch — IIT',
    accountNumber: '8001234567890',
    branch: 'Colombo Fort',
    branchCode: '001',
    swiftCode: 'BCEYLKLX',
};

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { currentEvent } = useTheme();
    const [checkoutTheme] = useState(() =>
        typeof window !== 'undefined' ? (sessionStorage.getItem('ieee_checkout_theme') ?? currentEvent) : currentEvent
    );
    const isCS = checkoutTheme === 'codesprint';
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', address: '', city: '', postalCode: '',
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
            if (!response.ok) { setError(data.error ?? 'Something went wrong.'); return; }

            const orderPayload = {
                orderId: data.orderId,
                customerName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email, address: formData.address,
                city: formData.city, postalCode: formData.postalCode,
                items: cartItems, subtotal, shipping, total,
                createdAt: new Date().toISOString(),
            };
            clearCart();
            const encoded = btoa(encodeURIComponent(JSON.stringify(orderPayload)));
            router.push(`/checkout/success?order=${encodeURIComponent(encoded)}`);
        } catch {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── theme tokens ──────────────────────────────────────────────────────────
    const pageBg       = isCS ? 'bg-cs-midnight' : 'bg-[#0f172a]';
    const accentText   = isCS ? 'text-cs-coral' : 'text-arctic-cyan';
    const accentBorder = isCS ? 'border-cs-coral/20' : 'border-arctic-cyan/20';
    const accentBg     = isCS ? 'bg-cs-coral/10' : 'bg-arctic-cyan/10';
    const accentBgDeep = isCS ? 'bg-[#130e0d]' : 'bg-[#0d1a2e]';
    const inputFocus   = isCS ? 'focus:border-cs-coral' : 'focus:border-arctic-cyan';
    const copyHover    = isCS ? 'hover:bg-cs-coral/20 hover:text-cs-coral hover:border-cs-coral/30' : 'hover:bg-arctic-cyan/20 hover:text-arctic-cyan hover:border-arctic-cyan/30';
    const pulseColor   = isCS ? 'bg-cs-coral' : 'bg-arctic-cyan';
    const headingFont  = isCS ? 'font-mortend' : 'font-black';
    const bodyFont     = isCS ? 'font-tommy' : '';
    const stepAccent   = isCS ? 'text-cs-coral font-mortend' : 'text-arctic-cyan font-mono font-black';
    const submitBtn    = isCS
        ? 'bg-cs-coral text-white hover:bg-cs-amber hover:text-black shadow-cs-coral/20'
        : 'bg-arctic-cyan text-black hover:bg-white shadow-arctic-cyan/20';

    if (cartItems.length === 0) {
        return (
            <div className={`min-h-screen ${pageBg} text-white flex flex-col items-center justify-center p-4`}>
                <h1 className={`text-3xl mb-4 ${headingFont}`}>YOUR CART IS EMPTY</h1>
                <Link href="/" className={`px-6 py-3 font-bold uppercase tracking-widest transition-colors ${isCS ? 'bg-cs-coral text-white hover:bg-cs-amber' : 'bg-white text-black hover:bg-gray-200'}`}>
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${pageBg} text-white`}>
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12">

                {/* ── Left Column ── */}
                <div className="flex-1 space-y-10">
                    <button
                        onClick={() => router.back()}
                        className={`flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest ${bodyFont}`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <div className="space-y-1">
                        <h1 className={`text-4xl md:text-5xl uppercase ${headingFont}`}>Checkout</h1>
                        <p className={`text-white/50 ${bodyFont}`}>Fill in your details and complete payment via bank transfer.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg flex items-center gap-3">
                            <Info className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">

                        {/* ── Shipping ── */}
                        <div className="space-y-6">
                            <div className={`flex items-center gap-3 border-b ${isCS ? 'border-cs-coral/20' : 'border-white/10'} pb-4`}>
                                <Truck className={`w-5 h-5 ${accentText}`} />
                                <h2 className={`text-xl uppercase tracking-wide ${headingFont}`}>Shipping Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { name: 'firstName', label: 'First Name', col: '' },
                                    { name: 'lastName',  label: 'Last Name',  col: '' },
                                    { name: 'email',     label: 'Email Address', col: 'md:col-span-2', type: 'email' },
                                    { name: 'address',   label: 'Address',    col: 'md:col-span-2' },
                                    { name: 'city',      label: 'City',       col: '' },
                                    { name: 'postalCode',label: 'Postal Code',col: '' },
                                ].map(({ name, label, col, type }) => (
                                    <div key={name} className={`space-y-2 ${col}`}>
                                        <label className={`text-xs font-bold uppercase tracking-widest text-white/50 ${bodyFont}`}>{label}</label>
                                        <input
                                            required
                                            name={name}
                                            type={type ?? 'text'}
                                            value={formData[name as keyof typeof formData]}
                                            onChange={handleInputChange}
                                            className={`w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none transition-colors ${inputFocus} ${bodyFont}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Bank Transfer ── */}
                        <div className="space-y-6">
                            <div className={`flex items-center gap-3 border-b ${isCS ? 'border-cs-coral/20' : 'border-white/10'} pb-4`}>
                                <div className={`w-5 h-5 ${accentText} flex items-center justify-center`}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
                                    </svg>
                                </div>
                                <h2 className={`text-xl uppercase tracking-wide ${headingFont}`}>Bank Transfer</h2>
                            </div>

                            <div className={`flex gap-3 p-4 ${accentBg} border ${accentBorder} rounded-lg`}>
                                <Info className={`w-5 h-5 ${accentText} flex-shrink-0 mt-0.5`} />
                                <p className={`text-sm text-white/70 leading-relaxed ${bodyFont}`}>
                                    After placing your order you&apos;ll receive an <strong className="text-white">Order ID</strong>. Transfer the exact amount using it as the payment reference, then upload your receipt.
                                </p>
                            </div>

                            {/* Bank details card */}
                            <div className={`${accentBgDeep} border ${accentBorder} rounded-xl overflow-hidden`}>
                                <div className={`px-6 py-4 ${accentBg} border-b ${accentBorder} flex items-center gap-3`}>
                                    <div className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`} />
                                    <span className={`${accentText} text-xs font-bold uppercase tracking-widest ${bodyFont}`}>Bank Account Details</span>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {[
                                        { label: 'Bank Name',       value: BANK_DETAILS.bankName },
                                        { label: 'Account Name',    value: BANK_DETAILS.accountName },
                                        { label: 'Account Number',  value: BANK_DETAILS.accountNumber, copyable: true },
                                        { label: 'Branch',          value: BANK_DETAILS.branch },
                                        { label: 'Branch Code',     value: BANK_DETAILS.branchCode, copyable: true },
                                        { label: 'SWIFT Code',      value: BANK_DETAILS.swiftCode, copyable: true },
                                    ].map(({ label, value, copyable }) => (
                                        <div key={label} className="flex items-center justify-between px-6 py-3.5">
                                            <div>
                                                <p className={`text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 ${bodyFont}`}>{label}</p>
                                                <p className="font-mono font-bold text-white text-sm">{value}</p>
                                            </div>
                                            {copyable && (
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(value, label)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 transition-all text-xs font-bold border border-white/10 ${copyHover}`}
                                                >
                                                    {copiedField === label
                                                        ? <><CheckCheck className={`w-3.5 h-3.5 ${accentText}`} /> Copied</>
                                                        : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className={`px-6 py-4 ${accentBg} border-t ${accentBorder} flex items-center justify-between`}>
                                    <div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 ${bodyFont}`}>Amount to Transfer</p>
                                        <p className={`font-mono font-black text-xl ${accentText}`}>LKR {total.toFixed(2)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(total.toFixed(2), 'amount')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${accentBg} ${accentText} transition-all text-xs font-bold border ${accentBorder} ${copyHover}`}
                                    >
                                        {copiedField === 'amount'
                                            ? <><CheckCheck className="w-3.5 h-3.5" /> Copied</>
                                            : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                    </button>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { step: '01', title: 'Place Order',       desc: 'Complete the form and click Place Order to get your Order ID.' },
                                    { step: '02', title: 'Transfer Payment',  desc: 'Transfer the exact amount using your Order ID as the reference.' },
                                    { step: '03', title: 'Upload Receipt',    desc: 'Upload your bank receipt on the confirmation page.' },
                                ].map(({ step, title, desc }) => (
                                    <div key={step} className={`p-4 bg-white/[0.03] border ${isCS ? 'border-cs-storm/30' : 'border-white/8'} rounded-xl space-y-2`}>
                                        <div className={`text-2xl ${stepAccent}`}>{step}</div>
                                        <p className={`font-bold text-white text-sm ${isCS ? 'font-tommy' : ''}`}>{title}</p>
                                        <p className={`text-white/40 text-xs leading-relaxed ${bodyFont}`}>{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* ── Right Column — Order Summary ── */}
                <div className="lg:w-[400px]">
                    <div className={`bg-white/5 border ${isCS ? 'border-cs-storm/30' : 'border-white/10'} rounded-xl p-8 sticky top-8 space-y-8`}>
                        <h2 className={`text-xl uppercase tracking-wide border-b ${isCS ? 'border-cs-coral/20' : 'border-white/10'} pb-4 ${headingFont}`}>Order Summary</h2>

                        <div className="space-y-5 max-h-[300px] overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-20 bg-white/5 rounded-lg flex-shrink-0 overflow-hidden">
                                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        <div className={`absolute -top-2 -right-2 w-5 h-5 ${isCS ? 'bg-cs-coral' : 'bg-arctic-cyan text-black'} text-white font-black rounded-full flex items-center justify-center text-[10px]`}>
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-sm leading-tight mb-1 truncate ${isCS ? 'font-tommy' : ''}`}>{item.name}</p>
                                        <p className="text-xs text-white/40 uppercase">
                                            {item.selectedColor !== 'Default' ? `${item.selectedColor} / ` : ''}{item.selectedSize}
                                        </p>
                                        <p className={`text-sm font-mono mt-2 ${accentText}`}>{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`space-y-3 border-t ${isCS ? 'border-cs-coral/20' : 'border-white/10'} pt-6 text-sm`}>
                            <div className="flex justify-between">
                                <span className={`text-white/50 ${bodyFont}`}>Subtotal</span>
                                <span className="font-mono">LKR {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`text-white/50 ${bodyFont}`}>Shipping</span>
                                <span className="font-mono">LKR {shipping.toFixed(2)}</span>
                            </div>
                            <div className={`flex justify-between text-lg font-bold border-t ${isCS ? 'border-cs-coral/20' : 'border-white/10'} pt-4`}>
                                <span className={headingFont}>Total</span>
                                <span className={`font-mono ${accentText}`}>LKR {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isProcessing}
                            className={`w-full py-4 font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 shadow-lg ${submitBtn}`}
                        >
                            {isProcessing ? 'Placing Order…' : 'Place Order →'}
                        </button>

                        <p className={`text-center text-white/30 text-xs leading-relaxed ${bodyFont}`}>
                            By placing your order you agree to complete payment via bank transfer. Your order will be processed once payment is verified.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
