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
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Admin Header */}
            <header className="bg-black/20 border-b border-white/10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-arctic-cyan/20 rounded flex items-center justify-center text-arctic-cyan">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold uppercase tracking-widest">Admin Dashboard</h1>
                            <p className="text-xs text-white/50 font-secondary">ORDER MANAGEMENT SYSTEM</p>
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors rounded border border-white/10"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase">Logout</span>
                    </button>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-arctic-cyan text-black font-bold uppercase tracking-wider hover:bg-white transition-colors rounded ml-4"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* Stats / Filters / Tabs */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                        {['all', 'pending', 'shipped', 'completed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${filter === f ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-white/60 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {/* View Switcher */}
                    <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                        <button
                            onClick={() => setView('orders')}
                            className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${view === 'orders' ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-white/60 hover:text-white'}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setView('products')}
                            className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition-all ${view === 'products' ? 'bg-arctic-cyan text-black shadow-lg shadow-arctic-cyan/20' : 'text-white/60 hover:text-white'}`}
                        >
                            Products
                        </button>
                    </div>
                </div>

                {view === 'orders' ? (
                    /* Orders Table */
                    <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden backdrop-blur-sm">
                        {isLoading ? (
                            <div className="p-12 text-center text-white/40">Loading orders data...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-12 text-center text-white/40">No orders found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-white/50 font-secondary">
                                        <tr>
                                            <th className="p-4">Order ID</th>
                                            <th className="p-4">Customer</th>
                                            <th className="p-4">Items</th>
                                            <th className="p-4">Total</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 font-secondary text-sm text-white/60">#{order.id.slice(0, 8)}</td>
                                                <td className="p-4">
                                                    <div className="font-bold">{order.customer_name}</div>
                                                    <div className="text-xs text-white/50">{order.email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-white/80">
                                                    {order.items.map((item: any, i: number) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <span className="text-arctic-cyan font-bold">{item.quantity}x</span>
                                                            <span>{item.name}</span>
                                                            <span className="text-xs opacity-50">({item.selectedSize})</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="p-4 font-secondary font-bold text-arctic-cyan">LKR {order.total}</td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                                        {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                                                        {order.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="relative inline-block group">
                                                        <button className="p-2 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                                                            <ChevronDown className="w-4 h-4" />
                                                        </button>
                                                        {/* Dropdown */}
                                                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#1a2333] border border-white/20 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col p-1">
                                                            {['pending', 'shipped', 'completed'].map(s => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => updateStatus(order.id, s)}
                                                                    className="text-left px-3 py-2 text-xs uppercase font-bold hover:bg-white/10 rounded text-white/80 hover:text-white"
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
                    <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-widest text-white/50 font-secondary">
                                    <tr>
                                        <th className="p-4">Image</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Collection</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <div className="w-12 h-12 bg-white/5 rounded overflow-hidden relative">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="p-4 font-bold">{product.name}</td>
                                            <td className="p-4 text-sm opacity-60 uppercase">{product.collection}</td>
                                            <td className="p-4 font-secondary text-arctic-cyan">LKR {product.price}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleSoldOut(product.id, product.sold_out)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${product.sold_out
                                                        ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20'
                                                        : 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20'
                                                        }`}
                                                >
                                                    {product.sold_out ? 'Sold Out' : 'In Stock'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-white/40">No products found.</td>
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#0f172a] border border-white/20 p-8 rounded-sm w-full max-w-lg relative animate-in fade-in zoom-in duration-300">
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-black uppercase tracking-wider mb-6">Add New Product</h2>

                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div>
                                    <label className="text-xs uppercase font-bold text-white/60 block mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase font-bold text-white/60 block mb-2">Description</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProduct.desc}
                                        onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs uppercase font-bold text-white/60 block mb-2">Price (LKR)</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="99.99"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs uppercase font-bold text-white/60 block mb-2">Collection</label>
                                        <select
                                            value={newProduct.collection}
                                            onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                                            className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none appearance-none"
                                        >
                                            <option value="main">Main Store</option>
                                            <option value="codesprint">CodeSprint</option>
                                            <option value="ix">IX &apos;26</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase font-bold text-white/60 block mb-2">Product Image</label>
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
                                            className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-arctic-cyan file:text-black hover:file:bg-white transition-all"
                                        />
                                        <div className="text-center my-2 text-xs text-white/40 font-secondary">- OR -</div>
                                        <input
                                            type="text"
                                            placeholder="Enter Image URL manually..."
                                            value={newProduct.image}
                                            onChange={(e) => {
                                                setNewProduct({ ...newProduct, image: e.target.value });
                                                setImageFile(null);
                                            }}
                                            className="w-full bg-black/20 border border-white/10 p-3 rounded text-white focus:border-arctic-cyan outline-none text-xs"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors mt-4 disabled:opacity-50"
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
