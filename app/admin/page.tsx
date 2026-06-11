'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    LogOut, ChevronDown, CheckCircle, Clock, Truck,
    Plus, X, AlertCircle, BarChart3, Filter, Search,
    TrendingUp, ShoppingBag, DollarSign, AlertTriangle, ChevronUp,
    ShieldCheck, ShieldX, Receipt, ExternalLink, Eye
} from 'lucide-react';

interface OrderItem {
    id: string;
    productId: number;
    name: string;
    price: string;
    image: string;
    selectedColor: string;
    selectedSize: string;
    quantity: number;
}

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    email: string;
    total: number;
    status: string;
    items: OrderItem[];
    address: string;
    city: string;
    payment_status: string | null;
    receipt_url: string | null;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    collection: string;
    sold_out: boolean;
}

// ── Payment status helpers ───────────────────────────────────────────────────

function getPaymentStyle(status: string | null) {
    switch (status) {
        case 'verified': return { cls: 'text-green-400 border-green-400/30 bg-green-400/10', label: 'Verified' };
        case 'rejected': return { cls: 'text-red-400 border-red-400/30 bg-red-400/10', label: 'Rejected' };
        case 'receipt_uploaded': return { cls: 'text-blue-400 border-blue-400/30 bg-blue-400/10', label: 'Receipt Uploaded' };
        default: return { cls: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', label: 'Awaiting Payment' };
    }
}

function PaymentCell({
    order, onVerify, onReject, onPreview
}: {
    order: { payment_status: string | null; receipt_url: string | null };
    onVerify: () => void;
    onReject: () => void;
    onPreview: (url: string) => void;
}) {
    const ps = order.payment_status ?? 'awaiting_payment';
    const { cls, label } = getPaymentStyle(ps);

    return (
        <div className="space-y-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${cls}`}>
                {ps === 'verified' && <ShieldCheck className="w-3 h-3" />}
                {ps === 'rejected' && <ShieldX className="w-3 h-3" />}
                {ps === 'receipt_uploaded' && <Receipt className="w-3 h-3" />}
                {ps === 'awaiting_payment' && <Clock className="w-3 h-3" />}
                {label}
            </span>

            {/* Receipt thumbnail + actions */}
            {order.receipt_url && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPreview(order.receipt_url!)}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                        <Eye className="w-3 h-3" /> View
                    </button>
                    <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                    >
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}

            {/* Verify / Reject — only when receipt uploaded and not yet actioned */}
            {ps === 'receipt_uploaded' && (
                <div className="flex gap-1.5">
                    <button
                        onClick={onVerify}
                        className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        <ShieldCheck className="w-3 h-3" /> Verify
                    </button>
                    <button
                        onClick={onReject}
                        className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        <ShieldX className="w-3 h-3" /> Reject
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Analytics helpers ────────────────────────────────────────────────────────

interface SizeBreakdown {
    S: number; M: number; L: number; XL: number; [key: string]: number;
}

interface ProductStat {
    productName: string;
    totalQty: number;
    sizes: SizeBreakdown;
    colors: Record<string, number>;
    revenue: number;
}

const SIZES = ['S', 'M', 'L', 'XL'];

function buildProductStats(orders: Order[]): ProductStat[] {
    const map: Record<string, ProductStat> = {};

    for (const order of orders) {
        for (const item of order.items ?? []) {
            const key = item.name;
            if (!map[key]) {
                map[key] = {
                    productName: key,
                    totalQty: 0,
                    sizes: { S: 0, M: 0, L: 0, XL: 0 },
                    colors: {},
                    revenue: 0,
                };
            }
            const stat = map[key];
            stat.totalQty += item.quantity;

            const size = (item.selectedSize ?? '').toUpperCase();
            if (size) stat.sizes[size] = (stat.sizes[size] ?? 0) + item.quantity;

            const color = item.selectedColor ?? 'Default';
            stat.colors[color] = (stat.colors[color] ?? 0) + item.quantity;

            const unitPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            stat.revenue += unitPrice * item.quantity;
        }
    }

    return Object.values(map).sort((a, b) => b.totalQty - a.totalQty);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [view, setView] = useState<'orders' | 'products' | 'analytics'>('orders');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Order search / filter state
    const [orderSearch, setOrderSearch] = useState('');
    const [sizeFilter, setSizeFilter] = useState('all');
    const [productFilter, setProductFilter] = useState('all');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [showOrderFilters, setShowOrderFilters] = useState(false);

    // Analytics sort
    const [analyticsSortDir, setAnalyticsSortDir] = useState<'desc' | 'asc'>('desc');
    const [analyticsSortKey, setAnalyticsSortKey] = useState<'totalQty' | 'revenue'>('totalQty');

    // Products State
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', desc: '', price: '', image: '', collection: 'codesprint' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (data) setOrders(data);
        setIsLoading(false);
    };

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (data) setProducts(data);
    };

    useEffect(() => {
        if (user) { fetchOrders(); fetchProducts(); }
    }, [user]);

    const deleteProduct = async (id: number) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) { setProducts(prev => prev.filter(p => p.id !== id)); showToast('Product deleted.'); }
        else showToast('Error: ' + error.message, 'error');
        setConfirmDelete(null);
    };

    const toggleSoldOut = async (id: number, current: boolean) => {
        const { error } = await supabase.from('products').update({ sold_out: !current }).eq('id', id);
        if (!error) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, sold_out: !current } : p));
            showToast(`Marked as ${!current ? 'sold out' : 'in stock'}.`);
        } else showToast('Error updating status.', 'error');
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const verifyPayment = async (id: string, action: 'verify' | 'reject') => {
        // Always read the freshest token from Supabase (the cached session can
        // be stale after a silent refresh).
        const { data: { session: live } } = await supabase.auth.getSession();
        const token = live?.access_token;
        if (!token) {
            showToast('Session expired. Please log in again.', 'error');
            router.push('/login');
            return;
        }

        const res = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId: id, action }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: data.payment_status } : o));
            const base = action === 'verify' ? 'Payment verified!' : 'Payment rejected.';
            showToast(data.emailSent ? `${base} Customer notified by email.` : `${base} (Email not sent — check RESEND_API_KEY.)`);
        } else if (res.status === 401) {
            showToast('Session expired. Please log in again.', 'error');
            router.push('/login');
        } else {
            showToast('Error updating payment status.', 'error');
        }
    };

    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [paymentFilter, setPaymentFilter] = useState('all');

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        let imageUrl = newProduct.image;

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
            if (uploadError) { showToast('Upload error: ' + uploadError.message, 'error'); setIsSubmitting(false); return; }
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
            imageUrl = publicUrl;
        }

        const { error } = await supabase.from('products').insert([{
            name: newProduct.name, description: newProduct.desc,
            price: parseFloat(newProduct.price.replace(/[^0-9.]/g, '')),
            image: imageUrl, collection: newProduct.collection
        }]);

        if (!error) {
            setIsProductModalOpen(false);
            setNewProduct({ name: '', desc: '', price: '', image: '', collection: 'codesprint' });
            setImageFile(null);
            showToast('Product added!');
            fetchProducts();
        } else showToast('Error: ' + error.message, 'error');
        setIsSubmitting(false);
    };

    const getStatusColor = (s: string) => {
        if (s === 'completed') return 'text-green-400 border-green-400/30 bg-green-400/10';
        if (s === 'shipped') return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    };

    // ── Derived data ────────────────────────────────────────────────────────

    // All unique product names across all orders (for filter dropdown)
    const allOrderedProductNames = useMemo(() => {
        const names = new Set<string>();
        orders.forEach(o => o.items?.forEach(i => names.add(i.name)));
        return Array.from(names).sort();
    }, [orders]);

    // All unique collections across orders
    const allOrderedCollections = useMemo(() => {
        const cols = new Set<string>();
        orders.forEach(o => o.items?.forEach(i => {
            // derive collection from product list if possible
            const match = products.find(p => p.name === i.name);
            if (match) cols.add(match.collection);
        }));
        return Array.from(cols).sort();
    }, [orders, products]);

    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Status filter
            if (statusFilter !== 'all' && order.status !== statusFilter) return false;

            // Payment status filter
            if (paymentFilter !== 'all') {
                const ps = order.payment_status ?? 'awaiting_payment';
                if (ps !== paymentFilter) return false;
            }

            // Search (customer name or email)
            if (orderSearch.trim()) {
                const q = orderSearch.toLowerCase();
                if (!order.customer_name.toLowerCase().includes(q) && !order.email.toLowerCase().includes(q)) return false;
            }

            // Size filter — order must contain at least one item with this size
            if (sizeFilter !== 'all') {
                const hasSz = order.items?.some(i => (i.selectedSize ?? '').toUpperCase() === sizeFilter);
                if (!hasSz) return false;
            }

            // Product filter — order must contain this product
            if (productFilter !== 'all') {
                const hasProd = order.items?.some(i => i.name === productFilter);
                if (!hasProd) return false;
            }

            // Collection filter
            if (collectionFilter !== 'all') {
                const hasColl = order.items?.some(i => {
                    const match = products.find(p => p.name === i.name);
                    return match?.collection === collectionFilter;
                });
                if (!hasColl) return false;
            }

            return true;
        });
    }, [orders, statusFilter, paymentFilter, orderSearch, sizeFilter, productFilter, collectionFilter, products]);

    // Active filter count for badge
    const activeFilterCount = [
        statusFilter !== 'all',
        orderSearch.trim() !== '',
        sizeFilter !== 'all',
        productFilter !== 'all',
        collectionFilter !== 'all',
        paymentFilter !== 'all',
    ].filter(Boolean).length;

    // Stats cards
    const totalRevenue = orders.reduce((s, o) => s + (o.total ?? 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const pendingReceiptsCount = orders.filter(o => o.payment_status === 'receipt_uploaded').length;
    const allItems = orders.flatMap(o => o.items ?? []);
    const topProduct = buildProductStats(orders)[0];

    // Analytics data
    const productStats = useMemo(() => {
        const stats = buildProductStats(orders);
        return [...stats].sort((a, b) =>
            analyticsSortDir === 'desc'
                ? b[analyticsSortKey] - a[analyticsSortKey]
                : a[analyticsSortKey] - b[analyticsSortKey]
        );
    }, [orders, analyticsSortKey, analyticsSortDir]);

    // Per-size totals across ALL orders
    const globalSizeBreakdown = useMemo(() => {
        const breakdown: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0 };
        allItems.forEach(i => {
            const sz = (i.selectedSize ?? '').toUpperCase();
            if (sz) breakdown[sz] = (breakdown[sz] ?? 0) + i.quantity;
        });
        return breakdown;
    }, [allItems]);

    const totalSizeQty = Object.values(globalSizeBreakdown).reduce((a, b) => a + b, 0);

    if (authLoading || !user) return (
        <div className="min-h-screen bg-cs11-bg flex items-center justify-center text-white">
            Loading System...
        </div>
    );

    return (
        <div className="min-h-screen bg-cs11-bg text-white font-manrope text-base">

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300 ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-green-500/20 border-green-500/30 text-green-300'}`}>
                    {toast.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                    <span className="text-sm font-semibold">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-black/20 border-b border-white/10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-2">
                            <Image src="/images/favicon.webp" alt="CodeSprint 11" width={32} height={32} className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-sm text-white/50">CodeSprint 11 · Order Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={signOut} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors rounded-lg border border-white/10">
                            <LogOut className="w-5 h-5" />
                            <span className="font-semibold">Logout</span>
                        </button>
                        <button onClick={() => setIsProductModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-cs11-orange text-black font-bold hover:bg-white transition-colors rounded-lg shadow-lg shadow-cs11-orange/20">
                            <Plus className="w-5 h-5" />
                            Add Product
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-cs11-orange', bg: 'bg-cs11-orange/10' },
                        { label: 'Total Revenue', value: `LKR ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
                        { label: 'Receipts to Verify', value: pendingReceiptsCount, icon: Receipt, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                        { label: 'Pending Orders', value: pendingCount, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                            <div className={`w-11 h-11 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">{label}</p>
                                <p className={`font-bold text-lg ${color} truncate`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                        {(['orders', 'products', 'analytics'] as const).map(v => (
                            <button key={v} onClick={() => setView(v)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all flex items-center gap-2 ${view === v ? 'bg-cs11-orange text-black shadow-lg shadow-cs11-orange/20' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                            >
                                {v === 'analytics' && <BarChart3 className="w-4 h-4" />}
                                {v}
                            </button>
                        ))}
                    </div>

                    {/* Status filter — only in orders view */}
                    {view === 'orders' && (
                        <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                            {['all', 'pending', 'shipped', 'completed'].map(f => (
                                <button key={f} onClick={() => setStatusFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${statusFilter === f ? 'bg-cs11-orange text-black' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── ORDERS VIEW ─────────────────────────────────────────────────── */}
                {view === 'orders' && (
                    <div className="space-y-4">

                        {/* Advanced Filters Bar */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setShowOrderFilters(v => !v)}
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Filter className="w-4 h-4 text-cs11-orange" />
                                    <span className="text-sm font-semibold text-white">Advanced Filters</span>
                                    {activeFilterCount > 0 && (
                                        <span className="px-2 py-0.5 bg-cs11-orange text-black text-xs font-bold rounded-full">
                                            {activeFilterCount} active
                                        </span>
                                    )}
                                </div>
                                {showOrderFilters ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                            </button>

                            {showOrderFilters && (
                                <div className="border-t border-white/10 px-5 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">

                                    {/* Customer search */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Search Customer</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                            <input
                                                type="text"
                                                placeholder="Name or email..."
                                                value={orderSearch}
                                                onChange={e => setOrderSearch(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-white/30 focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Size filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Size</label>
                                        <div className="flex gap-2">
                                            {['all', ...SIZES].map(sz => (
                                                <button
                                                    key={sz}
                                                    onClick={() => setSizeFilter(sz)}
                                                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${sizeFilter === sz ? 'bg-cs11-orange text-black border-cs11-orange' : 'bg-black/20 border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}
                                                >
                                                    {sz === 'all' ? 'All' : sz}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Product filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Product</label>
                                        <select
                                            value={productFilter}
                                            onChange={e => setProductFilter(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2.5 rounded-lg text-sm text-white focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none appearance-none transition-all"
                                        >
                                            <option value="all">All Products</option>
                                            {allOrderedProductNames.map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Collection filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Collection</label>
                                        <select
                                            value={collectionFilter}
                                            onChange={e => setCollectionFilter(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2.5 rounded-lg text-sm text-white focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none appearance-none transition-all"
                                        >
                                            <option value="all">All Collections</option>
                                            <option value="codesprint">CodeSprint</option>
                                        </select>
                                    </div>

                                    {/* Payment status filter */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Payment</label>
                                        <select
                                            value={paymentFilter}
                                            onChange={e => setPaymentFilter(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2.5 rounded-lg text-sm text-white focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none appearance-none transition-all"
                                        >
                                            <option value="all">All Payments</option>
                                            <option value="awaiting_payment">Awaiting Payment</option>
                                            <option value="receipt_uploaded">Receipt Uploaded</option>
                                            <option value="verified">Verified</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Filter result summary */}
                            {activeFilterCount > 0 && (
                                <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between bg-cs11-orange/5">
                                    <span className="text-xs text-cs11-orange font-semibold">
                                        Showing {filteredOrders.length} of {orders.length} orders
                                    </span>
                                    <button
                                        onClick={() => { setStatusFilter('all'); setOrderSearch(''); setSizeFilter('all'); setProductFilter('all'); setCollectionFilter('all'); setPaymentFilter('all'); }}
                                        className="text-xs text-white/50 hover:text-white transition-colors underline underline-offset-2"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                            {isLoading ? (
                                <div className="p-12 text-center text-white/50">Loading orders...</div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="p-12 text-center text-white/50">No orders match the current filters.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-black/20 border-b border-white/10 text-white/70 font-semibold text-sm">
                                            <tr>
                                                <th className="p-5">Order ID</th>
                                                <th className="p-5">Customer</th>
                                                <th className="p-5">Items</th>
                                                <th className="p-5">Total</th>
                                                <th className="p-5">Payment</th>
                                                <th className="p-5">Status</th>
                                                <th className="p-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-white/80">
                                            {filteredOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-white/[0.04] transition-colors">
                                                    <td className="p-5 text-sm text-white/50 font-mono">#{order.id.slice(0, 8)}</td>
                                                    <td className="p-5">
                                                        <div className="font-bold text-white">{order.customer_name}</div>
                                                        <div className="text-sm text-white/50">{order.email}</div>
                                                    </td>
                                                    <td className="p-5">
                                                        {order.items?.map((item, i) => (
                                                            <div key={i} className="flex flex-wrap gap-x-2 gap-y-1 items-center py-0.5">
                                                                <span className="text-cs11-orange font-bold text-sm">{item.quantity}×</span>
                                                                <span className="font-medium text-sm">{item.name}</span>
                                                                <span className="inline-flex items-center gap-1">
                                                                    {item.selectedSize && (
                                                                        <span className="text-[10px] font-bold border border-cs11-orange/40 bg-cs11-orange/10 text-cs11-orange px-1.5 py-0.5 rounded-sm uppercase">
                                                                            {item.selectedSize}
                                                                        </span>
                                                                    )}
                                                                    {item.selectedColor && item.selectedColor !== 'Default' && (
                                                                        <span className="text-[10px] text-white/50 border border-white/10 px-1.5 py-0.5 rounded-sm">
                                                                            {item.selectedColor}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="p-5 font-bold text-cs11-orange">LKR {order.total}</td>
                                                    <td className="p-5">
                                                        <PaymentCell
                                                            order={order}
                                                            onVerify={() => verifyPayment(order.id, 'verify')}
                                                            onReject={() => verifyPayment(order.id, 'reject')}
                                                            onPreview={url => setReceiptPreview(url)}
                                                        />
                                                    </td>
                                                    <td className="p-5">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold capitalize border ${getStatusColor(order.status)}`}>
                                                            {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                                            {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                                                            {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className="relative inline-block group">
                                                            <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                                                                <ChevronDown className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute right-0 top-full mt-2 w-40 bg-cs11-card border border-white/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col p-2">
                                                                {['pending', 'shipped', 'completed'].map(s => (
                                                                    <button key={s} onClick={() => updateStatus(order.id, s)}
                                                                        className="text-left px-4 py-2.5 text-sm font-semibold capitalize hover:bg-white/10 rounded-md text-white/80 hover:text-white"
                                                                    >
                                                                        Mark {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── PRODUCTS VIEW ────────────────────────────────────────────────── */}
                {view === 'products' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/20 border-b border-white/10 text-white/70 font-semibold text-sm">
                                    <tr>
                                        <th className="p-5">Image</th>
                                        <th className="p-5">Name</th>
                                        <th className="p-5">Collection</th>
                                        <th className="p-5">Price</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/80">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-white/[0.04] transition-colors">
                                            <td className="p-5">
                                                <div className="w-14 h-14 bg-white/5 rounded-lg overflow-hidden relative border border-white/10">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-5 font-bold text-white">{product.name}</td>
                                            <td className="p-5 text-sm text-white/50 capitalize">{product.collection}</td>
                                            <td className="p-5 font-bold text-cs11-orange">LKR {product.price}</td>
                                            <td className="p-5">
                                                <button onClick={() => toggleSoldOut(product.id, product.sold_out)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize border transition-all ${product.sold_out ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'}`}
                                                >
                                                    {product.sold_out ? 'Sold Out' : 'In Stock'}
                                                </button>
                                            </td>
                                            <td className="p-5 text-right">
                                                {confirmDelete === product.id ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className="text-xs text-white/50">Sure?</span>
                                                        <button onClick={() => deleteProduct(product.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                                                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-white/10 text-white/70 text-xs font-bold rounded-lg hover:bg-white/20 transition-colors">Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setConfirmDelete(product.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete Product">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr><td colSpan={6} className="p-12 text-center text-white/50">No products found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── ANALYTICS VIEW ──────────────────────────────────────────────── */}
                {view === 'analytics' && (
                    <div className="space-y-6">

                        {/* Global size breakdown */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-5">Global Size Demand</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {SIZES.map(sz => {
                                    const qty = globalSizeBreakdown[sz] ?? 0;
                                    const pct = totalSizeQty > 0 ? (qty / totalSizeQty) * 100 : 0;
                                    return (
                                        <div key={sz} className="bg-black/20 rounded-xl p-5 border border-white/5 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-2xl font-black text-cs11-orange">{sz}</span>
                                                <span className="text-xs text-white/50 font-mono">{pct.toFixed(1)}%</span>
                                            </div>
                                            <div className="text-3xl font-black text-white">{qty}</div>
                                            <div className="text-xs text-white/50">units ordered</div>
                                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-cs11-orange rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Per-product breakdown table */}
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-white/50">Per-Product Breakdown</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-white/40">Sort by:</span>
                                    <div className="flex gap-2">
                                        {(['totalQty', 'revenue'] as const).map(k => (
                                            <button key={k} onClick={() => {
                                                if (analyticsSortKey === k) setAnalyticsSortDir(d => d === 'desc' ? 'asc' : 'desc');
                                                else { setAnalyticsSortKey(k); setAnalyticsSortDir('desc'); }
                                            }}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${analyticsSortKey === k ? 'bg-cs11-orange text-black border-cs11-orange' : 'bg-black/20 border-white/10 text-white/50 hover:text-white'}`}
                                            >
                                                {k === 'totalQty' ? 'Qty' : 'Revenue'}
                                                {analyticsSortKey === k && (
                                                    analyticsSortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {productStats.length === 0 ? (
                                <div className="p-12 text-center text-white/50">No order data yet.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-black/20 border-b border-white/10 text-xs font-bold uppercase tracking-widest text-white/50">
                                            <tr>
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4 text-center">S</th>
                                                <th className="px-6 py-4 text-center">M</th>
                                                <th className="px-6 py-4 text-center">L</th>
                                                <th className="px-6 py-4 text-center">XL</th>
                                                <th className="px-6 py-4 text-center">Other</th>
                                                <th className="px-6 py-4 text-center">Total Qty</th>
                                                <th className="px-6 py-4 text-right">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {productStats.map((stat, idx) => {
                                                const otherQty = stat.totalQty - SIZES.reduce((s, sz) => s + (stat.sizes[sz] ?? 0), 0);
                                                const maxQty = productStats[0]?.totalQty ?? 1;
                                                const barPct = (stat.totalQty / maxQty) * 100;
                                                return (
                                                    <tr key={stat.productName} className={`hover:bg-white/[0.03] transition-colors ${idx === 0 ? 'bg-cs11-orange/5' : ''}`}>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {idx === 0 && <span className="text-[10px] font-bold text-cs11-orange bg-cs11-orange/10 border border-cs11-orange/30 px-1.5 py-0.5 rounded-sm">TOP</span>}
                                                                <div>
                                                                    <div className="font-bold text-white text-sm">{stat.productName}</div>
                                                                    {/* Colors */}
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {Object.entries(stat.colors)
                                                                            .filter(([c]) => c !== 'Default')
                                                                            .map(([color, qty]) => (
                                                                                <span key={color} className="text-[10px] text-white/50 border border-white/10 bg-white/5 px-1.5 py-0.5 rounded-sm">
                                                                                    {color}: {qty}
                                                                                </span>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {SIZES.map(sz => (
                                                            <td key={sz} className="px-6 py-4 text-center">
                                                                <span className={`inline-block min-w-[28px] font-mono font-bold text-sm ${(stat.sizes[sz] ?? 0) > 0 ? 'text-white' : 'text-white/20'}`}>
                                                                    {stat.sizes[sz] ?? 0}
                                                                </span>
                                                            </td>
                                                        ))}
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`font-mono font-bold text-sm ${otherQty > 0 ? 'text-white/50' : 'text-white/20'}`}>
                                                                {otherQty > 0 ? otherQty : 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <span className="font-black text-cs11-orange text-lg">{stat.totalQty}</span>
                                                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-cs11-orange rounded-full" style={{ width: `${barPct}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right font-mono font-bold text-green-400 text-sm">
                                                            LKR {stat.revenue.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        {/* Totals row */}
                                        <tfoot className="border-t border-white/20 bg-black/20">
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-white/70 text-sm uppercase tracking-wider">TOTAL</td>
                                                {SIZES.map(sz => (
                                                    <td key={sz} className="px-6 py-4 text-center font-bold text-cs11-orange">
                                                        {productStats.reduce((s, p) => s + (p.sizes[sz] ?? 0), 0)}
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 text-center font-bold text-white/50">
                                                    {productStats.reduce((s, p) => {
                                                        const known = SIZES.reduce((a, sz) => a + (p.sizes[sz] ?? 0), 0);
                                                        return s + (p.totalQty - known);
                                                    }, 0)}
                                                </td>
                                                <td className="px-6 py-4 text-center font-black text-cs11-orange text-lg">
                                                    {productStats.reduce((s, p) => s + p.totalQty, 0)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-green-400">
                                                    LKR {productStats.reduce((s, p) => s + p.revenue, 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Per-product size drill-down cards */}
                        {productStats.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4">Size Distribution per Product</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {productStats.map(stat => {
                                        const maxSizeQty = Math.max(...SIZES.map(sz => stat.sizes[sz] ?? 0), 1);
                                        return (
                                            <div key={stat.productName} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-white text-sm leading-tight">{stat.productName}</h3>
                                                    <span className="text-xs text-white/50 font-mono flex-shrink-0 ml-2">{stat.totalQty} total</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {SIZES.map(sz => {
                                                        const qty = stat.sizes[sz] ?? 0;
                                                        const pct = maxSizeQty > 0 ? (qty / maxSizeQty) * 100 : 0;
                                                        return (
                                                            <div key={sz} className="flex items-center gap-3">
                                                                <span className="text-xs font-bold text-cs11-orange w-6 flex-shrink-0">{sz}</span>
                                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full rounded-full transition-all duration-500"
                                                                        style={{
                                                                            width: `${pct}%`,
                                                                            backgroundColor: qty === Math.max(...SIZES.map(s => stat.sizes[s] ?? 0)) && qty > 0
                                                                                ? '#ff6a3d' : '#333333'
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className={`text-xs font-mono w-4 text-right flex-shrink-0 ${qty > 0 ? 'text-white' : 'text-white/20'}`}>{qty}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                {/* Color breakdown if any non-default */}
                                                {Object.entries(stat.colors).filter(([c]) => c !== 'Default').length > 0 && (
                                                    <div className="pt-3 border-t border-white/5">
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Colors</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {Object.entries(stat.colors)
                                                                .filter(([c]) => c !== 'Default')
                                                                .sort((a, b) => b[1] - a[1])
                                                                .map(([color, qty]) => (
                                                                    <span key={color} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white/70">
                                                                        {color} <span className="text-cs11-orange font-bold ml-1">{qty}</span>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Receipt Preview Modal */}
            {receiptPreview && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
                    onClick={() => setReceiptPreview(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Receipt className="w-5 h-5 text-cs11-orange" />
                                <span className="font-bold text-white">Payment Receipt</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={receiptPreview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> Open Full Size
                                </a>
                                <button
                                    onClick={() => setReceiptPreview(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="bg-cs11-card border border-white/20 rounded-xl overflow-hidden">
                            {receiptPreview.endsWith('.pdf') || receiptPreview.includes('application/pdf') ? (
                                <iframe src={receiptPreview} className="w-full h-[70vh]" title="Receipt PDF" />
                            ) : (
                                <div className="relative w-full" style={{ minHeight: '400px' }}>
                                    <Image
                                        src={receiptPreview}
                                        alt="Payment receipt"
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-cs11-card border border-white/20 p-8 rounded-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                        <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-white">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-white/70 block mb-2">Product Name</label>
                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-white/30 focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none transition-all"
                                    placeholder="e.g. IEEE T-Shirt" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/70 block mb-2">Description</label>
                                <input type="text" required value={newProduct.desc} onChange={e => setNewProduct({ ...newProduct, desc: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-white/30 focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none transition-all"
                                    placeholder="Brief product description" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-semibold text-white/70 block mb-2">Price (LKR)</label>
                                    <input type="text" required placeholder="2500.00" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-white/30 focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-white/70 block mb-2">Collection</label>
                                    <select value={newProduct.collection} onChange={e => setNewProduct({ ...newProduct, collection: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none appearance-none transition-all">
                                        <option value="codesprint">CodeSprint</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-white/70 block mb-2">Product Image</label>
                                <input type="file" accept="image/*"
                                    onChange={e => { if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setNewProduct({ ...newProduct, image: '' }); } }}
                                    className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white focus:border-cs11-orange outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cs11-orange file:text-black hover:file:bg-white transition-all cursor-pointer" />
                                <div className="text-center my-2 text-sm text-white/40">— OR —</div>
                                <input type="text" placeholder="Image URL..." value={newProduct.image}
                                    onChange={e => { setNewProduct({ ...newProduct, image: e.target.value }); setImageFile(null); }}
                                    className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-white/30 focus:border-cs11-orange focus:ring-1 focus:ring-cs11-orange outline-none transition-all" />
                            </div>
                            <button type="submit" disabled={isSubmitting}
                                className="w-full py-4 bg-cs11-orange text-black font-bold uppercase tracking-wider hover:bg-white transition-colors mt-2 rounded-lg shadow-lg shadow-cs11-orange/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Adding...' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
