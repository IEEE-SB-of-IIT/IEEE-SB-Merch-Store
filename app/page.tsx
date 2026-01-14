import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import VisionSection from '../components/VisionSection';
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
        <main className="min-h-screen">
            <Header />
            <ScrollReveal>
                <Hero />
            </ScrollReveal>
            <DigitalSystemSection />
            <ScrollReveal delay={0.2}>
                <ProductGrid products={products || undefined} />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
                <VisionSection />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
                <Footer />
            </ScrollReveal>
        </main>
    );
}
