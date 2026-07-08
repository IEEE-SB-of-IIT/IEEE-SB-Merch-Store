import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SmoothScroll from '../../../components/SmoothScroll';
import DropMarquee from '../../../components/codesprint/DropMarquee';
import ShopCollection from '../../../components/codesprint/ShopCollection';
import { CS11_FALLBACK_PRODUCTS } from '../../../constants/cs11Products';

import { supabase } from '@/lib/supabase';

// Serve a cached page and refresh product data in the background at most
// every 60s — keeps TTFB fast without a Supabase round-trip per request.
export const revalidate = 60;

export const metadata = {
    title: 'Shop — CodeSprint 11 × Cicada | IEEE SB IIT',
    description: 'The full CodeSprint 11 × Cicada drop — every piece, one numbered run. Official IEEE SB IIT merchandise.',
};

export default async function ShopPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    return (
        <main className="min-h-screen bg-cs11-bg text-white">
            <SmoothScroll />
            <Header />
            <ShopCollection products={products?.length ? products : CS11_FALLBACK_PRODUCTS} />
            <DropMarquee />
            <Footer />
        </main>
    );
}
