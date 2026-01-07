import { ReactNode } from "react";
import { Outfit, Space_Grotesk, Bebas_Neue } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });

const aerosoldier = localFont({
    src: '../public/fonts/Aerosoldier_PERSONAL_USE_ONLY.otf',
    variable: '--font-aerosoldier'
});

export const metadata = {
    title: "IEEE SB Merch Store",
    description: "Official Merchandise Store for IEEE Student Branch",
};



export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`${outfit.variable} ${spaceGrotesk.variable} ${aerosoldier.variable} ${bebasNeue.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
