import ArcticHeader from '../../components/ArcticHeader';
import ArcticHero from '../../components/ArcticHero';
import ProductGrid from '../../components/ProductGrid';
import GraffitiFooter from '../../components/GraffitiFooter';

export default function CodesprintPage() {
    const codesprintProducts = [
        { id: 101, name: 'INFERNO ORANGE', desc: 'LIMITED EDITION HOODIE', price: '$89.99', image: '/images/hero.png' },
        { id: 102, name: 'MIDNIGHT EMBER', desc: 'TECH FLEECE', price: '$129.99', image: '/images/hero.png' },
        { id: 103, name: 'VOLCANIC DUST', desc: 'PRO PERFORMANCE TEE', price: '$49.99', image: '/images/hero.png' },
        { id: 104, name: 'OBSIDIAN FLARE', desc: 'TRACK JACKET', price: '$149.99', image: '/images/product_1.png' },
        { id: 105, name: 'SOLAR WINDBREAKER', desc: 'LIGHTWEIGHT SHIELD', price: '$99.99', image: '/images/product_1.png' },
        { id: 106, name: 'MAGMA BLACK', desc: 'UTILITY CARGO', price: '$109.99', image: '/images/product_1.png' },
        { id: 107, name: 'EMBER CORE', desc: 'THERMAL LAYER', price: '$79.99', image: '/images/product_1.png' },
    ];

    return (
        <main className="min-h-screen bg-[#602000] text-white">
            <ArcticHeader />
            <ArcticHero theme="codesprint" />
            <ProductGrid theme="codesprint" products={codesprintProducts} />
            <GraffitiFooter theme="codesprint" />
        </main>
    );
}
