import ArcticHeader from '../../components/ArcticHeader';
import ArcticHero from '../../components/ArcticHero';
import ProductGrid from '../../components/ProductGrid';
import GraffitiFooter from '../../components/GraffitiFooter';

import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function CodesprintPage() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    if (error) {
        console.error('Error fetching codesprint products:', error);
    } else {
        console.log('Fetched codesprint products:', products);
    }

    return (
        <main className="min-h-screen bg-[#602000] text-white">
            <ArcticHeader />
            <ArcticHero theme="codesprint" />
            <ProductGrid theme="codesprint" products={products || undefined} />
            <GraffitiFooter theme="codesprint" />
        </main>
    );
}
