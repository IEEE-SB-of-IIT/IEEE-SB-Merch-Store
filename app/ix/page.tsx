import ArcticHeader from '../../components/ArcticHeader';
import ArcticHero from '../../components/ArcticHero';
import ProductGrid from '../../components/ProductGrid';
import GraffitiFooter from '../../components/GraffitiFooter';

import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function IXPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'ix');

    return (
        <main className="min-h-screen bg-[#450a25] text-white">
            <ArcticHeader />
            <ArcticHero theme="ix" />
            <ProductGrid theme="ix" products={products || undefined} />
            <GraffitiFooter theme="ix" />
        </main>
    );
}
