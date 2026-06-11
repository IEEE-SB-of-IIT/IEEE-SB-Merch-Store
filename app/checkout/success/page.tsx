'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    CheckCircle, Download, ArrowLeft, Package, MapPin, Mail, Hash,
    Upload, FileImage, X, Loader2, ShieldCheck, Copy, CheckCheck, AlertCircle
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface CartItem {
    id: string;
    productId: number;
    name: string;
    price: string;
    image: string;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
}

interface OrderData {
    orderId: string;
    customerName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    createdAt: string;
}

const BANK_DETAILS = {
    bankName: 'Bank of Ceylon',
    accountName: 'IEEE Student Branch — IIT',
    accountNumber: '8001234567890',
    branch: 'Colombo Fort',
    branchCode: '001',
};

function parsePrice(price: string | number): number {
    if (typeof price === 'number') return price;
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function generateOrderRef(id: string | number | undefined | null) {
    if (!id) return ''; // return empty during SSR — filled in after hydration
    const idStr = String(id);
    return isNaN(Number(idStr))
        ? `IEEE-${idStr.slice(-6).toUpperCase()}`
        : `IEEE-${idStr.padStart(6, '0')}`;
}

// ── Receipt Upload Component ─────────────────────────────────────────────────

function ReceiptUpload({ orderId, orderRef, total, isCS }: { orderId: string; orderRef: string; total: number; isCS?: boolean }) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // On mount, fetch real payment_status from DB so reload always shows correct state
    useEffect(() => {
        if (!orderId) { setChecking(false); return; }
        fetch(`/api/orders/status?orderId=${orderId}`)
            .then(r => r.json())
            .then(data => { if (data.payment_status) setPaymentStatus(data.payment_status); })
            .catch(() => { /* fall back to upload UI */ })
            .finally(() => setChecking(false));
    }, [orderId]);

    const copyToClipboard = (value: string, field: string) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(selected.type)) {
            setError('Invalid file type. Please upload JPG, PNG, WEBP or PDF.');
            return;
        }
        if (selected.size > 5 * 1024 * 1024) {
            setError('File too large. Maximum size is 5MB.');
            return;
        }
        setError(null);
        setFile(selected);

        if (selected.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(selected);
        } else {
            setPreview(null); // PDF — no preview
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped) {
            const synth = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileChange(synth);
        }
    };

    const handleUpload = async () => {
        if (!file || !orderId) return;
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('receipt', file);
            formData.append('orderId', orderId);

            const res = await fetch('/api/orders/receipt', { method: 'POST', body: formData });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? 'Upload failed. Please try again.');
                return;
            }

            setPaymentStatus('receipt_uploaded');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (checking) {
        return (
            <div className="flex items-center justify-center py-12 text-white/30">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Checking status…
            </div>
        );
    }

    if (paymentStatus === 'rejected') {
        return (
            <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/40">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase">Receipt Rejected</h3>
                    <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                        Your payment receipt could not be verified. Please upload a clear, valid receipt and try again.
                    </p>
                    <button
                        onClick={() => setPaymentStatus('awaiting_payment')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        <Upload className="w-3.5 h-3.5" /> Upload New Receipt
                    </button>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'verified') {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-2 ring-emerald-500/50">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase">Payment Verified!</h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                    Your payment has been confirmed by our team. Your order is now being processed.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Payment Confirmed
                </div>
            </div>
        );
    }

    if (paymentStatus === 'receipt_uploaded') {
        return (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-yellow-500/40">
                    <ShieldCheck className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase">Receipt Uploaded!</h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                    Your payment receipt has been submitted. Our team will verify your payment and update your order status within 24 hours.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Awaiting Verification
                </div>
            </div>
        );
    }

    const ac  = isCS ? 'text-cs-coral' : 'text-arctic-cyan';
    const ab  = isCS ? 'border-cs-coral/20' : 'border-arctic-cyan/20';
    const abg = isCS ? 'bg-cs-coral/10' : 'bg-arctic-cyan/10';
    const pulse = isCS ? 'bg-cs-coral' : 'bg-arctic-cyan';
    const hoverCopy = isCS
        ? 'hover:bg-cs-coral/20 hover:text-cs-coral hover:border-cs-coral/30'
        : 'hover:bg-arctic-cyan/20 hover:text-arctic-cyan hover:border-arctic-cyan/30';
    const dropZoneHover = isCS
        ? 'hover:border-cs-coral/50 hover:bg-cs-coral/5'
        : 'hover:border-arctic-cyan/50 hover:bg-arctic-cyan/5';
    const iconHover = isCS ? 'group-hover:bg-cs-coral/10 group-hover:text-cs-coral' : 'group-hover:bg-arctic-cyan/10 group-hover:text-arctic-cyan';
    const submitBtnCls = isCS
        ? 'bg-cs-coral text-white hover:bg-cs-amber hover:text-black shadow-cs-coral/20'
        : 'bg-arctic-cyan text-black hover:bg-white shadow-arctic-cyan/20';
    const deepBg = isCS ? 'bg-[#130e0d]' : 'bg-[#0d1a2e]';

    return (
        <div className="space-y-6">
            {/* Payment reminder */}
            <div className={`${deepBg} border ${ab} rounded-xl overflow-hidden`}>
                <div className={`px-6 py-4 ${abg} border-b ${ab} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${pulse} animate-pulse`} />
                        <span className={`${ac} text-xs font-bold uppercase tracking-widest`}>Transfer to This Account</span>
                    </div>
                    <span className={`${ac} font-mono font-black text-sm`}>LKR {total.toFixed(2)}</span>
                </div>

                <div className="divide-y divide-white/5">
                    {[
                        { label: 'Bank', value: BANK_DETAILS.bankName },
                        { label: 'Account Name', value: BANK_DETAILS.accountName },
                        { label: 'Account No.', value: BANK_DETAILS.accountNumber, copyable: true },
                        { label: 'Branch / Code', value: `${BANK_DETAILS.branch} / ${BANK_DETAILS.branchCode}` },
                        { label: 'Payment Reference', value: orderRef, copyable: true, highlight: true },
                    ].map(({ label, value, copyable, highlight }) => (
                        <div key={label} className="flex items-center justify-between px-6 py-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">{label}</p>
                                <p className={`font-mono font-bold text-sm ${highlight ? ac : 'text-white'}`}>{value}</p>
                            </div>
                            {copyable && (
                                <button
                                    onClick={() => copyToClipboard(value, label)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 transition-all text-xs font-bold border border-white/10 ${hoverCopy}`}
                                >
                                    {copiedField === label
                                        ? <><CheckCheck className={`w-3.5 h-3.5 ${ac}`} /> Copied</>
                                        : <><Copy className="w-3.5 h-3.5" /> Copy</>
                                    }
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Upload zone */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-3">Upload Payment Receipt</h3>

                {!file ? (
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        className={`border-2 border-dashed border-white/15 ${dropZoneHover} rounded-xl p-10 text-center cursor-pointer transition-all group`}
                    >
                        <div className={`w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${iconHover}`}>
                            <Upload className="w-6 h-6 text-white/30 group-hover:text-current transition-colors" />
                        </div>
                        <p className="text-white/60 font-bold text-sm mb-1">Drop your receipt here or <span className={`${ac} underline`}>browse</span></p>
                        <p className="text-white/30 text-xs">Supports JPG, PNG, WEBP, PDF — max 5MB</p>
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                        {/* File preview row */}
                        <div className="flex items-center gap-4">
                            {preview ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                    <Image src={preview} alt="Receipt preview" fill sizes="64px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10">
                                    <FileImage className="w-7 h-7 text-white/30" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{file.name}</p>
                                <p className="text-white/40 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={() => { setFile(null); setPreview(null); setError(null); }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white flex-shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`w-full py-3.5 font-black uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 shadow-lg ${submitBtnCls}`}
                        >
                            {uploading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
                                : <><Upload className="w-4 h-4" /> Submit Receipt</>
                            }
                        </button>
                    </div>
                )}

                {error && !file && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Main success page ─────────────────────────────────────────────────────────

function SuccessContent() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<OrderData | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHydrated(true);
        const raw = searchParams.get('order');
        if (raw) {
            try {
                const parsed = JSON.parse(decodeURIComponent(atob(decodeURIComponent(raw))));
                setOrder(parsed);
                sessionStorage.setItem('ieee_last_order', JSON.stringify(parsed));
            } catch { /* fall through to sessionStorage */ }
        } else {
            // Reload without URL params — restore from sessionStorage
            try {
                const saved = sessionStorage.getItem('ieee_last_order');
                if (saved) setOrder(JSON.parse(saved));
            } catch { /* no data */ }
        }
    }, [searchParams]);

    // Only generate ref after hydration — avoids Math.random() mismatch
    const orderRef = hydrated ? generateOrderRef(order?.orderId) : '';

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });

            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const margin = 48;
            const contentW = pageW - margin * 2;

            // ── Palette ──────────────────────────────────────────────────────
            // RGB tuples for jsPDF setTextColor / setFillColor / setDrawColor
            const P = isCS
                ? {
                    pageBg:    [255, 255, 255]   as [number,number,number], // white
                    headerBg:  [21, 25, 34]      as [number,number,number], // cs-midnight
                    rowAlt:    [248, 246, 244]   as [number,number,number], // very light warm gray
                    totalBg:   [255, 91, 65]     as [number,number,number], // coral fill for total row
                    footerBg:  [21, 25, 34]      as [number,number,number], // cs-midnight
                    divider:   [220, 210, 200]   as [number,number,number], // light warm rule
                    accent:    [255, 91, 65]     as [number,number,number], // coral
                    accent2:   [242, 162, 101]   as [number,number,number], // amber
                    white:     [30, 30, 30]      as [number,number,number], // dark text on white bg
                    muted:     [120, 110, 105]   as [number,number,number],
                    bodyText:  [60, 55, 50]      as [number,number,number],
                    brand:     'CODESPRINT',
                    brandSub:  'MERCH STORE · IEEE SB',
                }
                : {
                    pageBg:    [15, 23, 42]      as [number,number,number],
                    headerBg:  [22, 32, 56]      as [number,number,number],
                    rowAlt:    [20, 28, 46]      as [number,number,number],
                    totalBg:   [0, 50, 70]       as [number,number,number],
                    footerBg:  [10, 16, 30]      as [number,number,number],
                    divider:   [40, 55, 80]      as [number,number,number],
                    accent:    [0, 212, 255]     as [number,number,number], // cyan
                    accent2:   [0, 212, 255]     as [number,number,number],
                    white:     [255, 255, 255]   as [number,number,number],
                    muted:     [150, 160, 180]   as [number,number,number],
                    bodyText:  [220, 220, 235]   as [number,number,number],
                    brand:     'IEEE SB',
                    brandSub:  'MERCH STORE',
                };

            const setAccent  = () => doc.setTextColor(...P.accent);
            const setWhite   = () => doc.setTextColor(...P.white);
            const setMuted   = () => doc.setTextColor(...P.muted);
            const setBody    = () => doc.setTextColor(...P.bodyText);
            const drawAccent = () => doc.setDrawColor(...P.accent);
            const drawDiv    = () => doc.setDrawColor(...P.divider);

            // ── Page background ───────────────────────────────────────────
            doc.setFillColor(...P.pageBg);
            doc.rect(0, 0, pageW, pageH, 'F');

            // ── Header bar ────────────────────────────────────────────────
            doc.setFillColor(...P.headerBg);
            doc.rect(0, 0, pageW, 90, 'F');

            // Header text — always on dark bar so use fixed white/coral
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            setAccent();
            doc.text(P.brand, margin, 38);
            doc.setFontSize(9);
            doc.setTextColor(180, 170, 165);
            doc.setFont('helvetica', 'normal');
            doc.text(P.brandSub, margin, 52);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(28);
            doc.setTextColor(255, 255, 255);
            doc.text('INVOICE', pageW - margin, 42, { align: 'right' });
            doc.setFontSize(10);
            setAccent();
            doc.setFont('helvetica', 'normal');
            doc.text(orderRef, pageW - margin, 58, { align: 'right' });
            doc.setTextColor(180, 170, 165);
            doc.setFontSize(9);
            doc.text(order ? formatDate(order.createdAt) : formatDate(new Date().toISOString()), pageW - margin, 72, { align: 'right' });

            drawAccent();
            doc.setLineWidth(1.5);
            doc.line(margin, 100, pageW - margin, 100);

            let y = 124;

            // ── Billing + order meta ──────────────────────────────────────
            if (order) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                setAccent();
                doc.text('BILLED TO', margin, y);
                doc.setFontSize(12);
                setWhite();
                doc.text(order.customerName, margin, y + 16);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                setMuted();
                doc.text(order.email, margin, y + 30);
                doc.text(order.address, margin, y + 43);
                doc.text(`${order.city}, ${order.postalCode}`, margin, y + 56);

                const rx = pageW - margin;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                setAccent();
                doc.text('ORDER DETAILS', rx, y, { align: 'right' });

                [['Order Ref', orderRef], ['Date', formatDate(order.createdAt)], ['Status', 'CONFIRMED'], ['Payment', 'Bank Transfer']].forEach(([label, value], i) => {
                    const ly = y + 16 + i * 14;
                    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setMuted();
                    doc.text(label, rx - 100, ly);
                    doc.setFont('helvetica', 'bold');
                    if (label === 'Status') setAccent(); else setWhite();
                    doc.text(value, rx, ly, { align: 'right' });
                });
                y += 88;
            }

            // ── Items table ───────────────────────────────────────────────
            drawDiv(); doc.setLineWidth(0.5);
            doc.line(margin, y, pageW - margin, y);
            y += 18;

            doc.setFillColor(...P.headerBg);
            doc.rect(margin, y - 6, contentW, 22, 'F');

            const cols = { item: margin + 10, size: margin + contentW * 0.50, qty: margin + contentW * 0.63, unit: margin + contentW * 0.73, total: pageW - margin - 6 };
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8); setAccent();
            doc.text('ITEM', cols.item, y + 8);
            doc.text('SIZE', cols.size, y + 8);
            doc.text('QTY', cols.qty, y + 8);
            doc.text('UNIT PRICE', cols.unit, y + 8);
            doc.text('TOTAL', cols.total, y + 8, { align: 'right' });
            y += 28;

            (order?.items ?? []).forEach((item, index) => {
                const rowH = 34;
                if (index % 2 === 0) { doc.setFillColor(...P.rowAlt); doc.rect(margin, y - 6, contentW, rowH, 'F'); }
                const unitPrice = parsePrice(item.price);
                const lineTotal = unitPrice * item.quantity;
                const name = item.name.length > 38 ? item.name.substring(0, 38) + '…' : item.name;

                doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setWhite();
                doc.text(name, cols.item, y + 6);
                if (item.selectedColor) { doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setMuted(); doc.text(item.selectedColor, cols.item, y + 17); }

                if (item.selectedSize) {
                    drawAccent(); doc.setLineWidth(0.5);
                    doc.roundedRect(cols.size, y - 1, 28, 14, 2, 2, 'S');
                    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); setAccent();
                    doc.text(item.selectedSize, cols.size + 14, y + 8.5, { align: 'center' });
                }
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setBody();
                doc.text(String(item.quantity), cols.qty + 8, y + 8, { align: 'center' });
                doc.text(`LKR ${unitPrice.toFixed(2)}`, cols.unit, y + 8);
                doc.setFont('helvetica', 'bold'); setWhite();
                doc.text(`LKR ${lineTotal.toFixed(2)}`, cols.total, y + 8, { align: 'right' });
                y += rowH;
            });

            // ── Totals ────────────────────────────────────────────────────
            y += 10;
            drawDiv(); doc.setLineWidth(0.5);
            doc.line(pageW - margin - 200, y, pageW - margin, y);
            y += 14;

            const totalsX = pageW - margin - 200;
            [['Subtotal', `LKR ${(order?.subtotal ?? 0).toFixed(2)}`], ['Shipping', `LKR ${(order?.shipping ?? 25).toFixed(2)}`]].forEach(([label, value]) => {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setMuted(); doc.text(label, totalsX, y);
                setBody(); doc.text(value, pageW - margin, y, { align: 'right' });
                y += 16;
            });

            doc.setFillColor(...P.totalBg);
            doc.rect(totalsX - 8, y - 10, 208, 26, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
            doc.setTextColor(255, 255, 255); // always white text on coral/dark fill
            doc.text('TOTAL', totalsX, y + 8);
            doc.text(`LKR ${(order?.total ?? 0).toFixed(2)}`, pageW - margin, y + 8, { align: 'right' });
            y += 46;

            // ── Payment instructions ──────────────────────────────────────
            drawDiv(); doc.setLineWidth(0.5);
            doc.line(margin, y, pageW - margin, y);
            y += 20;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setAccent();
            doc.text('PAYMENT INSTRUCTIONS', margin, y);
            y += 14;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setMuted();
            doc.text(`Bank: ${BANK_DETAILS.bankName}  |  Account: ${BANK_DETAILS.accountName}`, margin, y); y += 12;
            doc.text(`Account No: ${BANK_DETAILS.accountNumber}  |  Branch: ${BANK_DETAILS.branch} (${BANK_DETAILS.branchCode})`, margin, y); y += 12;
            setAccent(); doc.setFont('helvetica', 'bold');
            doc.text(`Payment Reference: ${orderRef}`, margin, y); y += 20;

            doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setWhite();
            doc.text('Thank you for your order!', margin, y); y += 14;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setMuted();
            doc.text('Please transfer the exact amount and upload your receipt at the confirmation page.', margin, y); y += 12;
            doc.text('Your order will be processed once payment is verified by our team.', margin, y);

            // ── Footer ────────────────────────────────────────────────────
            doc.setFillColor(...P.footerBg);
            doc.rect(0, pageH - 44, pageW, 44, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
            doc.setTextColor(120, 110, 105); // always legible on dark footer
            doc.text(isCS ? 'CODESPRINT · IEEE Student Branch — Merch Store' : 'IEEE Student Branch — Merch Store', margin, pageH - 22);
            doc.text('This is a computer-generated invoice. No signature required.', pageW - margin, pageH - 22, { align: 'right' });

            doc.save(`Invoice_${orderRef}.pdf`);
        } catch (err) {
            console.error('PDF failed', err);
        } finally {
            setDownloading(false);
        }
    };

    const { currentEvent } = useTheme();
    const [checkoutTheme] = useState(() =>
        typeof window !== 'undefined' ? (sessionStorage.getItem('ieee_checkout_theme') ?? currentEvent) : currentEvent
    );
    const isCS = checkoutTheme === 'codesprint';

    const pageBg       = isCS ? 'bg-cs-midnight' : 'bg-[#0f172a]';
    const cardBg       = isCS ? 'bg-[#0d0f14]' : 'bg-[#111827]';
    const cardHdr      = isCS ? 'bg-[#0a0c10]' : 'bg-[#0d1526]';
    const borderCol    = isCS ? 'border-cs-coral/20' : 'border-white/10';
    const accentText   = isCS ? 'text-cs-coral' : 'text-arctic-cyan';
    const accentBorder = isCS ? 'border-cs-coral/40' : 'border-arctic-cyan/40';
    const accentBg     = isCS ? 'bg-cs-coral/10' : 'bg-arctic-cyan/10';
    const accentRing   = isCS ? 'ring-cs-coral/40' : 'ring-arctic-cyan/40';
    const glowColor    = isCS ? 'bg-cs-coral/8' : 'bg-arctic-cyan/8';
    const sizeChip     = isCS ? 'text-cs-coral border-cs-coral/40 bg-cs-coral/10' : 'text-arctic-cyan border-arctic-cyan/40 bg-arctic-cyan/10';
    const headingFont  = isCS ? 'font-mortend' : 'font-black';
    const bodyFont     = isCS ? 'font-tommy' : '';
    const dlBtn        = isCS
        ? 'bg-cs-coral/10 border-cs-coral/30 text-cs-coral hover:bg-cs-coral hover:text-white'
        : 'bg-white/10 border-white/20 text-white hover:bg-white/20';

    return (
        <div className={`min-h-screen ${pageBg} text-white`}>
            <div className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${glowColor} blur-[140px] rounded-full pointer-events-none`} />

            <div className={`relative z-10 max-w-3xl mx-auto px-6 py-16 space-y-10 ${bodyFont}`}>

                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>

                {/* Success header */}
                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 ${accentBg} rounded-full flex items-center justify-center ring-1 ${accentRing} mb-6`}>
                        <CheckCircle className={`w-9 h-9 ${accentText}`} />
                    </div>
                    <h1 className={`text-4xl md:text-5xl uppercase mb-3 ${headingFont}`}>Order Placed!</h1>
                    <p className="text-white/50 text-base max-w-sm leading-relaxed">
                        Your order <span className="text-white font-mono font-bold">{orderRef}</span> has been received.
                        Complete your payment using the details below and upload your receipt.
                    </p>
                </div>

                {/* ── Invoice Card ── */}
                <div ref={invoiceRef} className={`${cardBg} border ${borderCol} rounded-xl overflow-hidden`}>
                    {/* Header */}
                    <div className={`${cardHdr} px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b ${borderCol}`}>
                        <div className="flex items-center gap-3">
                            <Image src="/images/favicon.webp" alt="CodeSprint 11" width={32} height={32} className="object-contain" />
                            <div>
                                <p className={`${accentText} font-black text-lg leading-none ${isCS ? 'font-mortend' : ''}`}>
                                    {isCS ? 'CODESPRINT' : 'IEEE SB'}
                                </p>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Merch Store</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Invoice</p>
                            <p className="text-white font-mono font-black text-xl">{orderRef}</p>
                            <p className="text-white/40 text-xs mt-1">
                                {order ? formatDate(order.createdAt) : formatDate(new Date().toISOString())}
                            </p>
                        </div>
                    </div>

                    {/* Customer + Order Meta */}
                    {order && (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 py-6 border-b ${borderCol}`}>
                            <div>
                                <p className={`${accentText} text-[10px] font-bold uppercase tracking-widest mb-3`}>Billed To</p>
                                <div className="space-y-1.5">
                                    <p className="font-bold text-white">{order.customerName}</p>
                                    <p className="flex items-center gap-2 text-white/50 text-sm">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0" /> {order.email}
                                    </p>
                                    <p className="flex items-start gap-2 text-white/50 text-sm">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                        <span>{order.address},<br />{order.city} {order.postalCode}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <p className={`${accentText} text-[10px] font-bold uppercase tracking-widest mb-3`}>Order Info</p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex sm:justify-end items-center gap-2">
                                        <Hash className="w-3.5 h-3.5 text-white/40" />
                                        <span className="text-white/50">Ref:</span>
                                        <span className="text-white font-mono font-bold">{orderRef}</span>
                                    </div>
                                    <div className="flex sm:justify-end items-center gap-2">
                                        <Package className="w-3.5 h-3.5 text-white/40" />
                                        <span className="text-white/50">Payment:</span>
                                        <span className="text-yellow-400 font-bold uppercase text-xs bg-yellow-400/10 px-2 py-0.5 rounded-sm">Awaiting</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className={`px-8 py-6 border-b ${borderCol}`}>
                        <p className={`${accentText} text-[10px] font-bold uppercase tracking-widest mb-4`}>Order Items</p>
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 pb-2 border-b border-white/5">
                            <div className="col-span-5">Item</div>
                            <div className="col-span-2 text-center">Size</div>
                            <div className="col-span-1 text-center">Qty</div>
                            <div className="col-span-2 text-right">Unit</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {(order?.items ?? []).map((item) => {
                                const unitPrice = parsePrice(item.price);
                                const lineTotal = unitPrice * item.quantity;
                                return (
                                    <div key={item.id} className="grid grid-cols-12 gap-2 py-3 items-center">
                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className="relative w-10 h-12 bg-white/5 rounded flex-shrink-0 overflow-hidden">
                                                <Image src={item.image} alt={item.name} fill sizes="40px" className="object-contain p-1" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-white text-sm leading-tight truncate">{item.name}</p>
                                                {item.selectedColor && item.selectedColor !== 'Default' && (
                                                    <p className="text-white/40 text-xs mt-0.5">{item.selectedColor}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            {item.selectedSize
                                                ? <span className={`text-xs font-bold border px-2 py-0.5 rounded-sm uppercase ${sizeChip}`}>{item.selectedSize}</span>
                                                : <span className="text-white/20 text-xs">—</span>}
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <span className="text-white font-mono text-sm font-bold">{item.quantity}</span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="text-white/60 font-mono text-sm">LKR {unitPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="text-white font-mono font-bold text-sm">LKR {lineTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className={`px-8 py-6 border-b ${borderCol}`}>
                        <div className="flex justify-end">
                            <div className="w-full sm:w-64 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Subtotal</span>
                                    <span className="font-mono text-white">LKR {(order?.subtotal ?? 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Shipping</span>
                                    <span className="font-mono text-white">LKR {(order?.shipping ?? 25).toFixed(2)}</span>
                                </div>
                                <div className={`flex justify-between text-base font-bold pt-3 border-t ${borderCol}`}>
                                    <span className={`text-white uppercase tracking-wide ${isCS ? 'font-mortend' : ''}`}>Total</span>
                                    <span className={`font-mono text-lg ${accentText}`}>LKR {(order?.total ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`px-8 py-5 ${cardHdr} text-center`}>
                        <p className="text-white/30 text-xs">Use <span className={`font-mono font-bold ${accentText}`}>{orderRef}</span> as payment reference when transferring.</p>
                    </div>
                </div>

                {/* Download */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className={`flex items-center gap-3 px-8 py-4 border font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm ${dlBtn}`}
                    >
                        <Download className="w-4 h-4" />
                        {downloading ? 'Generating…' : 'Download Invoice'}
                    </button>
                    <p className="text-white/30 text-xs">Keep this invoice for your records.</p>
                </div>

                {/* ── Receipt Upload Section ── */}
                <div className={`${cardBg} border ${borderCol} rounded-xl overflow-hidden`}>
                    <div className={`px-8 py-5 border-b ${borderCol} flex items-center gap-3`}>
                        <div className={`w-8 h-8 ${accentBg} rounded-lg flex items-center justify-center`}>
                            <Upload className={`w-4 h-4 ${accentText}`} />
                        </div>
                        <div>
                            <h2 className={`font-bold text-white ${isCS ? 'font-tommy' : ''}`}>Upload Payment Receipt</h2>
                            <p className="text-white/40 text-xs mt-0.5">After transferring, upload your receipt here to confirm payment.</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <ReceiptUpload
                            orderId={String(order?.orderId ?? '')}
                            orderRef={orderRef}
                            total={order?.total ?? 0}
                            isCS={isCS}
                        />
                    </div>
                </div>

                <p className="text-center text-white/20 text-xs">
                    Reference: <span className="font-mono text-white/30">{orderRef}</span> · Questions? Contact the IEEE SB team.
                </p>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-cs-midnight text-white flex items-center justify-center">
                <div className="text-white/40 text-sm uppercase tracking-widest animate-pulse">Loading…</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
