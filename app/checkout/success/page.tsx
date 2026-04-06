'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    CheckCircle, Download, ArrowLeft, Package, MapPin, Mail, Hash,
    Upload, FileImage, X, Loader2, ShieldCheck, Copy, CheckCheck, AlertCircle
} from 'lucide-react';

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

function ReceiptUpload({ orderId, orderRef, total }: { orderId: string; orderRef: string; total: number }) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

            setUploaded(true);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (uploaded) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/40">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase">Receipt Uploaded!</h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                    Your payment receipt has been submitted successfully. Our team will verify your payment and update your order status within 24 hours.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Awaiting Verification
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Payment reminder */}
            <div className="bg-[#0d1a2e] border border-arctic-cyan/20 rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-arctic-cyan/10 border-b border-arctic-cyan/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-arctic-cyan animate-pulse" />
                        <span className="text-arctic-cyan text-xs font-bold uppercase tracking-widest">Transfer to This Account</span>
                    </div>
                    <span className="text-arctic-cyan font-mono font-black text-sm">LKR {total.toFixed(2)}</span>
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
                                <p className={`font-mono font-bold text-sm ${highlight ? 'text-arctic-cyan' : 'text-white'}`}>{value}</p>
                            </div>
                            {copyable && (
                                <button
                                    onClick={() => copyToClipboard(value, label)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-arctic-cyan/20 text-white/40 hover:text-arctic-cyan transition-all text-xs font-bold border border-white/10 hover:border-arctic-cyan/30"
                                >
                                    {copiedField === label
                                        ? <><CheckCheck className="w-3.5 h-3.5 text-arctic-cyan" /> Copied</>
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
                        className="border-2 border-dashed border-white/15 hover:border-arctic-cyan/50 rounded-xl p-10 text-center cursor-pointer transition-all group hover:bg-arctic-cyan/5"
                    >
                        <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-arctic-cyan/10 transition-colors">
                            <Upload className="w-6 h-6 text-white/30 group-hover:text-arctic-cyan transition-colors" />
                        </div>
                        <p className="text-white/60 font-bold text-sm mb-1">Drop your receipt here or <span className="text-arctic-cyan underline">browse</span></p>
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
                                    <Image src={preview} alt="Receipt preview" fill className="object-cover" />
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
                            className="w-full py-3.5 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-arctic-cyan/20"
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
                setOrder(JSON.parse(atob(decodeURIComponent(raw))));
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

            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, pageW, pageH, 'F');

            doc.setFillColor(22, 32, 56);
            doc.rect(0, 0, pageW, 90, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(0, 212, 255);
            doc.text('IEEE SB', margin, 38);
            doc.setFontSize(9);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'normal');
            doc.text('MERCH STORE', margin, 52);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(28);
            doc.setTextColor(255, 255, 255);
            doc.text('INVOICE', pageW - margin, 42, { align: 'right' });
            doc.setFontSize(10);
            doc.setTextColor(0, 212, 255);
            doc.setFont('helvetica', 'normal');
            doc.text(orderRef, pageW - margin, 58, { align: 'right' });
            doc.setTextColor(150, 160, 180);
            doc.setFontSize(9);
            doc.text(order ? formatDate(order.createdAt) : formatDate(new Date().toISOString()), pageW - margin, 72, { align: 'right' });

            doc.setDrawColor(0, 212, 255);
            doc.setLineWidth(1.5);
            doc.line(margin, 100, pageW - margin, 100);

            let y = 124;

            if (order) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                doc.setTextColor(0, 212, 255);
                doc.text('BILLED TO', margin, y);
                doc.setFontSize(12);
                doc.setTextColor(255, 255, 255);
                doc.text(order.customerName, margin, y + 16);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(150, 160, 180);
                doc.text(order.email, margin, y + 30);
                doc.text(order.address, margin, y + 43);
                doc.text(`${order.city}, ${order.postalCode}`, margin, y + 56);

                const rx = pageW - margin;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                doc.setTextColor(0, 212, 255);
                doc.text('ORDER DETAILS', rx, y, { align: 'right' });

                [['Order Ref', orderRef], ['Date', formatDate(order.createdAt)], ['Status', 'CONFIRMED'], ['Payment', 'Bank Transfer']].forEach(([label, value], i) => {
                    const ly = y + 16 + i * 14;
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(9);
                    doc.setTextColor(150, 160, 180);
                    doc.text(label, rx - 100, ly);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(label === 'Status' ? 0 : 255, label === 'Status' ? 212 : 255, label === 'Status' ? 255 : 255);
                    doc.text(value, rx, ly, { align: 'right' });
                });
                y += 88;
            }

            doc.setDrawColor(40, 55, 80);
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageW - margin, y);
            y += 18;

            doc.setFillColor(22, 32, 56);
            doc.rect(margin, y - 6, contentW, 22, 'F');

            const cols = { item: margin + 10, size: margin + contentW * 0.52, qty: margin + contentW * 0.66, unit: margin + contentW * 0.78, total: pageW - margin - 6 };
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(0, 212, 255);
            doc.text('ITEM', cols.item, y + 8);
            doc.text('SIZE', cols.size, y + 8);
            doc.text('QTY', cols.qty, y + 8);
            doc.text('UNIT PRICE', cols.unit, y + 8);
            doc.text('TOTAL', cols.total, y + 8, { align: 'right' });
            y += 28;

            (order?.items ?? []).forEach((item, index) => {
                const rowH = 34;
                if (index % 2 === 0) { doc.setFillColor(20, 28, 46); doc.rect(margin, y - 6, contentW, rowH, 'F'); }
                const unitPrice = parsePrice(item.price);
                const lineTotal = unitPrice * item.quantity;
                const name = item.name.length > 38 ? item.name.substring(0, 38) + '…' : item.name;

                doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
                doc.text(name, cols.item, y + 6);
                if (item.selectedColor) { doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(150, 160, 180); doc.text(item.selectedColor, cols.item, y + 17); }

                if (item.selectedSize) {
                    doc.setDrawColor(0, 212, 255); doc.setLineWidth(0.5);
                    doc.roundedRect(cols.size, y - 1, 28, 14, 2, 2, 'S');
                    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(0, 212, 255);
                    doc.text(item.selectedSize, cols.size + 14, y + 8.5, { align: 'center' });
                }
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(220, 220, 235);
                doc.text(String(item.quantity), cols.qty + 8, y + 8, { align: 'center' });
                doc.text(`LKR ${unitPrice.toFixed(2)}`, cols.unit, y + 8);
                doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
                doc.text(`LKR ${lineTotal.toFixed(2)}`, cols.total, y + 8, { align: 'right' });
                y += rowH;
            });

            y += 10;
            doc.setDrawColor(40, 55, 80); doc.setLineWidth(0.5);
            doc.line(pageW - margin - 200, y, pageW - margin, y);
            y += 14;

            const totalsX = pageW - margin - 200;
            [['Subtotal', `LKR ${(order?.subtotal ?? 0).toFixed(2)}`], ['Shipping', `LKR ${(order?.shipping ?? 25).toFixed(2)}`]].forEach(([label, value]) => {
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(150, 160, 180); doc.text(label, totalsX, y);
                doc.setTextColor(220, 220, 235); doc.text(value, pageW - margin, y, { align: 'right' });
                y += 16;
            });

            doc.setFillColor(0, 50, 70);
            doc.rect(totalsX - 8, y - 10, 208, 26, 'F');
            doc.setDrawColor(0, 212, 255); doc.setLineWidth(0.8);
            doc.line(totalsX - 8, y - 10, totalsX + 200, y - 10);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
            doc.text('TOTAL', totalsX, y + 8);
            doc.setTextColor(0, 212, 255);
            doc.text(`LKR ${(order?.total ?? 0).toFixed(2)}`, pageW - margin, y + 8, { align: 'right' });
            y += 46;

            // Bank details section in PDF
            doc.setDrawColor(40, 55, 80); doc.setLineWidth(0.5);
            doc.line(margin, y, pageW - margin, y);
            y += 20;
            doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(0, 212, 255);
            doc.text('PAYMENT INSTRUCTIONS', margin, y);
            y += 14;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(150, 160, 180);
            doc.text(`Bank: ${BANK_DETAILS.bankName}  |  Account: ${BANK_DETAILS.accountName}`, margin, y); y += 12;
            doc.text(`Account No: ${BANK_DETAILS.accountNumber}  |  Branch: ${BANK_DETAILS.branch} (${BANK_DETAILS.branchCode})`, margin, y); y += 12;
            doc.setTextColor(0, 212, 255); doc.setFont('helvetica', 'bold');
            doc.text(`Payment Reference: ${orderRef}`, margin, y); y += 20;

            doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
            doc.text('Thank you for your order!', margin, y); y += 14;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(150, 160, 180);
            doc.text('Please transfer the exact amount and upload your receipt at the confirmation page.', margin, y); y += 12;
            doc.text('Your order will be processed once payment is verified by our team.', margin, y);

            doc.setFillColor(10, 16, 30);
            doc.rect(0, pageH - 44, pageW, 44, 'F');
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(80, 100, 130);
            doc.text('IEEE Student Branch — Merch Store', margin, pageH - 22);
            doc.text('This is a computer-generated invoice. No signature required.', pageW - margin, pageH - 22, { align: 'right' });

            doc.save(`Invoice_${orderRef}.pdf`);
        } catch (err) {
            console.error('PDF failed', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-arctic-cyan/8 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 space-y-10">

                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>

                {/* Success header */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-arctic-cyan/10 rounded-full flex items-center justify-center ring-1 ring-arctic-cyan/40 mb-6">
                        <CheckCircle className="w-9 h-9 text-arctic-cyan" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase mb-3">Order Placed!</h1>
                    <p className="text-white/50 text-base max-w-sm leading-relaxed">
                        Your order <span className="text-white font-mono font-bold">{orderRef}</span> has been received.
                        Complete your payment using the details below and upload your receipt.
                    </p>
                </div>

                {/* ── Invoice Card ── */}
                <div ref={invoiceRef} className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#0d1526] px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <Image src="/images/IEEE logo.png" alt="IEEE SB" width={32} height={32} className="object-contain" />
                            <div>
                                <p className="text-arctic-cyan font-black text-lg leading-none">IEEE SB</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-8 py-6 border-b border-white/10">
                            <div>
                                <p className="text-arctic-cyan text-[10px] font-bold uppercase tracking-widest mb-3">Billed To</p>
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
                                <p className="text-arctic-cyan text-[10px] font-bold uppercase tracking-widest mb-3">Order Info</p>
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
                    <div className="px-8 py-6 border-b border-white/10">
                        <p className="text-arctic-cyan text-[10px] font-bold uppercase tracking-widest mb-4">Order Items</p>
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
                                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
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
                                                ? <span className="text-arctic-cyan text-xs font-bold border border-arctic-cyan/40 bg-arctic-cyan/10 px-2 py-0.5 rounded-sm uppercase">{item.selectedSize}</span>
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
                    <div className="px-8 py-6 border-b border-white/10">
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
                                <div className="flex justify-between text-base font-bold pt-3 border-t border-white/10">
                                    <span className="text-white uppercase tracking-wide">Total</span>
                                    <span className="font-mono text-arctic-cyan text-lg">LKR {(order?.total ?? 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-[#0d1526] text-center">
                        <p className="text-white/30 text-xs">Use <span className="text-arctic-cyan font-mono font-bold">{orderRef}</span> as payment reference when transferring.</p>
                    </div>
                </div>

                {/* Download */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm"
                    >
                        <Download className="w-4 h-4" />
                        {downloading ? 'Generating…' : 'Download Invoice'}
                    </button>
                    <p className="text-white/30 text-xs">Keep this invoice for your records.</p>
                </div>

                {/* ── Receipt Upload Section ── */}
                <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-8 py-5 border-b border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 bg-arctic-cyan/10 rounded-lg flex items-center justify-center">
                            <Upload className="w-4 h-4 text-arctic-cyan" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">Upload Payment Receipt</h2>
                            <p className="text-white/40 text-xs mt-0.5">After transferring, upload your receipt here to confirm payment.</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <ReceiptUpload
                            orderId={String(order?.orderId ?? '')}
                            orderRef={orderRef}
                            total={order?.total ?? 0}
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
            <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
                <div className="text-white/40 text-sm uppercase tracking-widest animate-pulse">Loading…</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
