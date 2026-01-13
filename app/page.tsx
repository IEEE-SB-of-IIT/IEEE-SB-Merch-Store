import ArcticHeader from '../components/ArcticHeader';
import ArcticHero from '../components/ArcticHero';
import ProductGrid from '../components/ProductGrid';
import GraffitiFooter from '../components/GraffitiFooter';
import ColdSection from '../components/ColdSection';
import ScrollReveal from '../components/ScrollReveal';
import DigitalSystemSection from '../components/DigitalSystemSection';
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
            <DigitalSystemSection />
            <ScrollReveal delay={0.2}>
                <ProductGrid products={products || undefined} />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <ColdSection />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
                <GraffitiFooter />
            </ScrollReveal>
        </main>
    );
}
