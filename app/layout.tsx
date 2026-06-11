import { ReactNode } from "react";
import { Space_Grotesk, Space_Mono, EB_Garamond, Rajdhani, Manrope } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../components/AuthProvider";
import CartDrawer from "../components/CartDrawer";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-space-mono' });

// CodeSprint 11 official fonts
const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-garamond', style: ['normal', 'italic'] });
const rajdhani = Rajdhani({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-rajdhani' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

const drukBold = localFont({
    src: '../public/fonts/Druk-Bold-Trial.otf',
    variable: '--font-druk'
});

import { UIProvider } from "../context/UIContext";
import SearchOverlay from "../components/SearchOverlay";
import GlobalProductModalWrapper from "@/components/GlobalProductModalWrapper";
import Preloader from "@/components/Preloader";

export const metadata = {
    title: "CodeSprint 11 — Official Merch | IEEE SB IIT",
    description: "Official CodeSprint 11 merchandise — limited edition drops by the IEEE Student Branch of IIT",
    icons: {
        icon: "/images/favicon.png",
        apple: "/images/favicon.png",
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${drukBold.variable} ${spaceMono.variable} ${ebGaramond.variable} ${rajdhani.variable} ${manrope.variable} font-sans antialiased`}>
                <UIProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            <CartProvider>
                                {children}
                                <CartDrawer />
                                <SearchOverlay />
                                <GlobalProductModalWrapper />
                                <Preloader />
                            </CartProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </UIProvider>
            </body>
        </html>
    );
}
