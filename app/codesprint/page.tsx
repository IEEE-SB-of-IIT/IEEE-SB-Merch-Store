import ScrollReveal from '../../components/ScrollReveal';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import SpaceParallaxBanner from '../../components/codesprint/SpaceParallaxBanner';
import CosmicFeatureStrip from '../../components/codesprint/CosmicFeatureStrip';
import MissionControlSection from '../../components/codesprint/MissionControlSection';
import WarpCallToAction from '../../components/codesprint/WarpCallToAction';

import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function CodesprintPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    return (
        <main className="min-h-screen font-tommy">
            <Header theme="codesprint" />
            <ScrollReveal>
                <Hero theme="codesprint" />
            </ScrollReveal>
            <SpaceParallaxBanner />
            <ScrollReveal delay={0.1}>
                <CosmicFeatureStrip />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
                <ProductGrid theme="codesprint" products={products || undefined} />
            </ScrollReveal>
            <MissionControlSection />
            <WarpCallToAction />
            <ScrollReveal delay={0.2}>
                <Footer theme="codesprint" />
            </ScrollReveal>
        </main>
    );
}
