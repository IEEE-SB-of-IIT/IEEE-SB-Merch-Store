import { ReactNode } from "react";
import { Outfit, Space_Grotesk, Antonio, Courier_Prime, Space_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../components/AuthProvider";
import CartDrawer from "../components/CartDrawer";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const courierPrime = Courier_Prime({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-courier' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' });

const aerosoldier = localFont({
    src: '../public/fonts/Aerosoldier_PERSONAL_USE_ONLY.otf',
    variable: '--font-aerosoldier'
});

const drukBold = localFont({
    src: '../public/fonts/Druk-Bold-Trial.otf',
    variable: '--font-druk'
});

export const metadata = {
    title: "IEEE SB Merch Store",
    description: "Official Merchandise Store for IEEE Student Branch",
};



export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${outfit.variable} ${spaceGrotesk.variable} ${aerosoldier.variable} ${drukBold.variable} ${courierPrime.variable} ${spaceMono.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <AuthProvider>
                        <CartProvider>
                            {children}
                            <CartDrawer />
                        </CartProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
