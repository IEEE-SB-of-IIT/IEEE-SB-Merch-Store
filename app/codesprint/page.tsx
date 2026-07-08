import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import Preloader from '../../components/Preloader';
import SmoothScroll from '../../components/SmoothScroll';
import HeroReveal from '../../components/HeroReveal';
import DropMarquee from '../../components/codesprint/DropMarquee';
import CollectionDetails from '../../components/codesprint/CollectionDetails';
import FlightPath from '../../components/codesprint/FlightPath';
import LaunchScene from '../../components/codesprint/LaunchScene';
import FinalCall from '../../components/codesprint/FinalCall';
import { CS11_FALLBACK_PRODUCTS, HOME_MERCH_NAMES } from '../../constants/cs11Products';

import { supabase } from '@/lib/supabase';

// Serve a cached page and refresh product data in the background at most
// every 60s — keeps TTFB fast without a Supabase round-trip per request.
export const revalidate = 60;

// Home page always shows the original 4-piece lineup, pulled live from
// Supabase so price/sold-out edits reflect immediately — scoped by base merch
// name so products added via Admin only surface on the shop page, never here.
// Base-name matching (any dash style) keeps this resilient to colorway
// suffixes and minor renames, unlike an exact-name DB filter.
const HOME_BASES = HOME_MERCH_NAMES.map((n) => n.toLowerCase());
const baseNameOf = (name: string) => name.split(/\s+[—–-]\s+/)[0].trim().toLowerCase();

export default async function CodesprintPage() {
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('collection', 'codesprint');

    const homeProducts = (products ?? [])
        .filter((p) => HOME_BASES.includes(baseNameOf(p.name)))
        // Stable sort → lineup order fixed, colorways keep their DB order
        .sort((a, b) => HOME_BASES.indexOf(baseNameOf(a.name)) - HOME_BASES.indexOf(baseNameOf(b.name)));

    return (
        <main className="min-h-screen bg-cs11-bg text-white">
            <Preloader />
            <SmoothScroll />
            <Header />
            <HeroReveal />
            <DropMarquee />
            {/* Flight plan: trajectory draws with scroll, rocket descends into the launch scene */}
            <div className="relative">
                <FlightPath />
                <ProductGrid products={homeProducts.length ? homeProducts : CS11_FALLBACK_PRODUCTS} />
                <CollectionDetails />
                <LaunchScene />
            </div>
            <FinalCall />
            <Footer />
        </main>
    );
}
