import ArcticHeader from '../components/ArcticHeader';
import ArcticHero from '../components/ArcticHero';
import ProductGrid from '../components/ProductGrid';
import GraffitiFooter from '../components/GraffitiFooter';

export default function Home() {
    return (
        <main className="min-h-screen bg-arctic-base text-white">
            <ArcticHeader />
            <ArcticHero />
            <ProductGrid />
            <GraffitiFooter />
        </main>
    );
}
