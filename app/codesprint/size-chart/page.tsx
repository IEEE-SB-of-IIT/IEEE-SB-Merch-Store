import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SmoothScroll from '../../../components/SmoothScroll';
import SizeCharts from '../../../components/codesprint/SizeCharts';

export const metadata = {
    title: 'Size Chart — CodeSprint 11 × Cicada | IEEE SB IIT',
    description: 'Fit guide for the CodeSprint 11 × Cicada drop — regular and hoodie size charts, all dimensions in inches.',
};

export default function SizeChartPage() {
    return (
        <main className="min-h-screen bg-cs11-bg text-white">
            <SmoothScroll />
            <Header />
            <SizeCharts />
            <Footer />
        </main>
    );
}
