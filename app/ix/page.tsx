import ArcticHeader from '../../components/ArcticHeader';
import ArcticHero from '../../components/ArcticHero';
import ProductGrid from '../../components/ProductGrid';
import GraffitiFooter from '../../components/GraffitiFooter';

export default function IXPage() {
    // Custom IX products if needed, otherwise it will use default
    const ixProducts = [
        { id: 201, name: 'NEON PROTOCOL', desc: 'CYBER PUNK SHELL', price: '$199.99', image: '/images/hero.png' },
        { id: 202, name: 'VAPOR WAVE', desc: 'HOLOGRAPHIC PUFFER', price: '$149.99', image: '/images/hero.png' },
        { id: 203, name: 'SYNTH RUNNER', desc: 'PERFORMANCE LAYER', price: '$89.99', image: '/images/hero.png' },
        { id: 204, name: 'GLITCH WEAR', desc: 'ANTI-SURVEILLANCE', price: '$299.99', image: '/images/product_1.png' },
        { id: 205, name: 'DIGITAL DUST', desc: 'TECH HOODIE', price: '$119.99', image: '/images/product_1.png' },
        { id: 206, name: 'SYSTEM SHOCK', desc: 'UTILITY VEST', price: '$159.99', image: '/images/product_1.png' },
        { id: 207, name: 'ZERO DAY', desc: 'LIMITED EDITION', price: '$399.99', image: '/images/product_1.png' },
    ];

    return (
        <main className="min-h-screen bg-[#450a25] text-white">
            <ArcticHeader />
            <ArcticHero theme="ix" />
            <ProductGrid theme="ix" products={ixProducts} />
            <GraffitiFooter theme="ix" />
        </main>
    );
}
