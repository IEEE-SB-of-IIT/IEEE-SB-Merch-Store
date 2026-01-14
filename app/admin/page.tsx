'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, Package, Search, ChevronDown, CheckCircle, Clock, Truck, Plus, X, Upload } from 'lucide-react';

interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    email: string;
    total: number;
    status: string;
    items: any[];
    address: string;
    city: string;
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

export default function AdminPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [view, setView] = useState('orders'); // 'orders' or 'products'
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Products State
    const [products, setProducts] = useState<Product[]>([]);

    // New Product State
    const [newProduct, setNewProduct] = useState({
        name: '',
        desc: '',
        price: '',
        image: '',
        collection: 'main'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id', { ascending: false });

        if (data) setProducts(data);
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('Product deleted.');
        } else {
            alert('Error deleting product: ' + error.message);
        }
    };

    const toggleSoldOut = async (id: number, currentStatus: boolean) => {
        const { error } = await supabase
            .from('products')
            .update({ sold_out: !currentStatus })
            .eq('id', id);

        if (!error) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, sold_out: !currentStatus } : p));
        } else {
            console.error('Error updating status:', error);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let imageUrl = newProduct.image;

        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { data, error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, imageFile);

            if (uploadError) {
                alert('Error uploading image: ' + uploadError.message);
                setIsSubmitting(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const { error } = await supabase
            .from('products')
            .insert([{
                name: newProduct.name,
                description: newProduct.desc,
                price: parseFloat(newProduct.price.replace(/[^0-9.]/g, '')),
                image: imageUrl,
                collection: newProduct.collection
            }]);

        if (!error) {
            setIsProductModalOpen(false);
            setNewProduct({ name: '', desc: '', price: '', image: '', collection: 'main' });
            setImageFile(null);
            alert('Product added successfully!');
            fetchProducts(); // Refresh list
        } else {
            alert('Error adding product: ' + error.message);
        }
        setIsSubmitting(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 border-green-400/30 bg-green-400/10';
            case 'shipped': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
            default: return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
        }
    };

    if (authLoading || !user) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Loading System...</div>;

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-system text-base">
            {/* Admin Header */}
            <header className="bg-black/20 border-b border-white/10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-arctic-cyan/20 rounded-lg flex items-center justify-center text-arctic-cyan">
                            <Package className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white font-system">Admin Dashboard</h1>
                            <p className="text-sm text-slate-300 font-system">Order Management System</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors rounded-lg border border-white/10 font-system"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">Logout</span>
                    </button>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-arctic-cyan text-black font-bold hover:bg-white transition-colors rounded-lg ml-4 shadow-lg shadow-arctic-cyan/20 font-system"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* Stats / Filters / Tabs */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                        {['all', 'pending', 'shipped', 'completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-6 py-3 rounded-lg text-base font-semibold capitalize transition-all font-system ${filter === f ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {/* View Switcher */}
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                        <button
                            onClick={() => setView('orders')}
                            className={`px-6 py-3 rounded-lg text-base font-semibold transition-all font-system ${view === 'orders' ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setView('products')}
                            className={`px-6 py-3 rounded-lg text-base font-semibold transition-all font-system ${view === 'products' ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Products
                        </button>
                    </div>
                </div>

                {view === 'orders' ? (
                    /* Orders Table */
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                        {isLoading ? (
                            <div className="p-12 text-center text-slate-400 text-lg font-system">Loading orders data...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 text-lg font-system">No orders found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-black/20 border-b border-white/10 text-slate-300 font-semibold text-base font-system">
                                        <tr>
                                            <th className="p-6">Order ID</th>
                                            <th className="p-6">Customer</th>
                                            <th className="p-6">Items</th>
                                            <th className="p-6">Total</th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-200">
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-white/[0.04] transition-colors">
                                                <td className="p-6 text-base text-slate-400 font-system">#{order.id.slice(0, 8)}</td>
                                                <td className="p-6 font-system">
                                                    <div className="font-bold text-white text-lg">{order.customer_name}</div>
                                                    <div className="text-sm text-slate-400">{order.email}</div>
                                                </td>
                                                <td className="p-6 text-base font-system">
                                                    {order.items.map((item: any, i: number) => (
                                                        <div key={i} className="flex gap-2 items-center py-1">
                                                            <span className="text-arctic-cyan font-bold">{item.quantity}x</span>
                                                            <span className="font-medium">{item.name}</span>
                                                            <span className="text-sm text-slate-400">({item.selectedSize})</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="p-6 font-bold text-arctic-cyan text-lg font-system">LKR {order.total}</td>
                                                <td className="p-6 font-system">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold capitalize border ${getStatusColor(order.status)}`}>
                                                        {order.status === 'pending' && <Clock className="w-4 h-4" />}
                                                        {order.status === 'shipped' && <Truck className="w-4 h-4" />}
                                                        {order.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right font-system">
                                                    <div className="relative inline-block group">
                                                        <button className="p-3 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white">
                                                            <ChevronDown className="w-5 h-5" />
                                                        </button>
                                                        {/* Dropdown */}
                                                        <div className="absolute right-0 top-full mt-2 w-40 bg-[#1e293b] border border-white/20 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col p-2">
                                                            {['pending', 'shipped', 'completed'].map(s => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => updateStatus(order.id, s)}
                                                                    className="text-left px-4 py-3 text-sm font-semibold capitalize hover:bg-white/10 rounded-md text-slate-200 hover:text-white font-system"
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
                ) : (
                    /* Products Table */
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-black/20 border-b border-white/10 text-slate-300 font-semibold text-base font-system">
                                    <tr>
                                        <th className="p-6">Image</th>
                                        <th className="p-6">Name</th>
                                        <th className="p-6">Collection</th>
                                        <th className="p-6">Price</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-200">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-white/[0.04] transition-colors">
                                            <td className="p-6">
                                                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden relative border border-white/10">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-6 font-bold text-lg text-white font-system">{product.name}</td>
                                            <td className="p-6 text-base text-slate-400 capitalize font-system">{product.collection}</td>
                                            <td className="p-6 font-bold text-arctic-cyan text-lg font-system">LKR {product.price}</td>
                                            <td className="p-6 font-system">
                                                <button
                                                    onClick={() => toggleSoldOut(product.id, product.sold_out)}
                                                    className={`px-4 py-2 rounded-full text-sm font-bold capitalize border transition-all ${product.sold_out
                                                        ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                                        : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                                                        }`}
                                                >
                                                    {product.sold_out ? 'Sold Out' : 'In Stock'}
                                                </button>
                                            </td>
                                            <td className="p-6 text-right font-system">
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400 text-lg font-system">No products found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add Product Modal */}
            {
                isProductModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-[#1e293b] border border-white/20 p-8 rounded-xl w-full max-w-lg relative animate-in fade-in zoom-in duration-300 shadow-2xl">
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-white font-system">Add New Product</h2>

                            <form onSubmit={handleAddProduct} className="space-y-5">
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 font-system">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-slate-500 focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none transition-all font-system"
                                        placeholder="e.g. IEEE T-Shirt"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 font-system">Description</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.desc}
                                        onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-slate-500 focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none transition-all font-system"
                                        placeholder="Brief product description"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 font-system">Price (LKR)</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="2500.00"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-slate-500 focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none transition-all font-system"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-300 block mb-2 font-system">Collection</label>
                                        <select
                                            value={newProduct.collection}
                                            onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none appearance-none transition-all font-system"
                                        >
                                            <option value="main">Main Store</option>
                                            <option value="codesprint">CodeSprint</option>
                                            <option value="ix">IX &apos;26</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-300 block mb-2 font-system">Product Image</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setImageFile(e.target.files[0]);
                                                    setNewProduct({ ...newProduct, image: '' });
                                                }
                                            }}
                                            className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-arctic-cyan file:text-black hover:file:bg-white transition-all cursor-pointer font-system"
                                        />
                                        <div className="text-center my-2 text-sm text-slate-500 font-medium font-system">- OR -</div>
                                        <input
                                            type="text"
                                            placeholder="Enter Image URL manually..."
                                            value={newProduct.image}
                                            onChange={(e) => {
                                                setNewProduct({ ...newProduct, image: e.target.value });
                                                setImageFile(null);
                                            }}
                                            className="w-full bg-black/20 border border-white/10 p-3.5 rounded-lg text-white placeholder-slate-500 focus:border-arctic-cyan focus:ring-1 focus:ring-arctic-cyan outline-none transition-all font-system"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-arctic-cyan text-black font-bold uppercase tracking-wider hover:bg-white transition-colors mt-4 rounded-lg shadow-lg shadow-arctic-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed font-system"
                                >
                                    {isSubmitting ? 'Adding...' : 'Create Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
