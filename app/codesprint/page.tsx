import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import SmoothScroll from '../../components/SmoothScroll';
import CodeSprintHero from '../../components/codesprint/CodeSprintHero';
import DropMarquee from '../../components/codesprint/DropMarquee';
import CollectionDetails from '../../components/codesprint/CollectionDetails';
import FinalCall from '../../components/codesprint/FinalCall';

import { supabase } from '@/lib/supabase';

export const revalidate = 0;

// The CS11 lineup. Shown whenever the Supabase codesprint collection is empty,
// so the storefront never renders without the real merch. Prices are
// placeholders — set the real ones when adding products via Admin.
const IMG = '/images/codesprint-merch-images/cut';
const CS11_FALLBACK_PRODUCTS = [
    { id: -1, name: 'CS11 Zip Hoodie', description: 'Heavyweight zip hoodie · signal-orange drawstrings', price: 4500, image: `${IMG}/hoodie-black-orange-lace.png`, sold_out: false },
    { id: -2, name: 'Ember Jersey', description: 'All-over sublimation · black-to-ember fade', price: 3000, image: `${IMG}/tee-sublimation-v5.png`, sold_out: false },
    { id: -3, name: 'Dream Tee — Black', description: 'Premium cotton · astronaut back print', price: 2500, image: `${IMG}/tee-minimal-black-v3.png`, sold_out: false },
    { id: -4, name: 'Dream Tee — White', description: 'Premium cotton · astronaut back print', price: 2500, image: `${IMG}/tee-minimal-white-v2.png`, sold_out: false },
    { id: -5, name: 'Spine Tee — Black', description: 'Premium cotton · vertical spine print', price: 2500, image: `${IMG}/tee-minimal-black-v5.png`, sold_out: false },
    { id: -6, name: 'Spine Tee — White', description: 'Premium cotton · vertical spine print', price: 2500, image: `${IMG}/tee-minimal-white-v4.png`, sold_out: false },
];

export default async function CodesprintPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    return (
        <main className="min-h-screen bg-cs11-bg text-white">
            <SmoothScroll />
            <Header />
            <CodeSprintHero />
            <DropMarquee />
            <ProductGrid products={products?.length ? products : CS11_FALLBACK_PRODUCTS} />
            <CollectionDetails />
            <FinalCall />
            <Footer />
        </main>
    );
}
