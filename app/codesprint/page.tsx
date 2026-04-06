import VisionSection from '../../components/VisionSection';
import DigitalSystemSection from '../../components/DigitalSystemSection';
import ScrollReveal from '../../components/ScrollReveal';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';

import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function CodesprintPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    return (
        <main className="min-h-screen">
            <Header theme="codesprint" />
            <ScrollReveal>
                <Hero theme="codesprint" />
            </ScrollReveal>
            <DigitalSystemSection theme="codesprint" />
            <ScrollReveal delay={0.2}>
                <ProductGrid theme="codesprint" products={products || undefined} />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <VisionSection theme="codesprint" />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
                <Footer theme="codesprint" />
            </ScrollReveal>
        </main>
    );
}
