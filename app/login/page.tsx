'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-sm border border-white/10 backdrop-blur-sm">

                <div className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer w-fit" onClick={() => router.push('/')}>
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-6 h-6 text-arctic-cyan" />
                        <h1 className="text-2xl font-black uppercase tracking-wider">Admin Access</h1>
                    </div>
                    <p className="text-white/60 text-sm">Restricted area. Authorized personnel only.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold tracking-wide">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-secondary">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors font-secondary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/60 font-secondary">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-sm p-3 focus:outline-none focus:border-arctic-cyan transition-colors font-secondary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-arctic-cyan text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                </form>
            </div>
        </div>
    );
}
