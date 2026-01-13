import ArcticHeader from '../components/ArcticHeader';
import ArcticHero from '../components/ArcticHero';
import ProductGrid from '../components/ProductGrid';
import GraffitiFooter from '../components/GraffitiFooter';
import ScrollReveal from '../components/ScrollReveal';

import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable static caching for dynamic data

export default async function Home() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'main');
    return (
        <main className="min-h-screen bg-arctic-base text-white">
            <ArcticHeader />
            <ScrollReveal>
                <ArcticHero />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <ProductGrid products={products || undefined} />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
                <GraffitiFooter />
            </ScrollReveal>
        </main>
    );
}
